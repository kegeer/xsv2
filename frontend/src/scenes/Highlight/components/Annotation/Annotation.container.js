import { connect } from 'react-redux';
import { updateAnnotationData, updateAnnotation, deleteAnnotation } from 'store/actions/edit';
import { annotationEditSelector } from 'store/selectors/edit';
import { annotationByIdSelector } from 'store/selectors/annotations';
import Annotation from './Annotation';

const mapState = (state, { annotationId }) => ({
  annotationEdit: annotationEditSelector(state),
  annotation: annotationByIdSelector(state, annotationId)
});

const mapDispatch = dispatch => ({
  updateAnnotation: annotation => dispatch(updateAnnotation(annotation)),
  updateAnnotationData: data => dispatch(updateAnnotationData(data)),
  deleteAnnotation: annotationId => dispatch(deleteAnnotation(annotationId))
});

export default connect(mapState, mapDispatch)(Annotation);
