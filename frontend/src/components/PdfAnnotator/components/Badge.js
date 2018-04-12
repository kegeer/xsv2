import React from 'react';
import styled from 'styled-components';

const Badge = ({ area, top, length, color, index, handleOnMouseDown, count }) => {
  const style = top
    ? {
      transform: 'translateX(-50%)',
      top: '-10px',
      borderBottomRightRadius: 0
    }
    : {
      right: 0,
      transform: 'translateX(50%)',
      bottom: '-10px',
      borderTopLeftRadius: 0
    };
  const styles = {
    cursor: 'pointer',
    position: 'absolute',
    height: '20px',
    borderRadius: '10px',
    minWidth: '20px',
    background: color || 'yellow',
    color: '#fff',
    lineHeight: '20px',
    textAlign: 'center',
    padding: '0 6px',
    fontSize: '12px',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    transformOrigin: '-10% center',
    boxShadow: '0 0 0 1px #DAE1E9',
    overflow: 'hidden'
  };
  if (area) {
    return (
      <sub
        style={{
          ...styles,
          ...style
        }}
        onMouseDown={handleOnMouseDown}
      >
        <StyledSpan>{ count }</StyledSpan>
      </sub>
    );
  }

  if (top && index === 0) {
    return (
      <sup
        style={{
          ...styles,
          ...style
        }}
        onMouseDown={handleOnMouseDown}
      >
        <StyledSpan>{ count }</StyledSpan>
      </sup>
    );
  }
  if (!top && index === length - 1) {
    return (
      <sub
        style={{
          ...styles,
          ...style
        }}
        onMouseDown={handleOnMouseDown}
      >
        <StyledSpan>{ count }</StyledSpan>
      </sub>
    );
  }
  return null;
};

export default Badge;

const StyledSpan = styled.span`
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  height: 20px;
`;
