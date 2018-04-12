import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Subheading from 'components/Subheading';
import DocumentList from 'components/DocumentList';
import FileList from 'components/FileList';
import PinIcon from 'components/Icon/PinIcon';
import Button from 'components/Button';
import HelpText from 'components/HelpText';
import Flex from 'shared/components/Flex';

const Wrapper = styled(Flex)`
  margin: 20px 0;
  text-align: center;
  h5 {
    display: block;
    line-height: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: block;
  a {
    margin-right: 1rem;
  }
`;

const TinyPinIcon = styled(PinIcon)`
  position: relative;
  top: 4px;
  opacity: 0.8;
`;

class ProjectOverview extends Component {
  renderEmptyProject = project => (
    <Wrapper column>
      <HelpText>
        项目没有任何内容 <br />
        从写第一篇文章或上传第一篇论文来开启这个项目
      </HelpText>

      <ButtonGroup>
        <Link to={`${this.props.match.url}/new`}>
          <Button light>写一篇文章</Button>
        </Link>
        <Button light onClick={this.props.onNewFile}>上传一片文献</Button>
      </ButtonGroup>
    </Wrapper>
  );
  render() {
    const {
      project,
      pinnedDocuments,
      pinnedFiles,
      recentlyEditedDocuments,
      recentlyViewedFiles
    } = this.props;

    const hasDocuments =
      project && project.documents && project.documents.length > 0;
    const hasFiles = project && project.files && project.files.length > 0;

    if (!hasDocuments && !hasFiles) {
      return this.renderEmptyProject(project);
    }


    return (
      <React.Fragment>
        {pinnedDocuments.length > 0 && (
          <React.Fragment>
            <Subheading>
              <TinyPinIcon size={18} /> 置顶文章
            </Subheading>
            <DocumentList documents={pinnedDocuments} />
          </React.Fragment>
        )}
        <Subheading>最近编辑</Subheading>
        <DocumentList documents={recentlyEditedDocuments} limit={5} />

        {pinnedFiles.length > 0 && (
          <React.Fragment>
            <Subheading>
              <TinyPinIcon size={18} /> 置顶论文
            </Subheading>
            <FileList files={pinnedFiles} />
          </React.Fragment>
        )}
        <Subheading>最近查看</Subheading>
        <FileList files={recentlyViewedFiles} limit={5} />
      </React.Fragment>
    );
  }
}

export default ProjectOverview;
