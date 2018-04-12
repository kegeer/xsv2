import React, { Component } from 'react';

import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import CenteredContent from 'components/CenteredContent';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import Annotation from './components/Annotation';
import AnnotationNew from './components/AnnotationNew';

class Highlight extends Component {
  state ={
    isLoading: false
  }
  componentWillMount() {
    this.loadContent();
  }

  loadContent = async () => {
    this.setState({
      isLoading: true
    });
    const { highlightId } = this.props;
    await this.props.getAnnotations(highlightId);
    this.setState({
      isLoading: false
    });
  }
  renderLoadingStatus = () => (
    <LoadingPlaceholder />
  )

  onConfirm = annotation => (e) => {
    console.log(annotation, 'click');
    e.preventDefault();
    e.stopPropagation();
    const { highlight } = this.props;
    this.props.addAnnotation(highlight.id, annotation);
  }
  render() {
    const { isLoading } = this.state;
    if (isLoading) this.renderLoadingStatus();
    const { highlight, user, addAnnotation, annotations } = this.props;
    if (!highlight.selectors) return null;

    const isText = !!highlight.selectors.textQuote;
    return !isLoading && highlight && (
      <CenteredContent>
        <Wrapper>
          <HighlightHeader color={highlight.color}>
            {
              isText ?
                <p>
                  { highlight.selectors.textQuote.content }
                </p> :
                <img src={highlight.selectors.image} alt="" />
            }
          </HighlightHeader>
          <HighlightContent column align="flex-start" justify="center">
            {
              annotations.length > 0 && annotations.map(annotation =>
                (<Annotation
                  key={annotation}
                  annotationId={annotation}
                />)
              )
            }
          </HighlightContent>
          <HighlightFooter>
            <AnnotationNew
              user={user}
              onConfirm={annotation => addAnnotation(highlight.id, { body: annotation })}
            />
          </HighlightFooter>
        </Wrapper>
      </CenteredContent>
    );
  }
}


const Wrapper = styled.div`
  box-sizing: border-box;
  max-width: 100%;
`;

const HighlightHeader = styled.div`
  border-left: 2px solid ${props => (props.color || 'yellow')};
  padding-left: 30px;
  font-style: italic;
  margin-left: -30px;
  margin-bottom: 30px;
`;

const HighlightContent = styled(Flex)`

`;

const HighlightFooter = styled.div``;

export default Highlight;
