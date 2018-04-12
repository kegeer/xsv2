import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import TextSwitch from 'components/Animation/TextSwitch';
import Button from 'components/Button';
import { SimpleEditor } from 'components/Editor';
import { UserAvatar } from 'components/Avatar';

class AnnotationNew extends Component {
  state = {
    isFocused: false,
    annotation: ''
  };

  clickAnnotation = () => {
    this.setState({
      isFocused: true
    });
  };

  render() {
    const { user, onConfirm } = this.props;
    const { isFocused, annotation } = this.state;
    return (
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
                <b>添加新标注</b>
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
                text={this.state.annotation}
                readOnly={false}
              />
            ) : null}
          </AnnotationContent>
          <AnnotationFooter
            row
            justify="flex-end"
            styled={{ padding: '0 20px 10px' }}
          >
            <Button onClick={(e) => {
              e.stopPropagation();
              onConfirm(annotation);
              this.setState({
                isFocused: false,
                annotation: ''
              });
            }}>Add
            </Button>
          </AnnotationFooter>
        </AnnotationBody>
      </StyledWrapper>
    );
  }
}

const StyledWrapper = styled(Flex)`
  margin-top: 15px;
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
  border: 1px solid ${color.smokeDark};
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
const AnnotationFooter = styled(Flex)`
  padding: 6px 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
`;

export default AnnotationNew;
