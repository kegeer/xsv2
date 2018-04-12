import  { connect } from 'react-redux';
import { createProject } from 'store/actions/projects';
import { clearActiveModal } from 'store/actions/ui';
import ProjectNew from './ProjectNew';

export const mapState = state => ({

});


export const mapDispatch = dispatch => ({
  createProject: project => dispatch(createProject(project)),
  clearActiveModal: () => dispatch(clearActiveModal())
});


export default connect(null, mapDispatch)(ProjectNew);
