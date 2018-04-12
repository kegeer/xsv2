import orm, { modelNames } from 'orm';
import { lowerCaseFirstLetter } from 'utils';
import { API_FETCHED, DELETE_ENTITY } from '../../constants/api';
import { AUTH_LOGOUT } from '../../constants/auth';

const reducer = (state = orm.getEmptyState(), action) => {
  switch (action.type) {
  case API_FETCHED: {
    const session = orm.session(state);
    const fetchedAt = Date.now();

    modelNames.forEach((modelName) => {
      const modelClass = session[modelName];
      const collectionName =
          modelClass.collectionKey || lowerCaseFirstLetter(`${modelName}s`);
      const collection = action.payload[collectionName] || {};
      Object.values(collection).forEach((attributes) => {
        if (modelClass.hasId(attributes.id)) {
          const modelInstance = modelClass.withId(attributes.id);
          return modelInstance.update({
            ...attributes,
            fetchedAt,
            isFetching: false
          });
        }
        return modelClass.create({
          ...attributes,
          fetchedAt,
          isFetching: false
        });
      });
    });
    return session.state;
  }
  case AUTH_LOGOUT:
    return orm.getEmptyState();

  case DELETE_ENTITY:
    const { itemId, itemType } = action.payload;
    const session = orm.session(state);
    const ModelClass = session[itemType];
    if (ModelClass.hasId(itemId)) {
      const modelInstance = ModelClass.withId(itemId);
      modelInstance.delete();
    }
    return session.state;
  default:
    return state;
  }
};

export default reducer;
