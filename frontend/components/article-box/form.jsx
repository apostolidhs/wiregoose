import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, Panel }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';
import CSSModules from 'react-css-modules';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import styles from './form.less';
import Loader from '../loader/loader.jsx';
import Select from '../select/select.jsx';
import SelectInlineRender from '../rss-registration/select-inline-render.jsx';
import * as WiregooseApi from '../services/wiregoose-api.js';
import ArticleBox from './article-box.jsx';
import Article from '../article/article.jsx';

@CSSModules(styles, {
  allowMultiple: true,
})
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
    record: this.props.record
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(this.validateLink('image') === 'success'
      && this.validateLink('link') === 'success'
      && record.title
      && record.description
      && record.published
      && record.provider
      && record.registration
    );
  }

  fetchArticle = () => {
    this.refs.articleLoad.promise = WiregooseApi.fetchArticle(this.state.record._id)
      .then(resp => this.setState({ article: resp.data.data }));
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

  getAuthorOptions = (input) => {
    return WiregooseApi.crud.retrieveAll('entry/authors')
      .then(resp => ({options: resp.data.data.content}));
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
    record.registration = val && val._id || undefined;
    this.setState({ record });
  }

  handleDatePickerChange = (e) => {
    const record =  this.state.record;
    record.published = e.toDate();
    this.setState({ record });
  }

  validateLink = (type) => (isUri(this.state.record[type]) ? 'success' : 'warning');

  render() {
    const {
      isNew,
    } = this.props;

    const {
      record
    } = this.state;

    return (
      <Form horizontal styleName="form">

        { !isNew &&
          <FormGroup controlId="formIdId">
            <Col componentClass={ControlLabel} sm={2}>ID</Col>
            <Col sm={10}>
              <FormControl.Static>{record._id}</FormControl.Static>
            </Col>
          </FormGroup>
        }

        <FormGroup controlId="formIdTitle">
          <Col componentClass={ControlLabel} sm={2}>Title</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="title"
              value={record.title}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdLink" validationState={this.validateLink('link')}>
          <Col componentClass={ControlLabel} sm={2}>Link</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="link"
              value={record.link}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdImage" validationState={this.validateLink('image')}>
          <Col componentClass={ControlLabel} sm={2}>Image</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="image"
              value={record.image}
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
              value={record.description}
              onChange={this.handleInputChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdPublished">
          <Col componentClass={ControlLabel} sm={2}>Published</Col>
          <Col sm={10}>
             <DatePicker
              name="published"
              selected={moment(record.published)}
              onChange={this.handleDatePickerChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdAuthor">
          <Col componentClass={ControlLabel} sm={2}>Author</Col>
          <Col sm={10}>
            <Select
              name="author"
              singleValue="name"
              value={record.author}
              loadOptions={this.getAuthorOptions}
              onChange={this.handleProviderChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdProvider">
          <Col componentClass={ControlLabel} sm={2}>Provider</Col>
          <Col sm={10}>
            <Select
              name="provider"
              singleValue="name"
              value={record.provider}
              loadOptions={this.getProviderOptions}
              onChange={this.handleProviderChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdRegistration">
          <Col componentClass={ControlLabel} sm={2}>Registration</Col>
          <Col sm={10}>
            <Select
              name="registration"
              singleValue="_id"
              value={record.registration}
              render={SelectInlineRender}
              loadOptions={this.getRegistrationOptions}
              onChange={this.handleRegistrationChange}
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

        { !this.isInvalid() && (
          <div className="w-mt-7">
            <ArticleBox entry={record} />
          </div>
        )}

        { !this.isInvalid() && (
          <Loader ref="articleLoad" className="w-mt-7">
            <Button bsStyle="primary" className="pull-right" onClick={this.fetchArticle}>
              <FontAwesome name="newspaper-o" /> Fetch Article
            </Button>
            <Panel collapsible expanded={!!this.state.article}>
              { this.state.article &&
                <Article article={this.state.article} />
              }
            </Panel>
          </Loader>
        )}
      </Form>
    );
  }
}
