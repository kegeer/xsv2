import { connect } from 'react-redux';
import { setActiveModal } from 'store/actions/ui';
import ProjectMenu from './ProjectMenu';

const mapDispatch = dispatch => ({
  setActiveModal: (name, props) => dispatch(setActiveModal(name, props)),
});


export default connect(null, mapDispatch)(ProjectMenu);
