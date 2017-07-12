import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import { isUri } from 'valid-url';

import Loader from '../loader/loader.jsx';
import * as WiregooseApi from '../services/wiregoose-api.js';

export default class ArticleBoxForm extends React.Component {

  static propTypes = {
    record: PropTypes.shape(),
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    isNew: PropTypes.bool,
  }

  static defaultProps = {
    record: {},
    onDelete: undefined,
    onSave: undefined,
    isNew: true,
  }

  state = {
    record: this.props.record,
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(this.validateLink() === 'success'
      && record.title);
  }

  onSaveClicked = (e) => {
    e.preventDefault();
    this.props.onSave(this.state.record);
  }

  onDeleteClicked = (e) => {
    e.preventDefault();
    this.props.onDelete(this.state.record);
  }

  handleInputChange = (e) => {
    const record = this.state.record;
    record[e.target.name] = e.target.value;
    this.setState({ record });
  }

  getProviderOptions = (input) => {
    return WiregooseApi.crud.retrieveAll('rssprovider', {})
      .then(resp => ({options: resp.data.data.content}));
  }

  handleProviderChange = (val) => {
    const record = this.state.record;
    record.provider = val || undefined;
    this.setState({ record });
  }

  getRegistrationOptions = (input) => {
    return WiregooseApi.crud.retrieveAll('rssregistration', {})
      .then(resp => ({options: resp.data.data.content}));
  }

  handleRegistrationChange = (val) => {
    const record = this.state.record;
    record.provider = val || undefined;
    this.setState({ record });
  }

  validateLink = () => (isUri(this.state.record.link) ? 'success' : 'warning');

  render() {
    const {
      isNew,
    } = this.props;

    return (
      <Form horizontal>

        { !isNew &&
          <FormGroup controlId="formIdId">
            <Col componentClass={ControlLabel} sm={2}>ID</Col>
            <Col sm={10}>
              <FormControl.Static>{this.state.record._id}</FormControl.Static>
            </Col>
          </FormGroup>
        }

        <FormGroup controlId="formIdTitle">
          <Col componentClass={ControlLabel} sm={2}>Title</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="title"
              value={this.state.record.title}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdLink" validationState={this.validateLink()}>
          <Col componentClass={ControlLabel} sm={2}>Link</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="link"
              value={this.state.record.link}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdImage" validationState={this.validateLink()}>
          <Col componentClass={ControlLabel} sm={2}>Image</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="image"
              value={this.state.record.image}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdDescription">
          <Col componentClass={ControlLabel} sm={2}>Description</Col>
          <Col sm={10}>
            <FormControl
              componentClass="textarea"
              name="description"
              value={this.state.record.description}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdAuthor">
          <Col componentClass={ControlLabel} sm={2}>Author</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="author"
              value={this.state.record.author}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdProvider">
          <Col componentClass={ControlLabel} sm={2}>Provider</Col>
          <Col sm={10}>
            <Select.Async
              name="provider"
              value={ {name: this.state.record.provider} }
              loadOptions={this.getProviderOptions}
              onChange={this.handleProviderChange}
              autoload={false}
              valueKey="name"
              labelKey="name"
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdRegistration">
          <Col componentClass={ControlLabel} sm={2}>Registration</Col>
          <Col sm={10}>
            <Select.Async
              name="registration"
              value={ {name: this.state.record.registration} }
              loadOptions={this.getRegistrationOptions}
              onChange={this.handleRegistrationChange}
              autoload={false}
              valueKey="name"
              labelKey="name"
              required
            />
          </Col>
        </FormGroup>

        <div className="clearfix">
          <Button bsStyle="primary" className="pull-right" type="submit" onClick={this.onSaveClicked} disabled={this.isInvalid()}>
            <FontAwesome name="save" /> { isNew ? 'Create' : 'Save' }
          </Button>
          { !isNew &&
            <Button bsStyle="warning" className="pull-right w-mr-7" type="submit" onClick={this.onDeleteClicked}>
              <FontAwesome name="trash-o" /> Delete
            </Button>
          }
        </div>
      </Form>
    );
  }
}
