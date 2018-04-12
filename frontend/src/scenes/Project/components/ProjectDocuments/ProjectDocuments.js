import React from 'react';
import HelpText from 'components/HelpText';
import Subheading from 'components/Subheading';
import DocumentList from 'components/DocumentList';

const ProjectDocuments = ({
  project
}) => {
  const documents = project.documents || [];

  return (documents.length > 0 ? (
    <React.Fragment>
      <Subheading>所有文章</Subheading>
      <DocumentList documents={documents} />
    </React.Fragment>
  ) : <HelpText>还没有创建任何文章</HelpText>);
};


export default ProjectDocuments;
