import { connect } from 'react-redux';
import { projectsSelector } from 'store/selectors/projects';
import Projects from './Projects';

const mapState = state => ({
  projects: projectsSelector(state)
});

export default connect(mapState)(Projects);
