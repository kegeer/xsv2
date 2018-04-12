import React, { Component } from 'react';
import Button from 'components/Button';
import Input from 'components/Input';
import AnnotatorIcon from 'components/Icon/AnnotatorIcon';
import SubmitIcon from 'components/Icon/SubmitIcon';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { SimpleEditor } from 'components/Editor';
import HighlightNew from './HighlighhtNew';

class Tip extends Component {
  state = {
    compact: true
  };
  // for tip contianer
  componentDidUpdate(nextProps, nextState) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen, selectors, style, user } = this.props;
    const { compact } = this.state;
    const top = !selectors.isBackwards;
    return (
      <StyledTip>
        {compact ? (
          <Button
            icon={
              <AnnotatorIcon
                light
                transform={`rotate(${top ? 0 : '180deg'})`}
              />
            }
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          />
        ) : (
          <HighlightNew
            user={user}
            onConfirm={(annotation, color) => onConfirm(annotation, color)}
          />
        )}
      </StyledTip>
    );
  }
}

const StyledTip = styled.div`
  min-width: 18em;
`;

const StyledButton = styled(Button)`
  margin-top: -10px;
  width: 100%;
`;
const StyledCompact = styled.div`
  cursor: pointer;
  background-color: #3d464d;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
`;

const StyledCard = styled.div`
  padding: 3px 6px;
  background: ${color.smoke};
  background-clip: padding-box;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(37, 40, 43, 0.2);
  textarea {
    padding: 5px;
    font-size: 16px;
    width: 240px;
    height: 154px;
    overflow-y: hidden;
    background: ${color.smokeLight};
    color: ${color.text};
    outline: none;
    border: none;
  }
`;
export default Tip;
