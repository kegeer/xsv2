import React from 'react';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';

const TimelineWrapper = ({
  children
}) => (
  <StyledItem>
    <Flex align="flex-start" justify="flex-start" row>
      <Marker />
      <Flex>
        { children }
      </Flex>
    </Flex>
  </StyledItem>
);

const StyledItem = styled.div`
  position: relative;
  border-left: 1px solid #ddd;
  padding: 15px 0;
  width: 100%;

  @media (max-width: 599px) {
    border-left: none;
  }
`;

const Marker = styled.div`
  width: 12px;
  min-width: 12px;
  height: 12px;
  border: 1px solid #ddd;
  border-radius: 50%;
  margin-left: -6px;
  margin-right: 24px;
  background: white;

  @media (max-width: 599px) {
    display: none;
  }
`;

const Extra  = styled.div`
  margin-top: 15px;
`;


export default TimelineWrapper;
