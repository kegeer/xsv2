import { connect } from 'react-redux';
import { getProjects } from 'store/actions/projects';
import { recentlyEditedDocumentsSelector } from 'store/selectors/documents';
import { recentlyViewedFilesSelector } from 'store/selectors/files';
import { authSelector } from 'store/selectors/shared/auth';

import Dashboard from './Dashboard';

const mapState = state => ({
  auth: authSelector(state),
  recentlyEditedDocuments: recentlyEditedDocumentsSelector(state),
  recentlyViewedFiles: recentlyViewedFilesSelector(state),
});

const mapDispatch = dispatch => ({
  getProjects: () => dispatch(getProjects()),
});

export default connect(mapState, mapDispatch)(Dashboard);
