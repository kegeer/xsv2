import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { rotate, dash } from 'shared/styles/animations';

const LoadingSpinner = ({ progress, size }) => {
  const width = 50;
  const total = 124;
  const isProgress = progress && progress > 0 && progress < 1;
  const progressStyle = isProgress
    ? {
      strokeDasharray: `${total * progress}, 200`
    }
    : {};
  const getTransformStyle = () => {
    if (size === 'xs') {
      return { transform: 'scale(0.2' };
    } else if (size === 'sm') {
      return { transform: 'scale(0.5)' };
    }
  };

  const transformStyle = getTransformStyle();
  return (
    <StyledLoader isProgress={isProgress} style={transformStyle}>
      <StyledSvg viewBox={`${width / 2} ${width / 2} ${width} ${width}`}>
        <StyledCircle
          cx={width}
          cy={width}
          r={((width / 2) - 5)}
          fill="none"
          strokeWidth="2"
          strokeMiterlimit="10"
          style={progressStyle}
        />
      </StyledSvg>
    </StyledLoader>
  );
};

const StyledLoader = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100px;
  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
  ${StyledSvg} {
    ${props =>
    (props.isProgress
      ? {
        transform: 'rotate(-90deg)'
      }
      : { animation: `${rotate} 2s linear infinite` })};
  }
  ${StyledCircle} {
    ${props =>
    (props.isProgress
      ? {
        transition: '0.1s ease all'
      }
      : { animation: `${dash} 1.5s ease-in-out infinite` })};
  }
  `;

const StyledSvg = styled.svg`
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  `;
const StyledCircle = styled.circle`
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke: ${color.primary};
  stroke-linecap: round;
  `;

export default LoadingSpinner;
