import React from 'react';
import styled from 'styled-components';
import { flash } from 'shared/styles/animations';
import Badge from './Badge';

const AreaHighlight = ({ highlight, setActiveModal, isScrolledTo, ...restProps }) => {
  const { id, selectors: { pdfRectangles: rect }, color } = highlight;
  const count = highlight.annotations ? highlight.annotations.length : 0;

  return (
    <StyledDiv rect={rect} id={id} color={color} isScrolledTo={isScrolledTo} {...restProps}>
      <Badge
        area
        color={color}
        count={count}
        handleOnMouseDown={() =>
          setActiveModal('highlight', { highlightId: id })
        }
      />
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  animation: ${props => (props.isScrolledTo ? `${flash} .45s ease-in-out` : 'none')};
  border: 1px dotted ${props => props.color || '#E8EBED'};
  background-color: #e8ebed;
  opacity: 0.35;
  position: absolute;
  top: ${props => props.rect.top * 100}%;
  left: ${props => props.rect.left * 100}%;
  height: ${props => props.rect.height * 100}%;
  width: ${props => props.rect.width * 100}%;
`;

export default AreaHighlight;
