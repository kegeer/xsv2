import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MoreIcon from 'components/Icon/MoreIcon';
import { DropdownMenu, DropdownMenuItem } from 'components/DropdownMenu';


const propTypes = {
  label: PropTypes.node,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  history: PropTypes.object,
  setActiveModal: PropTypes.func,
  // document: PropTypes.object,
  // documents: PropTypes.object,
  project: PropTypes.object,
};


class ProjectMenu extends Component {
  onEdit = (ev) => {
    ev.preventDefault();
    const { project } = this.props;
    this.props.setActiveModal('project-edit', { project });
  };

  onDelete = (ev) => {
    ev.preventDefault();
    const { project } = this.props;
    this.props.setActiveModal('project-delete', { project });
  };

  render() {
    const { project, label, onOpen, onClose } = this.props;

    return (
      <DropdownMenu
        label={label || <MoreIcon />}
        onOpen={onOpen}
        onClose={onClose}
      >
        {project && (
          <React.Fragment>
            <DropdownMenuItem onClick={this.onEdit}>Edit…</DropdownMenuItem>
            <hr />
            <DropdownMenuItem onClick={this.onDelete}>Delete…</DropdownMenuItem>
          </React.Fragment>
        )}

      </DropdownMenu>
    );
  }
}

const HiddenInput = styled.input`
  position: absolute;
  top: -100px;
  left: -100px;
  visibility: hidden;
`;

export default ProjectMenu;
