import { createSelector } from 'reselect';
import { createOrmSelector, ormSelector, newCreateOrmSelector } from './orm';

export const projectsSelector = createSelector(
  ormSelector,
  createOrmSelector(({ Project }) =>
    Project.orderBy('createdAt')
      .all()
      .toRefArray()
  )
);

const projectIdSelector = (state, match) => match.params.id;

export const projectByIdSelector = newCreateOrmSelector(
  projectIdSelector,
  ({ Project }, id) => {
    try {
      const project = Project.get({ id });
      project.includeRef.files = project.files
        ? project.files.toModelArray().map(file => file.id)
        : [];
      project.includeRef.documents = project.documents
        ? project.documents.toModelArray().map(doc => doc.id)
        : [];
      return project.includeRef;
    } catch (e) {
      return { id };
    }
  }
  // {
  //   try {
  //     const project = Project.get({ id });
  //     project.includeRef.files = project.files
  //       ? project.files.toModelArray().map(file => file.includeRef)
  //       : [];
  //     project.includeRef.documents = project.documents
  //       ? project.documents.toModelArray().map(file => file.includeRef)
  //       : [];
  //     return project.includeRef;
  //   } catch (e) {
  //     return { id };
  //   }
  // }


);

export const projectFilesSelector = createSelector(
  projectByIdSelector,
  project => project.files || []
);
