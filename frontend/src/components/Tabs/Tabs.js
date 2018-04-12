import React from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';


const Tabs = ({
  children
}) => (
  <TabsWrapper>
    <TabsInner row>
      {children}
    </TabsInner>
  </TabsWrapper>
);

const TabsWrapper = styled.div`
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  min-height: 37px;
  &:after {
    content:'';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid ${color.smokeDark};
  }
`;

const TabsInner = styled(Flex)`
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  margin-bottom: -10px;
  > a {
    min-height: 37px;
    color: ${color.black};
    position: relative;
    margin-right: 25px;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    &:last-child {
      margin-right: 0;
    }
    &.active,
    &:hover {
      color: ${color.primary};
    }
    &:active:after {
      opacity: 1;
    }
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-bottom: 2px solid ${color.smokeDark};
      opacity: 0;
      transition: 0.2s solid ${color.primary};
      z-index: 1;
    }
  }
`;

export default Tabs

