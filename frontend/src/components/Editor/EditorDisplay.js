import React, { Component } from 'react';
import markdownIt from 'markdown-it';
import htmlToReact from 'html-to-react';

const htmlToReactParser = new htmlToReact.Parser();

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const processingInstruction = [{
  shouldProcessNode: node => true,
  processNode: new htmlToReact.ProcessNodeDefinitions(React).processDefaultNode,
}];


class EditorDisplay extends Component {
  getMarkdownText(value) {
    const rawmarkup = `<div>${md.render(value || '')}</div>`;
    return htmlToReactParser.parseWithInstructions(rawmarkup, () => true, processingInstruction);
  }

  render() {
    const { value, onClick } = this.props;
    return (
      <div onClick={onClick}>
        <div>
          {this.getMarkdownText(value)}
        </div>
      </div>
    );
  }
}

export default EditorDisplay;
