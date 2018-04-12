import { connect } from 'react-redux';
import { projectFilesSelector } from 'store/selectors/projects';
import ProjectFiles from './ProjectFiles';

const mapState = (state, { match }) => ({
  projectFiles: projectFilesSelector(state, match)
});

export default connect(mapState)(ProjectFiles);
