import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

/* Document list for only id pass to child */
export const documentIdSelector = (state, props) => props.document;

export const documentRefSelector = newCreateOrmSelector(
  documentIdSelector, ({ Document }, id) => {
    try {
      return Document.get({ id }).includeRef;
    } catch (e) {
      return { id };
    }
  }
);

export const documentSlugSelector = (state, match) => match && match.params.documentSlug;

export const documentBySlugSelector = newCreateOrmSelector(
  documentSlugSelector, ({ Document }, slug) => {
    try {
      return Document.get({ slug }).includeRef;
    } catch (e) {
      return { slug };
    }
  }
);

export const starredSelector = (state) => {};
export const draftsSelector = (state) => {};

export const documentsSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Document }) => Document.all())
);

export const pinnedDocumentsSelector = createSelector(
  documentsSelector,
  documents => documents.toModelArray().filter(doc => doc.pinned === true).map(doc => doc.id)
);

export const recentlyEditedDocumentsSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Document }) => Document.all().orderBy('createdAt').toRefArray().map(doc => doc.id))
);

// export const recentlyEditedDocumentsSelector = createSelector(
//   documentsSelector,
//   (documents) => {
//     console.log(documents.toRefArray(), 'document selector');
//     return documents.orderBy('createdAt').toRefArray().map(doc => doc.id);
//   }
// );
