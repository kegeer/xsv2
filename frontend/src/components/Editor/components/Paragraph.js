// @flow
import React from 'react';
import { Document } from 'slate';
import Placeholder from './Placeholder';

const Link = ({
  attributes,
  editor,
  node,
  parent,
  children,
  readOnly
}) => {
  const parentIsDocument = parent instanceof Document;
  const firstParagraph = parent && parent.nodes.get(1) === node;
  const lastParagraph = parent && parent.nodes.last() === node;
  const showPlaceholder =
    !readOnly &&
    parentIsDocument &&
    firstParagraph &&
    lastParagraph &&
    !node.text;

  return (
    <p {...attributes}>
      {children}
      {showPlaceholder && (
        <Placeholder contentEditable={false}>
          {editor.props.bodyPlaceholder}
        </Placeholder>
      )}
    </p>
  );
}

export default Link
