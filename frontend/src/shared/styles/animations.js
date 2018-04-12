// @flow
import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeAndScaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const pulsate = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

export const flash = keyframes`
  0% {
    background-color: #f08a24;
    opacity:1;
}
  22% {
    background-color: #FFD95C;
}
  77% {
    background-color: #f08a24;
}
  100% {
    background-color: #FFD95C;
}
`;
export const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;
export const dash = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
`;
