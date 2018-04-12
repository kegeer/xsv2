import { Serializer } from 'jsonapi-serializer';

const FileSerializer = new Serializer('files', {
  attributes: [
    'size',
    'name',
    'hash'
  ]
});

export default FileSerializer;
