import {
  SessionSerializer,
  UserSerializer,
  UserRegistrationSerializer,
  HighlightSerializer,
  DocumentSerializer,
  ProjectSerializer,
  FileSerializer,
  AnnotationSerializer
} from 'services/serializers';

import invariant from 'invariant';
import { getHash } from 'utils/uploadOssFile';

import {
  initializeApi,
  initialHttp,
  fetch,
  normalize,
  normalizeErrors
} from './helpers';

export { initializeApi, initialHttp };

function legacyError(result) {
  return result.errors;
}

export const register = (user) => {
  const payload = UserRegistrationSerializer.serialize(user);

  return fetch('users', {
    method: 'POST',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
};

export const login = (loginData) => {
  const payload = SessionSerializer.serialize({
    email: loginData.email,
    password: loginData.password
  });
  return fetch('users/login', {
    method: 'POST',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors(legacyError));
};

export const getUser = () =>
  fetch('user', { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors(legacyError));

export const updateUser = (user) => {
  const payload = UserSerializer.serialize(user);

  return fetch('user', {
    method: 'PUT',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
};

export function passwordReset(formData, passwordResetToken) {
  const payload = UserRegistrationSerializer.serialize(formData);
  return fetch(`password-reset/${passwordResetToken}`, {
    method: 'PUT',
    data: JSON.stringify(payload)
  })
    .then(normalize(() => ({})))
    .catch(normalizeErrors(null, true));
}

export function emailConfirmationRequest(formData) {
  const payload = UserRegistrationSerializer.serialize(formData);

  return fetch('confirmations', {
    method: 'POST',
    data: JSON.stringify(payload)
  });
}

export function emailConfirmation(emailConfirmationToken) {
  const payload = {
    data: {}
  };
  return fetch(`confirmations/${emailConfirmationToken}`, {
    method: 'PUT',
    data: JSON.stringify(payload)
  })
    .then(normalize(() => ({})))
    .catch(normalizeErrors(null, true));
}

/* Library and files */
export const createLibraryFetch = (library) => {
  const payload = ProjectSerializer.serialize(library);
  return fetch('libraries', { method: 'POST', data: JSON.stringify(payload) })
    .then(normalize())
    .catch(normalizeErrors);
};
export const getFiles = () =>
  fetch('files', { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors());

export const fetchFile = url =>
  fetch(`http://${url}`, {
    method: 'GET',
    responseType: 'blob'
  });

export const fetchFileInfo = fileId =>
  fetch(`files/${fileId}`, { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors());

export const saveHighlight = (highlight, fileId) => {
  // const { selector } = highlight if (selector.image) { //  TODO 在此处理图片上传问题 }
  console.log(highlight);
  const payload = HighlightSerializer.serialize(highlight);
  // console.log(payload, 'highlight payload')
  return fetch(`/files/${fileId}/highlights`, {
    method: 'POST',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors());
};

export const fetchHighlights = fileId =>
  fetch(`files/${fileId}/highlights`, { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors(null, true));

export const fetchDocuments = ({ type, limit }) =>
  fetch(`documents?type=${type}&limit=${limit}`, { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors(null, true));

export const fetchDocument = documentSlug => fetch(`documents/${documentSlug}`, { method: 'GET' }).then(normalize()).catch(normalizeErrors(null, true));
export const saveDocument = (projectId, document) => {
  const payload = DocumentSerializer.serialize(document);
  console.log(payload, 'payload');
  if (document.id) {
    return fetch(`documents/${document.id}`, {
      method: 'PUT',
      data: JSON.stringify(payload)
    })
      .then(normalize())
      .catch(normalizeErrors(null, true));
  }
  return fetch(`/projects/${projectId}/documents`, {
    method: 'POST',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
};

export const starDocumentFetch = documentId =>
  fetch(`documents/${documentId}/star`, { method: 'POST' });
export const unstarDocumentFetch = documentId =>
  fetch(`documents/${documentId}/star`, { method: 'DELETE' });

export const pinDocumentFetch = documentId =>
  fetch(`documents/${documentId}/pin`, { method: 'POST' });
export const unpinDocumentFetch = documentId =>
  fetch(`documents/${documentId}/pin`, { method: 'DELETE' });


export const fetchFiles = limit =>
  fetch(`files?limit=${limit}`, { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors);
export const fetchPapers = () =>
  fetch('papers', { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors);

/* Collections and document */

export const fetchProjects = () =>
  fetch('projects', { method: 'GET' })
    .then(normalize())
    .catch(normalizeErrors);

export const fetchProject = projectId => fetch(`projects/${projectId}`, { method: 'GET' }).then(normalize()).catch(normalizeErrors);
export const createProject = (project) => {
  const payload = ProjectSerializer.serialize(project);
  console.log(payload);
  return fetch('projects', { method: 'POST', data: JSON.stringify(payload) })
    .then(normalize())
    .catch(normalizeErrors);
};
export const updateProject = () => {};
export const deleteProject = () => {};

export const fetchAnnotations = highlightId => fetch(`highlights/${highlightId}/annotations`, { method: 'GET' }).then(normalize()).catch(normalizeErrors);
export const updateAnnotation = (annotation) => {
  const payload = AnnotationSerializer.serialize(annotation);
  console.log(payload, 'payload');
  return fetch(`annotations/${annotation.id}`, {
    method: 'PUT',
    data: JSON.stringify(payload)
  }).then(normalize())
    .catch(normalizeErrors);
};

export const addAnnotation = (highlightId, annotation) => {
  const payload = AnnotationSerializer.serialize(annotation);
  return fetch(`highlights/${highlightId}/annotations`, {
    method: 'POST',
    data: JSON.stringify(payload)
  }).then(normalize())
    .catch(normalizeErrors);
};

export const deleteAnnotation = annotationId => fetch(`annotations/${annotationId}`, {
  method: 'DELETE'
}).then().catch(normalizeErrors);
