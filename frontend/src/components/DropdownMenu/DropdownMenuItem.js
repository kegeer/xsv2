import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

const propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

const DropdownMenuItem = ({ onClick, children, ...rest }) => (
  <MenuItem onClick={onClick} {...rest}>
    {children}
  </MenuItem>
);

const MenuItem = styled.a`
  display: flex;
  margin: 0;
  padding: 5px 10px;
  height: 32px;

  color: ${color.slateDark};
  justify-content: left;
  align-items: center;
  cursor: pointer;
  font-size: 15px;

  svg {
    margin-right: 8px;
  }

  &:hover {
    color: ${color.white};
    background: ${color.primary};

    svg {
      fill: ${color.white};
    }
  }
`;

export default DropdownMenuItem;
