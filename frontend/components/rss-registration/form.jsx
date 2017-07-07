import React from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';
import Select from 'react-select';

import Loader from '../loader/loader.jsx';
import * as WiregooseApi from '../services/wiregoose-api.js';

export default class FormGenerator extends React.Component {

  static propTypes = {
    record: PropTypes.shape(),
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    isNew: PropTypes.bool,
  }

  static defaultProps = {
    record: { name: '', link: '' },
    onDelete: undefined,
    onSave: undefined,
    isNew: true,
  }

  state = {
    record: this.props.record,
    categories: [],
    supportedLanguages: []
  }

  componentDidMount() {
    const getStatic = (name) =>
      WiregooseApi.statics[name]()
        .then(resp => this.setState({ [name]: resp.data.data }));

    const prms = Promise.all(
      ['categories', 'supportedLanguages'].map(getStatic)
    );
    this.refs.load.promise = prms;
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(this.validateLink() === 'success'
      && record.category
      && record.lang
      && record.provider);
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

  handleProviderChange = (val) => {
    const record = this.state.record;
    record.provider = val && val._id || undefined;
    this.setState({ record });
  }

  validateLink = () => (isUri(this.state.record.link) ? 'success' : 'warning');

  getProviderOptions = (input) => {
    return WiregooseApi.crud.retrieveAll('rssprovider', {})
      .then(resp => ({options: resp.data.data.content}));
  }

  render() {
    const {
      isNew,
    } = this.props;

    const {
      record,
      categories,
      supportedLanguages
    } = this.state;

    return (
      <Loader ref="load">
        <Form horizontal>

          { !isNew &&
            <FormGroup controlId="formIdId">
              <Col componentClass={ControlLabel} sm={2}>ID</Col>
              <Col sm={10}>
                <FormControl.Static>{record._id}</FormControl.Static>
              </Col>
            </FormGroup>
          }

          <FormGroup controlId="formIdCategory">
            <Col componentClass={ControlLabel} sm={2}>Category</Col>
            <Col sm={10}>
              <FormControl
                componentClass="select"
                placeholder="select"
                name="category"
                value={record.category}
                onChange={this.handleInputChange}
                required>
                <option value="">-</option>
                {_.map(categories, category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="formIdLink" validationState={this.validateLink()}>
            <Col componentClass={ControlLabel} sm={2}>Link</Col>
            <Col sm={8}>
              <FormControl
                type="text"
                name="link"
                value={record.link}
                onChange={this.handleInputChange}
                required
              />
            </Col>
            <Col sm={2}>
              <Button bsStyle="primary"
                bsSize="small"
                type="button"
                onClick={this.performRssFeedPreview}
                disabled={this.validateLink() !== 'success'}>
                <FontAwesome name="picture-o" /> Preview
              </Button>
            </Col>
          </FormGroup>

          <FormGroup controlId="formIdLang">
            <Col componentClass={ControlLabel} sm={2}>Lang</Col>
            <Col sm={10}>
              <FormControl
                componentClass="select"
                placeholder="select"
                name="lang"
                value={record.lang}
                onChange={this.handleInputChange}
                required>
                <option value="">-</option>
                {_.map(supportedLanguages, supportedLanguage => (
                  <option key={supportedLanguage} value={supportedLanguage}>{supportedLanguage}</option>
                ))}
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="formIdProvider">
            <Col componentClass={ControlLabel} sm={2}>Provider</Col>
            <Col sm={10}>
              <Select.Async
                name="provider"
                value={record.provider}
                loadOptions={this.getProviderOptions}
                onChange={this.handleProviderChange}
                autoload={false}
                valueKey="_id"
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
      </Loader>
    );
  }
}
