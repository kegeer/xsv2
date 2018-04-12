import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';
import Flex from 'shared/components/Flex';
import { color, layout } from 'shared/styles/constants';
import SidebarIcon from 'components/Icon/SidebarIcon';
import TextIcon from 'components/Icon/TextIcon';
import Annotation from 'scenes/Highlight/components/Annotation';
import HelpText from 'components/HelpText';

/* eslint-disable no-restricted-globals */
const updateHash = (highlight) => {
  location.hash = `highlight-${highlight}`;
};

const getCalendarText = time =>
  moment(time).calendar().split('at')[0];
/* eslint-enable no-restricted-globals */

class Sidebar extends Component {
  renderAnnotations = annotations =>
    annotations.map((annotation, index) => (
      <Annotation
        inSidebar
        annotationId={annotation}
        user={this.user}
        isFirst={index === 0}
        isLast={index + 1 === annotations.length}
      />
    ));

  render() {
    const { sidebarVisible, file, toggleSidebar } = this.props;
    return (
      <Container sidebarVisible={sidebarVisible} column>
        <Toggle onClick={toggleSidebar} sidebarVisible={sidebarVisible}>
          <SidebarIcon expanded={!sidebarVisible} black />
        </Toggle>
        <Wrapper>
          <SectionTitle>
            <div>所有标注</div>
            <p>点击左边图标可以快速定位文中位置</p>
          </SectionTitle>
          {file.highlights &&
          file.highlights.length > 0 &&
          file.highlights.map((highlight, index) => (
            <GroupItems key={`highlight_${index}`}>
              <GroupTitle>
                <a onClick={e => updateHash(highlight.id)}>
                  <TextIcon primary />
                </a>
                {getCalendarText(highlight.createdAt)}
              </GroupTitle>
              {highlight.annotations &&
              highlight.annotations.length > 0 &&
              this.renderAnnotations(highlight.annotations)}
            </GroupItems>
          ))}
        </Wrapper>

      </Container>
    );
  }
}
const Wrapper = styled.div`
  margin: 0 30px;
`;
const GroupItems = styled.div`
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const SectionTitle = styled.div`
  border-bottom: 1px solid ${color.smokeDark};
  margin-top: 30px;
  margin-bottom: 15px;
  div {
    position: relative;
    padding: 10px 0;
    border-bottom: 1px solid ${color.black};
    margin-bottom: -1px;

    letter-spacing: 0.05em;
    color: ${color.text};
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4em;
  }
  p {
    font-size: 12px;
  }
`;

const GroupTitle = styled(Flex)`
  margin-bottom: 10px;
  align-content: center;
  color: ${color.slate};
  a {
    margin-right: 1em;
  }
`;

const Container = styled(Flex)`
  position: fixed;
  top: 0;
  bottom: 0;
  right: ${props => (props.sidebarVisible ? 0 : `-${layout.sidebarMaxWidth}`)};
  background: ${color.smoke};
  transition: left 200ms ease-in-out;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: auto;
  @media print {
    display: none;
    left: 0;
  }

  ${breakpoint('tablet')`
    width: ${layout.sidebarMaxWidth};
    margin: 0;
  `};
`;

const Section = styled(Flex)`
  flex-direction: column;
  margin: 24px 0;
  padding: 0 24px;
  position: absolute;
`;

const Toggle = styled.a`
  position: fixed;
  top: 0;
  left: auto;
  right: ${props => (props.sidebarVisible ? `${layout.sidebarMaxWidth}` : '0')};
  z-index: 1;
  margin: 1.3vw 0 0;
  background-color: ${color.smoke};
  width: 32px;
  height: 32px;
  padding: 4px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export default Sidebar;
