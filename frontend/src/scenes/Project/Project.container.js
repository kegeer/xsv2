import { connect } from 'react-redux';
import {
  fetchRecentlyEdited,
  fetchPinnedDocuments,
  getProject
} from 'store/actions/projects';
import { fetchRecentlyViewed, fetchPinnedFiles, uploadFile } from 'store/actions/files';
import { setActiveProject, clearActiveProject } from 'store/actions/ui';
import { projectByIdSelector } from 'store/selectors/projects';
import {
  recentlyEditedDocumentsSelector,
  pinnedDocumentsSelector
} from 'store/selectors/documents';
import {
  recentlyViewedFilesSelector,
  pinnedFilesSelector,
} from 'store/selectors/files';
import {
  percentageSelector
} from 'store/selectors/file'
import Project from './Project';

const mapState = (state, { match }) => ({
  project: projectByIdSelector(state, match),
  recentlyEditedDocuments: recentlyEditedDocumentsSelector(state, match),
  pinnedDocuments: pinnedDocumentsSelector(state, match),
  recentlyViewedFiles: recentlyViewedFilesSelector(state, match),
  pinnedFiles: pinnedFilesSelector(state, match),
  percentage: percentageSelector(state)
});

const mapDispatch = dispatch => ({
  setActiveProject: project => dispatch(setActiveProject(project)),
  clearActiveProject: () => dispatch(clearActiveProject()),
  getProject: projectId => dispatch(getProject(projectId)),
  uploadFile: data => dispatch(uploadFile(data))
  // getRecentlyEdited: ({ limit, Project }) => dispatch(fetchRecentlyEdited(limit, Project)),
  // getPinnedDocuments: Project => dispatch(fetchPinnedDocuments(Project)),
});

export default connect(mapState, mapDispatch)(Project);
