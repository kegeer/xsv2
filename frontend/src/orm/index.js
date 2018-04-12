import { ORM } from 'redux-orm';

import {
  Annotation,
  Author,
  Comment,
  File,
  Journal,
  Paper,
  Profile,
  Tag,
  User,
  Document,
  Highlight,
  Project
} from './models';

const models = [
  Annotation,
  Author,
  Comment,
  File,
  Journal,
  Paper,
  Profile,
  Tag,
  User,
  Document,
  Highlight,
  Project
];

const orm = new ORM();

orm.register(...models);

export default orm;

export const modelNames = models.map(model => model.modelName);
