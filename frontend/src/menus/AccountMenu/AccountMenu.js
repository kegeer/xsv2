// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';

import {
  developers,
  githubIssuesUrl,
  mailToUrl,
  spectrumUrl,
} from 'shared/utils/routeHelpers';

const propsTypes = {
  label: PropTypes.node,
  history: PropTypes.object,
  setActiveModal: PropTypes.func,
  auth: PropTypes.object,
};

class AccountMenu extends Component {
  handleOpenKeyboardShortcuts = () => {
    this.props.setActiveModal('keyboard-shortcuts');
  };

  handleOpenSettings = () => {
    this.props.history.push('/settings');
  };

  handleLogout = () => {
    this.props.logout();
  };

  render() {
    return (
      <DropdownMenu
        style={{ marginRight: 10, marginTop: -10 }}
        label={this.props.label}
      >
        <DropdownMenuItem onClick={this.handleOpenSettings}>
          Settings
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={this.handleOpenKeyboardShortcuts}>
          Keyboard shortcuts
        </DropdownMenuItem>
        <DropdownMenuItem href={developers()} target="_blank">
          API documentation
        </DropdownMenuItem>
        <hr />
        <DropdownMenuItem href={spectrumUrl()} target="_blank">
          Community
        </DropdownMenuItem>
        <DropdownMenuItem href={mailToUrl()} target="_blank">
          Send us feedback
        </DropdownMenuItem>
        <DropdownMenuItem href={githubIssuesUrl()} target="_blank">
          Report a bug
        </DropdownMenuItem> */}
        <hr />
        <DropdownMenuItem onClick={this.handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenu>
    );
  }
}

export default withRouter(AccountMenu);
