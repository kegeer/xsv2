import { connect } from 'react-redux';
import { highlightByIdSelector, highlightAnnotationsSelector } from 'store/selectors/highlights';
import { getAnnotations, addAnnotation } from 'store/actions/file';
import { userSelector } from 'store/selectors/shared/auth';
import Highlight from './Highlight';

const mapState = (state, { highlightId }) => ({
  user: userSelector(state),
  highlight: highlightByIdSelector(state, highlightId),
  annotations: highlightAnnotationsSelector(state, highlightId)
});

const mapDispatch = dispatch => ({
  getAnnotations: highlightId => dispatch(getAnnotations(highlightId)),
  addAnnotation: (highlightId, annotation) => dispatch(addAnnotation(highlightId, annotation))
});

export default connect(mapState, mapDispatch)(Highlight);
