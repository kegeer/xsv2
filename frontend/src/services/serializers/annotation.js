import { Serializer } from 'jsonapi-serializer';

const AnnotationSerializer = new Serializer('annotations', {
  attributes: [
    'body',
  ],
});

export default AnnotationSerializer;
