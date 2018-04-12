import React from 'react';
import PropTypes from 'prop-types';
import ArrowKeyNavigation from 'boundless-arrow-key-navigation';
import DocumentPreview from 'components/DocumentPreview';


const propTypes = {
  documents: PropTypes.array,
  showCollection: PropTypes.bool,
  limit: PropTypes.number,
};

const DocumentList = ({
  inProject,
  projectId,
  documents,
  limit,
  showCollection
}) => {
  const documentsProps = documents || [];
  const documentsToShow = limit ? documentsProps.splice(0, limit) : documentsProps;

  return (
    <ArrowKeyNavigation
      mode={ArrowKeyNavigation.mode.VERTICAL}
      defaultActiveChildIndex={0}
    >
      {
        documentsToShow.map(document => (
          <DocumentPreview
            key={document}
            document={document}
            showCollection={showCollection}
          />
        ))
      }
    </ArrowKeyNavigation>
  );
};

DocumentList.propTypes = propTypes;

export default DocumentList;
