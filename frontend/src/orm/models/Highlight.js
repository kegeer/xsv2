import PropTypes from 'prop-types';
import { attr, fk, many } from 'redux-orm';

import BaseModel from './BaseModel';

class Highlight extends BaseModel {

}

Highlight.modelName = 'Highlight';
Highlight.collectionKey = 'highlights';

Highlight.fields = {
  ...BaseModel.fields,
  id: attr(),
  author: fk('Profile', 'highlights'),
  selectors: attr(),
  file: fk('File', 'highlights'),
};

Highlight.defaultProps = {
  ...BaseModel.defaultProps,
  selectors: null,
};


const Shape = PropTypes.shape({
  id: PropTypes.string,
  selectors: PropTypes.object,
});


export default Highlight;
export { Shape };
