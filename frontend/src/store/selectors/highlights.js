import { creatSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

export const highlightIdSelector = (state, id) => id;

export const highlightByIdSelector = newCreateOrmSelector(
  highlightIdSelector,
  ({ Highlight }, id) => {
    try {
      const highlight = Highlight.get({ id });
      // highlight.includeRef.annotations = highlight.annotations
      //   .toModelArray()
      //   .map(annotation => annotation.includeRef);
      return highlight.includeRef;
    } catch (err) {
      return { id };
    }
  }
);

export const highlightAnnotationsSelector = newCreateOrmSelector(
  highlightIdSelector,
  ({ Annotation }, id) =>
    Annotation.filter({ highlight: id })
      .toModelArray()
      .map(annotation => annotation.id)
);
