import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import CenteredContent from 'components/CenteredContent';
import DocumentList from 'components/DocumentList';
import FileList from 'components/FileList';
import PageTitle from 'components/PageTitle';
import Subheading from 'components/Subheading';
import { ListPlaceholder } from 'components/LoadingPlaceholder';

const propTypes = {
  getProjects: PropTypes.func
};

class Dashboard extends Component {
  state = {
    isLoaded: false
  };

  componentWillMount() {
    this.loadContent();
  }

  loadContent = async () => {
    this.setState({
      isLoaded: false
    });
    console.log('load projects');
    await this.props.getProjects()
    this.setState({
      isLoaded: true
    });
  };

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) return null;
    const { recentlyEditedDocuments, recentlyViewedFiles } = this.props;
    console.log(recentlyViewedFiles, recentlyEditedDocuments, 'recently');
    const hasRecentlyDocuments = recentlyEditedDocuments.length > 0;

    const hasRecentlyFiles = Object.values(recentlyViewedFiles).length > 0;

    const showContent = isLoaded || hasRecentlyDocuments || hasRecentlyFiles;
    return (
      <CenteredContent>
        <PageTitle title="home" />
        <h1>Home</h1>
        {showContent ? (
          <span>
            {hasRecentlyDocuments && [
              <Subheading key="edited">最近编辑过的文章</Subheading>,
              <DocumentList
                key="editedDocuments"
                documents={recentlyEditedDocuments}
                limit={5}
              />
            ]}
            {hasRecentlyFiles && [
              <Subheading key="files">最近查看的论文</Subheading>,
              <FileList key="recentlyFiles" files={recentlyViewedFiles} limit={5} />
            ]}
          </span>
        ) : (
          <ListPlaceholder count={5} />
        )}
      </CenteredContent>
    );
  }
}

Dashboard.propTypes = propTypes;

export default Dashboard;
