import {
  fetchProjects,
  fetchProject,
  createProject as create,
  updateProject as update,
  deleteProject as remove
} from 'services/api/api';
import { apiFetched } from './api';

export const getProjects = () => dispatch =>
  fetchProjects().then((payload) => {
    dispatch(apiFetched(payload));
  });

export const createProject = project => dispatch =>
  create(project).then((payload) => {
    dispatch(apiFetched(payload));
    return payload;
  });

export const updateProject = project => dispatch =>
  update(project).then(payload => dispatch(apiFetched(payload)));

export const deleteProject = projectId => dispatch => remove(projectId).then();

export const getProject = projectId => dispatch => fetchProject(projectId).then(payload => dispatch(apiFetched(payload)));
