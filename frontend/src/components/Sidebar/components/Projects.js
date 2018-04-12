import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Flex from 'shared/components/Flex';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

import PlusIcon from 'components/Icon/PlusIcon';
import CollectionIcon from 'components/Icon/CollectionIcon';

import Header from './Header';
import SidebarLink from './SidebarLink';

const projectsPropTypes = {
  projects: PropTypes.array,
  onCreateProject: PropTypes.func,
};

const Projects = (props) => {
  const { projects, onCreateProject } = props;

  return (
    <Flex column>
      <Header>Projects</Header>
      { projects.length > 0 && projects.map(project => (
        <SidebarLink
          key={project.id}
          to={`/projects/${project.id}`}
          icon={<CollectionIcon color={project.color} />}
          iconColor={project.color}
        >
          <ProjectName justify="space-between">
            { project.name }
          </ProjectName>
        </SidebarLink>

      ))}

      <SidebarLink
        onClick={onCreateProject}
        icon={<PlusIcon />}
      >
        New project
      </SidebarLink>
    </Flex>
  );
};


const ProjectName = styled(Flex)`
  padding: 0 0 4px;
`;

export default Projects;
