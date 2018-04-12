// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

export default class TodoItem extends Component {
  handleChange = (ev) => {
    const { checked } = ev.target;
    const { editor, node } = this.props;
    editor.change(change =>
      change.setNodeByKey(node.key, { data: { checked } })
    );
  };

  render() {
    const { children, node, attributes, readOnly } = this.props;
    const checked = node.data.get('checked');

    return (
      <ListItem checked={checked} {...attributes}>
        <Input
          type="checkbox"
          checked={checked}
          onChange={this.handleChange}
          disabled={readOnly}
          contentEditable={false}
        />
        {children}
      </ListItem>
    );
  }
}

const ListItem = styled.li`
  padding-left: 1.4em;
  position: relative;

  > p > span {
    color: ${props => (props.checked ? color.slateDark : 'inherit')};
    text-decoration: ${props => (props.checked ? 'line-through' : 'none')};
  }
`;

const Input = styled.input`
  position: absolute;
  left: 0;
  top: 0.4em;
`;
