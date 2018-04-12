import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

export const fileIdSelector = (state, props) => props.file;
export const fileByIdSelector = newCreateOrmSelector(
  fileIdSelector, ({ File }, id) => File.get({ id })
);


export const fileRefSelector = createSelector(
  fileByIdSelector, selectedFile => selectedFile.includeRef
);

export const filesSelector = createSelector(
  ormSelector,
  createOrmSelector(({ File }) => File.all())
);

export const recentlyViewedFilesSelector = createSelector(
  filesSelector,
  (files) => {
    console.log(files);
    return files.orderBy('createdAt').toRefArray().map(file => file.id);
  }
);

export const pinnedFilesSelector = createSelector(
  filesSelector,
  files => files.toRefArray().filter(file => file.pinned === true).map(file => file.id)
);
