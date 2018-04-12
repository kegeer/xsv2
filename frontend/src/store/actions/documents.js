import { fetchDocument as fetchDoc } from 'services/api/api';
import { apiFetched } from './api';

export const fetchDocument = documentSlug => dispatch => fetchDoc(documentSlug).then(payload => dispatch(apiFetched(payload)));
export const viewedDocument = () => {};
export const updateDocumentData = () => {};
export const starDocument = () => {};
export const unstarDocument = () => {};
export const pinDocument = () => {};
export const unpinDocument = () => {};
export const downDocument = () => {};
export const deleteDocument = () => {};
export const getDraftsDocuments = () => {};
export const getStarredDocuments = () => {};
