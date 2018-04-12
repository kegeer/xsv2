import { Serializer } from 'jsonapi-serializer';

const HighlightSerializer = new Serializer('highlights', {
  attributes: [
    'selectors',
    'color',
    // 'file'
    'annotation'
  ],
  // annotations: {
  //   ref: (_object, annotation) => annotation,
  //   included: false
  // }
  // file: {
  //   ref: (_object, id) => id,
  //   included: false,
  // },
});

export default HighlightSerializer;
