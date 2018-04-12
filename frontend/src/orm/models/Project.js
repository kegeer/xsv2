import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Project extends BaseModel {}

Project.modelName = 'Project';
Project.ProjectKey = 'projects';

Project.fields = {
  ...BaseModel.fields,
  id: attr(),
  name: attr(),
  summary: attr(),
  color: attr(),
  publicStatus: attr(),
  readme: attr(),
  creator: fk('Profile', 'projects'),
  createdAt: attr(),
  updatedAt: attr(),
  files: many('File', 'projects')
};

Project.defaultProps = {
  ...BaseModel.defaultProps,
  id: null,
  name: null,
  description: null,
  color: null,
  summary: null,
  readme: null,
  public: false
};

const Shape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  color: PropTypes.string,
  public: PropTypes.bool,
  readme: PropTypes.string,
});

export default Project;
export { Shape };
