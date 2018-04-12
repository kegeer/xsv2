import  { connect } from 'react-redux';
import { deleteProject } from 'store/actions/projects';
import ProjectDelete from './ProjectDelete';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  deleteProject: project => dispatch(deleteProject(project)),
});


export default connect(null, mapDispatch)(ProjectDelete);
