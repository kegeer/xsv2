import React from 'react';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import breakpoint from 'styled-components-breakpoint';
import { color } from 'shared/styles/constants';
import Button from 'components/Button';
import ZoomInIcon from 'components/Icon/ZoomInIcon';
import ZoomOutIcon from 'components/Icon/ZoomOutIcon';
import CropIcon from 'components/Icon/CropIcon';

import Actions, { Action, Separator } from 'components/Actions';

const Toolbar = ({ zoomin, zoomout, enableAreaSelection }) => (
  <StyledToolbar row align="center" justify="flex-start">
    <Action>
      <StyledButton light onClick={zoomin}>
        <ZoomInIcon black />
      </StyledButton>
    </Action>
    <Action>
      <StyledButton light onClick={zoomout}>
        <ZoomOutIcon black />
      </StyledButton>
    </Action>
    <Action>
      <StyledButton light onClick={enableAreaSelection}>
        <CropIcon black />
      </StyledButton>
    </Action>
  </StyledToolbar>
);

const StyledButton = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  padding-top: 6px;
`;
const StyledToolbar = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  ${breakpoint('tablet')`
    padding: 1vw 1.475vw 8px 8px;
  `};
`;

export default Toolbar;
