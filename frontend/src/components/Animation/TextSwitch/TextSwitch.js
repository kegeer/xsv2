import React from 'react';
import styled from 'styled-components';

const TextSwitch = ({ children, swap, height }) => {
  const outerStyle = {
    height: `${height}px`
  };
  const innerStyle = swap
    ? {
      transform: `translateY(-${height}px)`
    }
    : {};

  return (
    <Outer style={outerStyle}>
      <Inner style={innerStyle}>{children}</Inner>
    </Outer>
  );
};

const Outer = styled.div`
  overflow: hidden;
`;
const Inner = styled.div`
  transition: transform 0.1s ease;
`;

export default TextSwitch;
