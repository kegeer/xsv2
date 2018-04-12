import parseTitle from 'shared/utils/parseTitle';
import {
  saveDocument as save,
  updateAnnotation as updateAnno,
  deleteAnnotation as deleteAnno
} from 'services/api/api';
import {
  SET_PENDING_CHANGES,
  UPDATE_DOCUMENT_DATA,
  CLEAR_EDIT,
  UPDATE_ANNOTATION_DATA
} from '../constants/edit';
import {
  DELETE_ENTITY
} from '../constants/api';
import { documentApiRequestStart, documentGetSuccess } from './documents';
import { apiFetched } from './api';

export const updateData = (document, data, dirty) => (dispatch) => {
  if (data.text) {
    const { title, emoji } = parseTitle(data.text);
    data.title = title;
    data.emoji = emoji;
  }
  if (dirty) dispatch(setPendingChanges(true));
  dispatch(updateDocumentData({ document, data }));
};

export const setPendingChanges = payload => ({
  type: SET_PENDING_CHANGES,
  payload
});

export const updateDocumentData = payload => ({
  type: UPDATE_DOCUMENT_DATA,
  payload
});

export const saveDocument = (document, publish) => dispatch => save(document.project, {
  ...document,
  publish: publish || false
}).then((payload) => {
  dispatch(apiFetched(payload));
  dispatch(clearEdit());
  return payload;
});

export const clearEdit = () => ({
  type: CLEAR_EDIT
});

// export const selectDocument = payload => (dispatch, getState) => {
//   const state = getState();
//   const ui = uiSelector(state);

//   dispatch({
//     type: SET_ACTIVE_DOCUMENT,
//     payload: Object.values(payload)[0][1]
//   });
// };

export const updateAnnotation = annotation => dispatch => updateAnno(annotation).then(payload => dispatch(apiFetched(payload)));
export const updateAnnotationData = payload => ({
  type: UPDATE_ANNOTATION_DATA,
  payload
});
export const deleteAnnotation = annotationId => dispatch => deleteAnno(annotationId).then(() => dispatch(removeAnnotation(annotationId)));

const removeAnnotation = annotationId => ({
  type: DELETE_ENTITY,
  payload: {
    itemType: 'Annotation',
    itemId: annotationId
  }
});
