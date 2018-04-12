import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import TextSwitch from 'components/Animation/TextSwitch';
import Button from 'components/Button';
import { SimpleEditor } from 'components/Editor';
import { UserAvatar } from 'components/Avatar';
import ColorPicker from 'components/ColorPicker';
import SubmitIcon from 'components/Icon/SubmitIcon';

class HighlightNew extends Component {
  state = {
    isFocused: false,
    annotation: '',
    color: '',
  }
  clickAnnotation = () => {
    this.setState({
      isFocused: true
    });
  };
  handleColor = (color) => {
    this.setState({ color });
  }

  handleClick = (e) => {
    let { annotation } = this.state;
    if (annotation.trim() === '') {
      annotation = null;
    }
    this.props.onConfirm(annotation, this.state.color);
  }
  render() {
    const { user } = this.props;
    const { isFocused, annotation, color } = this.state;
    return (
      <React.Fragment>
        <StyledWrapper row onClick={this.clickAnnotation}>
          <AnnotationBody isFocused={isFocused}>
            <AnnotationHeader>
              <UserAvatar
                name={user.username}
                size={25}
                shape="square"
                style={{ marginRight: '10px' }}
              />
              <TextSwitch height={24} swap={isFocused}>
                <div>
                  <b>添加文字标注</b>
                </div>
                <div>
                  <b>{user.username}</b>
                </div>
              </TextSwitch>
            </AnnotationHeader>
            <AnnotationContent>
              {isFocused ? (
                <SimpleEditor
                  onChange={(value) => {
                    this.setState({
                      annotation: value
                    });
                  }}
                  text={annotation}
                  readOnly={false}
                />
              ) : null}
            </AnnotationContent>
          </AnnotationBody>
        </StyledWrapper>
        <ButtonWrapper>
          <ColorPicker onSelect={this.handleColor} inEditor color={color} />
          <Button
            icon={<SubmitIcon light />}
            onClick={this.handleClick}
            meutral>保存
          </Button>
        </ButtonWrapper>
      </React.Fragment>
    );
  }
}

const ButtonWrapper = styled(Flex)`
  background: #fff;
  border: 1px solid ${color.smokeDark};
  width: 100%;
  padding: 4px 8px;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
`;

const StyledWrapper = styled(Flex)`
  position: relative;
  ${AnnotationBody} {
    transition: 0.3s ease all;
    cursor: text;
    &:hover {
      box-shadow: 1px 1px 10px ${color.smoke};
    }
  }
`;
const AnnotationBody = styled.div`
  background: white;
  line-height: 1.5em;
  position: relative;
  min-width: 100%;
  ${({ isFocused }) => !isFocused && 'max-height: 58px; overflow: hidden;'}
`;
const AnnotationHeader = styled(Flex)`
  background: #fff;
  padding: 15px 20px;
`;

const AnnotationContent = styled.div`
  margin-top: 0px;
  overflow: hidden;
  div:first-child {
    border: none;
  }
`;


export default HighlightNew;
