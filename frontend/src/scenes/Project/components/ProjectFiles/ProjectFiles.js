import React from 'react';
import HelpText from 'components/HelpText';
import Subheading from 'components/Subheading';
import FileList from 'components/FileList';

const ProjectFiles = ({
  project
}) => {
  const files = project.files || [];
  console.log(files, 'files');

  return (files.length > 0 ? (
    <React.Fragment>
      <Subheading>所有论文</Subheading>
      <FileList files={files} />
    </React.Fragment>
  ) : <HelpText>还没有上传任何文章</HelpText>);
};


export default ProjectFiles;
