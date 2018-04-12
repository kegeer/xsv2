import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { flash } from 'shared/styles/animations';
import Badge from './Badge';

const Highlight = ({
  highlight,
  isScrolledTo,
  onMouseOver,
  onMouseOut,
  setActiveModal
}) => {
  console.log(isScrolledTo, 'scroll to')
  if (!highlight.selectors || !highlight.selectors.pdfRectangles) return null;
  const { pdfRectangles, isBackwards } = highlight.selectors;
  const top = isBackwards;
  const length = pdfRectangles.length;
  const color = highlight.color;
  const count = highlight.annotations ? highlight.annotations.length : 0;
  return (
    <StyledHighlightLayer id={highlight.id}>
      {pdfRectangles.map((rect, index) => (
        <StyledHighlight
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          key={`highlight_${index}`}
          rect={rect}
          isScrolledTo={isScrolledTo}
        >
          <Badge
            count={count}
            top={top}
            length={length}
            color={color}
            index={index}
            handleOnMouseDown={() =>
              setActiveModal('highlight', {
                highlightId: highlight.id
              })
            }
          />
        </StyledHighlight>
      ))}
    </StyledHighlightLayer>
  );
};

const StyledHighlightLayer = styled.div`
  user-select: none;
  -webkit-touch-callout: none;
  //opacity: 0.4;
  // do not lighten up colors by highlighting, e.g., black text remains black
  // although we the highlight is a layer on top of the text.
  mix-blend-mode: multiply;

  ${StyledHighlight} {
    transition: background-color 0.3s ease;
  }
`;
const StyledHighlight = styled.div`
  animation: ${props => (props.isScrolledTo ? `${flash} .45s ease-in-out` : 'none')};
  background-color: #e8ebed;
  position: absolute;
  border-radius: 2px;
  top: ${props => props.rect.top * 100}%;
  left: ${props => props.rect.left * 100}%;
  height: ${props => props.rect.height * 100}%;
  width: ${props => props.rect.width * 100}%;
`;

export default Highlight;
