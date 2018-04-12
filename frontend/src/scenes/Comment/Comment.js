import React, { Component } from 'react';

import { SimpleEditor } from 'components/Editor';

class Comment extends Component {
  onChange = (value) => {
    console.log(value, 'value');
  }
  onSave = (value) => {
    console.log(value, 'value');
  }

  render() {
    return (
      <SimpleEditor
        text=""
        onChange={this.onChange}
        readOnly={false}
        onSave={this.onSave}
      />
    );
  }
}


export default Comment;
