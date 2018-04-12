import React, { Component } from 'react';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';

import { Editor } from 'slate-react';
import { Value } from 'slate';
import { isKeyHotkey } from 'is-hotkey';

import Flex from 'shared/components/Flex';
import { color } from 'shared/styles/constants';
import BoldIcon from 'components/Icon/BoldIcon';
import CodeIcon from 'components/Icon/CodeIcon';
import Heading1Icon from 'components/Icon/Heading1Icon';
import Heading2Icon from 'components/Icon/Heading2Icon';
import ItalicIcon from 'components/Icon/ItalicIcon';
import BlockQuoteIcon from 'components/Icon/BlockQuoteIcon';
import StrikethroughIcon from 'components/Icon/StrikethroughIcon';
import UnderLineIcon from 'components/Icon/UnderLineIcon';

import BulletedListIcon from 'components/Icon/BulletedListIcon';
import OrderedListIcon from 'components/Icon/OrderedListIcon';
import TodoListIcon from 'components/Icon/TodoListIcon';

import PenIcon from 'components/Icon/PenIcon';
import Button from 'components/Button';
import ColorPicker from 'components/ColorPicker';

import ToolbarButton from './components/Toolbar/components/ToolbarButton';
import renderMark from './marks';

import initialValue from './value.json';
import createRenderNode from './nodes';
import createPlugins from './plugins';
import Markdown from './serializer';

const DEFAULT_NODE = 'paragraph';

/*
*   Define hot key match
* */

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

class SimpleEditor extends Component {
  constructor(props) {
    super(props);

    this.renderNode = createRenderNode({ onInsertImage: this.insertImage });
    this.plugins = createPlugins({ onImageUploadStart: props.onImageUploadStart, onImageUploadStop: props.onImageUploadStop });

    this.state = {
      editorValue: Markdown.deserialize(props.text),
      editorLoaded: false
    };
  }
  componentDidMount() {
    if (this.props.readOnly) return;
    if (this.props.text) {
      this.focusAtEnd();
    } else {
      this.focusAtStart();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.readOnly && !this.props.readOnly) {
      this.focusAtEnd();
    }
  }

  setEditorRef = (ref) => {
    this.editor = ref;
    /* 可以应用到pdfhighlight定位上面去 */
    this.setState({
      editorLoaded: true
    });
  }

  onChange = (change) => {
    if (this.state.editorValue !== change.value) {
      this.props.onChange(Markdown.serialize(change.value));
      this.setState({
        editorValue: change.value
      });
    }
  }

  focusAtStart = () => this.editor && this.editor && this.editor.change((change) => {
    change.collapseToStartOf(change.value.document).focus();
  })

  focusAtEnd = () => this.editor && this.editor.change(change => change.collapseToEndOf(change.value.document).focus())


  insertImage = () => {}

  hasMark = type =>
    // const { value } = this.state;
    // return value.activeMarks.some(mark => mark.type === type);
    this.editor && this.editor.value.marks.some(mark => mark.type === type)
  ;

  hasBlock = (type) => {
    const { value } = this.state;
    // const { startBlock } = value
    // return startBlock && startBlock.type === type
    // return value.blocks.some(node => node.type === type);
    if (!this.editor) return;
    const { startBlock } = this.editor.value;
    return startBlock && startBlock.type === type;
  };

