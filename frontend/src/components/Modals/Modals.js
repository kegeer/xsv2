// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseModal from 'components/Modal';
import DocumentDelete from 'scenes/Document/modals/DocumentDelete';
import KeyboardShortcuts from 'scenes/KeyboardShortcuts';

import ProjectNew from 'scenes/Project/modals/ProjectNew';
import ProjectEdit from 'scenes/Project/modals/ProjectEdit';
import ProjectDelete from 'scenes/Project/modals/ProjectDelete';

import Highlight from 'scenes/Highlight'

const propTypes = {
  clearActiveModal: PropTypes.func,
  activeModalName: PropTypes.func,
  activeModalProps: PropTypes.func
};

class Modals extends Component {
  handleClose = () => {
    this.props.clearActiveModal();
  };

  render() {
    const { activeModalName, activeModalProps } = this.props.ui;
    const Modal = ({
      name,
      children,
      ...rest
    }) => (
      <BaseModal
        ariaHideApp={false}
        isOpen={activeModalName === name}
        onRequestClose={this.handleClose}
        {...rest}>
        {React.cloneElement(children, activeModalProps)}
      </BaseModal>
    );


    return (
      <span>
        <Modal name="document-delete" title="删除document">
          <DocumentDelete onSubmit={this.handleClose} />
        </Modal>
        <Modal name="keyboard-shortcuts" title="快捷键">
          <KeyboardShortcuts />
        </Modal>
        <Modal name="project-new" title="创建新的Project">
          <ProjectNew onSubmit={this.handleClose}  />
        </Modal>
        <Modal name="project-edit" title="修改Project">
          <ProjectEdit onSubmit={this.handleClose}  />
        </Modal>
        <Modal name="project-delete" title="删除Project">
          <ProjectDelete onSubmit={this.handleClose}  />
        </Modal>
        <Modal name="highlight" title="Annotations">
          <Highlight />
        </Modal>
      </span>
    );
  }
}

export default Modals;
