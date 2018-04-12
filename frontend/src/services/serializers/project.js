import { Serializer } from 'jsonapi-serializer';

const ProjectSerializer = new Serializer('projects', {
  attributes: [
    'name',
    'color',
    'summary',
    'publicStatus',
  ]
});

export default ProjectSerializer;
