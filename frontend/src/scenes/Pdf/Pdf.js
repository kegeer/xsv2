import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'styled-components-grid';
import { color, layout } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import { withRouter } from 'react-router-dom';

import BulbIcon from 'components/Icon/BulbIcon';
import BookIcon from 'components/Icon/BookIcon';
import SidebarIcon from 'components/Icon/SidebarIcon';

import Actions, { Action, Separator } from 'components/Actions';
import Subheading from 'components/Subheading';
import ExportDocumentIcon from 'components/Icon/ExportDocumentIcon';
import PdfViewer, {
  AreaHighlight,
  Highlight,
  Popup,
  Tip
} from 'components/PdfAnnotator';
import ScrollZoom from 'components/ScrollZoom';
import LoadingPlaceholder from 'components/LoadingPlaceholder';

import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';

const getNextId = () => String(Math.random()).slice(2);

/* eslint-disable */
const parseIdFromHash = () => location.hash.slice("#highlight-".length);
const resetHash = () => {
  location.hash = "";
};
/* eslint-enable */

const HighlightPopup = ({ _fields }) =>
  (_fields.comment ? <StyledPopup>{_fields.comment}</StyledPopup> : null);

const StyledPopup = styled.div`
  background: ${color.smokeDark};
  color: ${color.text};
  padding: 3px 6px;
`;

const propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

class Pdf extends Component {
  state = {
    scale: 1.13,
    highlights: [],
    bulbOn: true,
    sidebarVisible: false,
    highlightsOn: true
  };

  componentWillMount() {
    this.fetch();
  }

  toggleBulb = (e) => {
    e.preventDefault();
    this.setState({
      bulbOn: !this.state.bulbOn
    });
  };

  toggleSidebar = (e) => {
    e.preventDefault();
    this.setState({
      sidebarVisible: !this.state.sidebarVisible
    });
  };

  toggleHighlights = (e) => {
    e.preventDefault();
    this.setState({
      highlightsOn: !this.state.highlightsOn
    });
  };

