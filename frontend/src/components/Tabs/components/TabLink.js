import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { color, fontWeight } from 'shared/styles/constants';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import CollapsedIcon from 'components/Icon/CollapsedIcon';

const activeStyle = {
  color: color.black,
  fontWeight: fontWeight.medium,
  borderBottom: `1px solid ${color.primary}`
};
const StyledLink = styled(NavLink)`
  flex-shrink: 0;
  position: relative;
  //overflow: hidden;
  //text-overflow: ellipsis;
  padding: 4px 8px;
  color: ${color.slateDark};
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: ${color.text};
  }
`;

const TabLink = ({
  to,
  active,
  name
}) => (
  <Flex row>
    <StyledLink
      exact
      activeStyle={activeStyle}
      style={active ? activeStyle : undefined}
      to={to}
    >
      {name}
    </StyledLink>
  </Flex>
);


export default TabLink;
