import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

const annotationIdSelector = (state, annotationId) => annotationId;

export const annotationByIdSelector = newCreateOrmSelector(
  annotationIdSelector,
  ({ Annotation }, id) => {
    try {
      const annotation = Annotation.get({ id });
      // console.log(annotation, 'selector annotation');
      annotation.includeFk('author');
      return annotation.includeRef;
    } catch (err) {
      return { id };
    }
  }
);
