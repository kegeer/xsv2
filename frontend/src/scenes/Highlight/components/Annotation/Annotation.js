import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { debounce } from 'lodash';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import { color } from 'shared/styles/constants';
import { UserAvatar } from 'components/Avatar';
import IsOwner from 'components/Auth';
import { SimpleEditor } from 'components/Editor';
import PenIcon from 'components/Icon/PenIcon';
import DeleteIcon from 'components/Icon/DeleteIcon';
import TimelineWrapper from '../TimelineWrapper';

class Annotation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newAnnotation: null,
      readOnly: true,
      editCache: null
    };
    this.onChange = debounce(this.onChange.bind(this), 300);
  }
  handleEdit = (e) => {
    e.preventDefault();
    this.setState({
      readOnly: false,
      editCache: this.annotation.body
    });
  };

  handleDelete = (e) => {
    e.preventDefault();
    this.props.deleteAnnotation(this.props.annotation.id);
  };
  onChange(value) {
    const { annotation } = this;
    if (!annotation) return null;
    if (annotation.body.trim() === value.trim()) return null;
    this.props.updateAnnotationData({ annotation, body: value });
  }
  onSave = () => {};
  cancelEdit = (e) => {
    e.preventDefault();
    const { annotation } = this;
    const { editCache } = this.state;
    if (editCache) {
      this.props.updateAnnotationData({ annotation, body: editCache });
    }
    this.setState({
      readOnly: true,
      editCache: null
    });
  };
  updateAnnotation = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { annotationEdit } = this.props;
    console.log(annotationEdit, 'edit');
    this.setState({
      readOnly: true,
      editCache: null
    });
    await this.props.updateAnnotation(annotationEdit);
  };

  get annotation() {
    if (this.state.newAnnotation) return this.state.newAnnotation;
    const { annotation } = this.props;
    // if (annotation.body) {}
    return annotation;
  }
  render() {
    const { annotation } = this;
    const { isFirst, isLast, inSidebar } = this.props;

    return (
      <TimelineWrapper>
        {isFirst && <StartMarker />}
        {isLast && <EndMarker />}
        <AnnotationWraper column>
          <AnnotationHeader row align="center" justify="flex-start">
            <UserAvatar
              name={annotation.author.username}
              size={25}
              shape="square"
              style={{ marginRight: '10px' }}
            />
            <Link to={`/@${annotation.author.username}`}>
              {annotation.author.username}
            </Link>
            {inSidebar ? (
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            ) : (
              <span style={{ color: `${color.slate}`, fontSize: 12 }}>
                &nbsp;- {moment(annotation.createdAt).fromNow()}
              </span>
            )}

            <IsOwner ownerId={annotation.author.id}>
              <ButtonsWrapper>
                <a onClick={this.handleEdit}>
                  <PenIcon viewBox="0 0 1024 1024" black />
                </a>
                <a onClick={this.handleDelete}>
                  <DeleteIcon viewBox="0 0 1024 1024" black />
                </a>
              </ButtonsWrapper>
            </IsOwner>
          </AnnotationHeader>
          <AnnotationContent>
            <SimpleEditor
              text={annotation.body}
              onChange={this.onChange}
              onSave={this.onSave}
              readOnly={this.state.readOnly}
            />
          </AnnotationContent>
          {!this.state.readOnly ? (
            <AnnotationFooter>
              <div>
                <StyledLink href="" onClick={this.cancelEdit}>
                  Cancel
                </StyledLink>
                &nbsp;&nbsp;
                <StyledLink href="" onClick={this.updateAnnotation}>
                  Save
                </StyledLink>
              </div>
            </AnnotationFooter>
          ) : null}
        </AnnotationWraper>
      </TimelineWrapper>
    );
  }
}

const StartMarker = styled.div`
  position: absolute;
  width: 11px;
  top: 0;
  left: -6px;
  border-top: 1px solid rgb(232, 232, 232);
  @media (max-width: 599px) {
    display: none;
  }
`;
const EndMarker = styled.div`
  position: absolute;
  width: 11px;
  bottom: 0;
  left: -6px;
  border-bottom: 1px solid rgb(232, 232, 232);
  @media (max-width: 599px) {
    display: none;
  }
`;
const AnnotationWraper = styled(Flex)`
  background: white;
  border: 1px solid ${color.smokeDark};
  line-height: 1.5em;
  position: relative;
  min-width: 100%;
  margin-bottom: 15px;
`;

const ButtonsWrapper = styled(Flex)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
  a {
    margin-left: 10px;
  }
`;

const AnnotationHeader = styled(Flex)`
  background: white;
  padding: 15px 20px;
  max-width: 100%;
`;

const AnnotationContent = styled.div`
  //margin: 20px;
  margin-top: 0px;
  overflow: hidden;
`;

const AnnotationFooter = styled.div`
  padding: 6px 20px;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
`;

const StyledLink = styled.a`
  color: ${color.primary};
`;

export default Annotation;