  onKeyDown = (event, change) => {
    let mark;
    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return;
    }
    event.preventDefault();
    change.toggleMark(mark);
    return true;
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    // const { value } = this.state;
    // const change = value.change().toggleMark(type);
    // this.onChange(change);
    this.editor.change(change => change.toggleMark(type));
  };

  onClickBlock = (event, type) => {
    event.preventDefault();
    // this.editor.change(change => change.setBlock(type));
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        this.editor.change(change => change.setBlock(isActive ? DEFAULT_NODE : type))
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        this.editor.change(change => change.setBlock(isActive ? DEFAULT_NODE : type));
      }
    } else {
      const isList = this.hasBlock('list-item');
      const { value } = this.editor;
      const { document } = value;
      const isType = value.blocks.some(
        block => !!document.getClosest(block.key, parent => parent.type === type)
      );
      if (isList && isType) {
        this.editor.change(change => change.setBlock(DEFAULT_NODE).unwrapBlock('bulleted-list').unwrapBlock('numbered-list'));
      } else if (isList) {
        this.editor.change(change => change.unwrapBlock(
          type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
        ).wrapBlock(type));
      }
    }
  }

  renderToolbar() {
    const { readOnly } = this.props;

    return readOnly ? null : (
      <ToolbarMenu>
        {this.renderMarkButton('bold', BoldIcon)}
        {this.renderMarkButton('italic', ItalicIcon)}
        {this.renderMarkButton('underlined', UnderLineIcon)}
        {this.renderMarkButton('deleted', StrikethroughIcon)}
        {this.renderMarkButton('code', CodeIcon)}
        <div
          style={{
            // height: '100%',
            width: '1px',
            background: '#000',
            opacity: 0.2,
            display: 'inline-block',
            marginLeft: '10px'
          }}
        />
        {this.renderBlockButton('heading1', Heading1Icon)}
        {this.renderBlockButton('heading2', Heading2Icon)}
        {this.renderBlockButton('block-quote', BlockQuoteIcon)}
        {this.renderBlockButton('bulleted-list', BulletedListIcon)}
        {this.renderBlockButton('ordered-list', OrderedListIcon)}
        {/* {this.renderBlockButton('numbered-list', 'format_list_numbered')}
        {this.renderBlockButton('bulleted-list', 'format_list_bulleted')} */}
      </ToolbarMenu>
    );
  }

  renderMarkButton = (type, IconClass) => {
    const isActive = this.hasMark(type);
    const onMouseDown = event => this.onClickMark(event, type);

    return (
      <ToolbarButton onMouseDown={onMouseDown} active={isActive}>
        <IconClass black />
      </ToolbarButton>
    );
  };

  renderBlockButton = (type, IconClass) => {
    const isActive = this.hasBlock(type);
    const onMouseDown = ev =>
      this.onClickBlock(ev, isActive ? 'paragraph' : type);
    return (
      <ToolbarButton onMouseDown={onMouseDown} active={isActive}>
        <IconClass black />
      </ToolbarButton>
    );
  };


  renderEditor() {
    const { readOnly } = this.props;
    return (
      <EditorWrapper>
        <StyledEditor
          innerRef={this.setEditorRef}
          plugins={this.plugins}
          placeholder="Drop some idea"
          value={this.state.editorValue}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={renderMark}
          readOnly={readOnly}
          spellCheck={!readOnly}
        />
      </EditorWrapper>
    );
  }
  render() {
    return (
      <MaxWidth column auto readOnly={this.props.readOnly}>
        {this.renderToolbar()}
        {this.renderEditor()}
      </MaxWidth>
    );
  }
}

const ButtonWrapper = styled(Flex)`
  width: 100%;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
`;
const MaxWidth = styled(Flex)`
  justify-content: flex-start;
  flex-direction: column;
  //width: 500px;
  align-items: flex-start;
  border: ${props => (props.readOnly ? 'none' : `1px solid ${color.smokeDark}`)};
  
  box-shadow: ${props => (props.readOnly ? 'none' : `1px 1px 10px ${color.smokeDark}`)};
  padding: 0 20px;
  max-width: 100vw;
  //max-width: 100%;
  height: 100%;
  background: #fff;
  ${breakpoint('tablet')`
    padding: 0;
    max-width: 48em;
  `};
`;

const StyledEditor  = styled(Editor)`
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4em;
  width: 100%;
  color: #1b2830;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
  }
  h1 {
    font-size: 1.4em;
  }
  h2 {
    font-size: 1.1em;
  }

  ul,
  ol {
    margin: 1em 0.1em;
    padding-left: 1em;

    ul,
    ol {
      margin: 0.1em;
    }
  }

  p {
    position: relative;
    margin-top: 1.2em;
    margin-bottom: 1.2em;
  }

  a:hover {
    text-decoration: ${({ readOnly }) => (readOnly ? 'underline' : 'none')};
  }

  li p {
    display: inline;
    margin: 0;
  }

  .todoList {
    list-style: none;
    padding-left: 0;

    .todoList {
      padding-left: 1em;
    }
  }

  .todo {
    span:last-child:focus {
      outline: none;
    }
  }

  blockquote {
    border-left: 3px solid #efefef;
    margin: 1.2em 0;
    padding-left: 10px;
    font-style: italic;
  }

  table {
    border-collapse: collapse;
  }

  tr {
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: bold;
  }

  th,
  td {
    padding: 5px 20px 5px 0;
  }

  b,
  strong {
    font-weight: 600;
  }
`;
const EditorWrapper = styled.div`
  padding: 0px 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const ToolbarMenu = styled(Flex)`
  width: 100%;
  position: relative;
  padding: 6px 12px;
  border-bottom: 2px solid ${color.smoke};
  margin-bottom: 5px;
  justify-content: flex-end;
  > * {
    display: inline-block;
    + * {
      margin-left: 15px;
    }
  }
`;


export default SimpleEditor;
