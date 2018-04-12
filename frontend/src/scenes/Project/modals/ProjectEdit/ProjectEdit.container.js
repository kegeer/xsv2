import  { connect } from 'react-redux';
import { updateProject } from 'store/actions/projects';
import ProjectEdit from './ProjectEdit';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  updateProject: project => dispatch(updateProject(project)),
});


export default connect(null, mapDispatch)(ProjectEdit);
