import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link, Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import { darken } from 'polished';
import { color } from 'shared/styles/constants';
import { newDocumentUrl, matchDocumentSlug } from 'utils/routeHelpers';
import Grid from 'styled-components-grid';

import Search from 'scenes/Search';
import ProjectMenu from 'menus/ProjectMenu';
import Actions, { Action, Separator } from 'components/Actions';
import CenteredContent from 'components/CenteredContent';
import ProjectIcon from 'components/Icon/ProjectIcon';
import NewDocumentIcon from 'components/Icon/NewDocumentIcon';
import UploadIcon from 'components/Icon/UploadIcon';
import PinIcon from 'components/Icon/PinIcon';
import { ListPlaceholder } from 'components/LoadingPlaceholder';

import PageTitle from 'components/PageTitle';
import Flex from 'shared/components/Flex';
import Tabs, { TabLink } from 'components/Tabs';
import getDataTransferFiles from 'utils/getDataTransferFiles';
import Document from 'scenes/Document';
import { LoadingSpinner } from 'components/Loading';

import ProjectDocuments from './components/ProjectDocuments';
import ProjectFiles from './components/ProjectFiles';
import ProjectOverview from './components/ProjectOverview';

const propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,

  ui: PropTypes.object,
  project: PropTypes.object,
  pinnedDocuments: PropTypes.array,
  pinnedFiles: PropTypes.array,
  getPinnedFiles: PropTypes.func,
  getPinnedDocuments: PropTypes.func
};

class ProjectScene extends Component {
  state = {
    project: null,
    isFetching: false
  };

  componentDidMount() {
    this.loadContent(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.loadContent(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.clearActiveProject();
  }

  loadContent = async (props) => {
    this.setState({ isFetching: true });
    const { id: projectId } = props.match.params || this.props.match.params;
    await this.props.getProject(projectId);
    const { project } = props;
    if (project) {
      this.setState(
        {
          project
        },
        () => {
          this.props.setActiveProject(project);
          this.setState({ isFetching: false });
        }
      );
    }
  };

  onNewDocument = (ev) => {
    ev.preventDefault();

    if (this.state.project) {
      this.props.history.push(`/projects/${this.state.project.id}/new`);
    }
  };

  onNewFile = (ev) => {
    ev.preventDefault();

    // simulate a click on the file upload input element
    this.files.click();
  };

  onFilePicked = async (ev) => {
    const files = getDataTransferFiles(ev);
    // console.log(this.state.library.id, 'libraryid');
    // await this.props.uploadFile({
    //   files,
    //   libraryId: this.state.library.id,
    // });
    // await uploadFile(files);
    /* eslint-disable */
    for (const file of files) {
      await this.props.uploadFile({
        file,
        projectId: this.state.project.id
      });
    }
    /* eslint-enable */
  };

  /* 创建新文档和上传新文件 */
  renderActions = () => (
    <Actions align="center" justify="flex-end">
      <Action>
        <ProjectMenu
          history={this.props.history}
          project={this.state.project}
        />
        <Separator />
        <Action>
          <a onClick={this.onNewDocument}>
            <NewDocumentIcon />
          </a>
        </Action>
        <Action>
          <a onClick={this.onNewFile}>
            <UploadIcon />
          </a>
          <HiddenInput
            type="file"
            innerRef={ref => (this.files = ref)}
            onChange={this.onFilePicked}
            accept="application/pdf"
            multiple="multiple"
          />
        </Action>
      </Action>
    </Actions>
  );

  renderNotFound = () => <Search notFound />;
  renderLoading = percentage => (percentage ? (
    <LoadingSpinner progress={percentage} size="sm" />
  ) : null)

  // TODO 有待商讨是够单独为highligh建立一个页面，还是合并到论文当中去
  render() {
    const { project, isFetching } = this.state;
    if (!isFetching && !project) {
      return this.renderNotFound();
    }
    const url = this.props.match.url;
    return (
      <CenteredContent>
        {project ? (
          <React.Fragment>
            <PageTitle title={project.name} />
            <Heading>
              <ProjectIcon color={project.color} size={40} expanded />{' '}
              {project.name}
            </Heading>
            <p>{project.summary}</p>
            <Tabs>
              <TabLink to={url} name="概览" />
              <TabLink to={`${url}/files`} name="论文" />
              <TabLink to={`${url}/documents`} name="文档" />
            </Tabs>
            {this.renderLoading(this.props.percentage)}
            <Route
              exact
              path={url}
              render={() => (
                <ProjectOverview onNewFile={this.onNewFile} {...this.props} />
              )}
            />
            <Route
              exact
              path={`${url}/files`}
              render={() => <ProjectFiles {...this.props} />}
            />
            <Route
              exact
              path={`${url}/documents`}
              render={() => <ProjectDocuments {...this.props} />}
            />
            <Route
              exact
              path={`${url}/doc/${matchDocumentSlug}`}
              render={() => <Document />}
            />
          </React.Fragment>
        ) : (
          <ListPlaceholder count={5} />
        )}

        {this.props.children}
        {this.renderActions()}
      </CenteredContent>
    );
  }
}

const Container = styled(Flex)`
  width: 100%;
  height: 100vh;
  flex-direction: row;
  justify-content: flex-start;
`;

const StyleCenteredContent = styled(CenteredContent)`
  height: 100%;
  background: ${darken(0.03, color.smokeLight)};
`;

const HiddenInput = styled.input`
  position: absolute;
  top: -100px;
  left: -100px;
  visibility: hidden;
`;

const TinyPinIcon = styled(PinIcon)`
  position: relative;
  top: 4px;
  opacity: 0.8;
`;

const Heading = styled.h1`
  display: flex;

  svg {
    margin-left: -6px;
    margin-right: 6px;
  }
`;

const Wrapper = styled(Flex)`
  margin: 10px 0;
`;

export default withRouter(ProjectScene);