  componentDidMount() {
    window.addEventListener(
      'hashchange',
      this.scrollToHighlightFromHash,
      false
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      'hashchange',
      this.scrollToHighlightFromHash,
      false
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.fileId !== nextProps.match.params.fileId) {
      this.fetch(nextProps);
    }
  }

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());
    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  scrollViewerTo = (highlight) => {};

  getHighlightById = (id) => {
    const { highlights } = this.props.file;
    const highlight = highlights.find(highlight => highlight.id === id);
    console.log(highlight, 'get highlight by id');
    return highlight;
  };

  fetch = async (nextProps) => {
    this.props.enableProgressBar();
    const { getFileInfo, getFile, match, getHighlights } =
      nextProps || this.props;
    const { id: fileId } = match.params;
    // TODO getHighlights 是为了防止ORM中出现id不存在
    await Promise.all([getFileInfo(fileId), getHighlights(fileId)]);
    const { file } = this.props;
    console.log('pdf file', file);
    if (file.url) {
      await getFile(file.url);
    }
  };
  // getChildContext() {   return {     scale: this.state.scale   } }

  zoom(direction) {
    let newValue = 0;
    if (direction === 'in') {
      newValue = Math.round(this.state.scale * 1.1 * 100) / 100;
      newValue = newValue < 1.8 ? newValue : this.state.scale;
    } else {
      newValue = Math.round(this.state.scale * 0.9 * 100) / 100;
      newValue = newValue > 0.8 ? newValue : this.state.scale;
    }
    this.setState({ scale: newValue });
  }

  updateHighlight = (highlightId, selectors) => {
    this.setState({
      highilghts: this.state.highlights.map(
        h =>
          (h.id === highlightId
            ? {
              ...h,
              selectors: {
                ...h.selectors,
                ...selectors
              }
            }
            : h)
      )
    });
  };

  addHighlight = (highlight) => {
    const { id: fileId } = this.props.match.params;
    const { addHighlight } = this.props;
    return addHighlight(highlight, fileId);
  };
  enableAreaSelection = (flag) => {
    this.setState({
      areaSelectionEnabled: flag
    });
  };

  onSelectionFinished = (
    ghostHighlight,
    hideTipAndSelection,
    transformSelection
  ) => (
    <Tip
      user={this.props.user}
      onOpen={transformSelection}
      selectors={ghostHighlight.selectors}
      onConfirm={(annotation, color) => {
        this.addHighlight({
          selectors: ghostHighlight.selectors,
          color,
          annotation
        });
        hideTipAndSelection();
      }}
    />
  );

  onPdfDocumentLoadSuccess = () => {
    this.props.disableProgressBar();
  };

  inputRef = (ref) => {
    this.editor = ref;
  };
  generateDocument = () => {};
  renderActions = () => {
    const { libraryId } = this.props.match.params;
    return (
      <StyledActions
        align="center"
        justify="flex-end"
        sidebarVisible={this.state.sidebarVisible}
      >
        <Action>
          <a href="/dashboard">◄ 返回管理面板</a>
          <Action>
            <a onClick={this.toggleBulb}>
              <BulbIcon expanded={this.state.bulbOn} black />
            </a>
          </Action>
          <Action>
            <a onClick={this.toggleHighlights}>
              <BookIcon expanded={this.state.highlightsOn} black />
            </a>
          </Action>
        </Action>
      </StyledActions>
    );
  };

  highlightTransformer = (
    highlight,
    index,
    setTip,
    hideTip,
    viewportToScaled,
    screenShot,
    isScrolledTo
  ) => {
    const isTextHighlight = !(highlight.selectors && highlight.selectors.image);
    const component = isTextHighlight ? (
      <Highlight
        key={`highlight_${highlight.id}`}
        highlight={highlight}
        isScrolledTo={isScrolledTo}
        setActiveModal={this.props.setActiveModal}
      />
    ) : (
      <AreaHighlight
        key={`highlight_${highlight.id}`}
        highlight={highlight}
        isScrolledTo={isScrolledTo}
        setActiveModal={this.props.setActiveModal}
        onChange={(selectors) => {
          this.updateHighlight(highlight.id, {
            selectors: {
              pdfRectangles: viewportToScaled(selectors),
              image: screenShot(selectors)
            }
          });
        }}
      />
    );
    // TODO make this happen
    return component;
  };

  scrollRef = (scrollTo) => {
    this.scrollViewerTo = scrollTo;
    this.scrollToHighlightFromHash();
  };
  render() {
    const { fileData, file } = this.props;

    const {
      scale,
      areaSelectionEnabled,
      bulbOn,
      highlightsOn,
      sidebarVisible
    } = this.state;
    const zoomin = () => {
      this.zoom('in');
    };

    const zoomout = () => {
      this.zoom('out');
    };

    return (
      <StyledContainer align="center" justify="center">
        <Grid.Unit size={{ desktop: 3 / 3 }}>
          <StyledViewer
            cursor={areaSelectionEnabled ? 1 : 0}
            bulbOn={bulbOn}
            highlightsOn={highlightsOn}
          >
            <Toolbar
              zoomin={zoomin}
              zoomout={zoomout}
              enableAreaSelection={() => this.enableAreaSelection(true)}
            />
            <ScrollZoom zoomin={zoomin} zoomout={zoomout}>
              <PdfViewer
                loading={
                  <StyledLoadingPlaceholder justify="center" align="center" />
                }
                noData={
                  <Flex justify="center" align="center">
                    <h1>努力加载PDF...</h1>
                  </Flex>
                }
                error={
                  <Flex justify="center" align="center">
                    <h1>服务器开小差，加载失败...</h1>
                  </Flex>
                }
                onScrollChange={resetHash}
                scrollRef={this.scrollRef}
                onPdfDocumentLoadSuccess={this.onPdfDocumentLoadSuccess}
                highlights={file.highlights}
                file={fileData}
                scale={scale}
                enableAreaSelection={areaSelectionEnabled}
                toggleAreaSelection={this.enableAreaSelection}
                highlightTransform={this.highlightTransformer}
                // 这里按照原先的想法是把区域和文字分开，文字和图片作为内容放到一起
                onSelectionFinished={this.onSelectionFinished}
              />
            </ScrollZoom>
            {this.renderActions()}
            <Sidebar
              sidebarVisible={sidebarVisible}
              file={file}
              user={this.props.user}
              toggleSidebar={this.toggleSidebar}
            />
          </StyledViewer>
        </Grid.Unit>
      </StyledContainer>
    );
  }
}

const StyledActions = styled(Actions)`
  background: transparent;
  right: ${props => (props.sidebarVisible ? layout.sidebarMaxWidth : 0)};
`;
const StyledLoadingPlaceholder = styled(LoadingPlaceholder)`
  height: 100vh;
`;

const StyledContainer = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
`;
const StyledViewer = styled.div`
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 !important;
  height: 100vh;
  background-color: ${props => (props.bulbOn ? color.light : color.slateDark)};
  .PdfAnnotator__highlight-layer {
    visibility: ${props => (props.highlightsOn ? 'visible' : 'hidden')};
  }
  .textLayer {
    div {
      cursor: ${props => (props.cursor ? 'crosshair !important' : 'text')};
    }
  }
`;

export default withRouter(Pdf);
