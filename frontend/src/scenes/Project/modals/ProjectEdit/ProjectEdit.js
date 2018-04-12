import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Button from 'components/Button';
import Input from 'components/Input';
import ColorPicker from 'components/ColorPicker';
import HelpText from 'components/HelpText';

const propTypes = {
  history: PropTypes.object,
  project: PropTypes.object,
  updateProject: PropTypes.func,
};

class ProjectNew extends Component {
  state = {
    name: '',
    color: '',
    summary: '',
    publicStatus: true,
    isSaving: false
  };

  componentWillMount() {
    this.setForm();
  }

  setForm = () => {
    const { name, open,  summary, color } = this.props.project;
    this.setState({ name, color, summary, open });
  }

  handleSubmit = async (ev) => {
    ev.preventDefault();

    this.setState({
      isSaving: true
    });

    const project = await this.props.updateProject({
      name: this.state.name,
      color: this.state.color,
      summary: this.state.summary,
      public: this.state.public,
      description: this.state.description
    });

    const projectId = Object.values(project.libraries)[0].id;

    if (projectId) {
      this.props.clearActiveModal();
      this.props.history.push(`/projects/${projectId}`);
    } else {
      this.props.history.push('/dashboard');
    }

    this.setState({
      isSaving: false
    });
  };

  handleNameChange = (ev) => {
    this.setState({
      name: ev.target.value
    });
  };
  handlePublicChange = (ev) => {
    this.setState({
      open: ev.target.selected
    });
  };
  handleColor = (color) => {
    this.setState({ color });
  };

  handleSummaryChange = (ev) => {
    this.setState({ summary: ev.target.value });
  };

  render() {
    const { name, summary, open, color, isSaving } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <HelpText>project是一些列相关文章的集合</HelpText>

        <Input
          type="text"
          label="名称"
          onChange={this.handleNameChange}
          value={name}
          required
          autoFocus
        />

        <Input
          type="textarea"
          label="描述"
          onChange={this.handleSummaryChange}
          value={summary}
          required
          autoFocus
        />

        <Input
          type="checkbox"
          label="Public"
          onChange={this.handlePublicChange}
          checked={open}
        />

        <ColorPicker onSelect={this.handleColor} value={color} />
        <Button
          type="submit"
          disabled={isSaving || !name}
        >
          {this.isSaving ? '创建中...' : '创建'}
        </Button>
      </form>
    );
  }
}

export default withRouter(ProjectNew);
