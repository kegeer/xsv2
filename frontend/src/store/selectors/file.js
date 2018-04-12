import { createSelector } from 'reselect';
import { ormSelector, createOrmSelector, newCreateOrmSelector } from './orm';

export const fileDataSelector = state => state.file.file;

export const fileIdSelector = (state, props) => props.match.params.id;


export const fileByIdSelector = newCreateOrmSelector(
  fileIdSelector, ({ File }, id) => {
    try {
      const file = File.get({ id });
      file.includeRef.highlights = file.highlights.toModelArray().map(highlight => highlight.includeRef);
      file.includeRef.highlightIds = file.highlights.toModelArray().map(highlight => highlight.id);
      return file.includeRef;
    } catch (e) {
      return { id };
    }
  }
);

export const highlightsSelector = createSelector(
  ormSelector,
  fileIdSelector,
  createOrmSelector(({ Highlight }, id) => Highlight.all().filter({ file: id }).toModelArray())
);

// export const highlightsSelector = createSelector(
//   ormSelector,
//
// )

export const highlightIdSelector = (state, highlight) => highlight;
// export const highlightSelector = createSelector(
//   ormSelector,
//   highlightIdSelector,
//   createOrmSelector(({ Highlight }, id) => Highlight.get({ id }).includeRef)
// )

export const highlightSelector = newCreateOrmSelector(
  highlightIdSelector, ({ Highlight }, id) => {
    const highlight = Highlight.get({ id });
    highlight.includeFk('author');
    return highlight.includeRef;
  }
);

export const percentageSelector = state => state.file.percentage;
