import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Annotation extends BaseModel {

}

Annotation.modelName = 'Annotation';
Annotation.collectionKey = 'annotations';

Annotation.fields = {
  ...BaseModel.fields,
  id: attr(),
  author: fk('Profile', 'annotations'),
  body: attr(),
  highlight: fk('Highlight', 'annotations'),
  comments: many('Comment', 'annotations'),
  tags: many('Tag', 'annotations'),
};

Annotation.defaultProps = {
  ...BaseModel.defaultProps,
  body: null
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  body: PropTypes.str,
});


export default Annotation;
export { Shape };
