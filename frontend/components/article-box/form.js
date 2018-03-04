import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';
import CSSModules from 'react-css-modules';
import DatePicker from 'react-datepicker';

import styles from './form.less';
import Loader from '../loader/loader.js';
import Select from '../select/select.js';
import SelectInlineRender from '../rss-registration/select-inline-render.js';
import * as WiregooseApi from '../services/wiregoose-api.js';
import ArticleBox from './article-box.js';
import Article from '../article/article.js';
import * as FormFactory from '../form/factory.js';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class ArticleBoxForm extends React.Component {

  static propTypes = FormFactory.getFormPropTypes()
  static defaultProps = FormFactory.getFormDefaultPropTypes()

  state = {
    record: this.props.record
  }

  isInvalid = () => {
    const { record } = this.state;
    return !((FormFactory.validateLink(this, 'image') === 'success'
      || record.description)
      && FormFactory.validateLink(this, 'link') === 'success'
      && record.title
      && record.published
      && record.provider
      && record.registration
    );
  }

  fetchArticle = () => {
    this.refs.articleLoad.promise = WiregooseApi.fetchArticle(this.state.record._id)
      .then(resp => this.setState({ article: resp.data.article }));
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

        { !isNew && FormFactory.createStaticText(record._id, 'ID') }

        { FormFactory.createInput({
          name: 'title',
          value: record.title,
          onChange: FormFactory.handleInputChange(this),
          required: true
        }) }

        { FormFactory.createInputLink({
          name: 'link',
          value: record.link,
          onChange: FormFactory.handleInputChange(this),
          validate: FormFactory.validateLink(this, 'link'),
          required: true
        }) }

        { FormFactory.createInputLink({
          name: 'image',
          value: record.image,
          onChange: FormFactory.handleInputChange(this),
          validate: FormFactory.validateLink(this, 'image')
        }) }

        <FormGroup controlId="formIdDescription">
          <Col componentClass={ControlLabel} sm={2}>Description</Col>
          <Col sm={10}>
            <FormControl
              componentClass="textarea"
              name="description"
              value={record.description}
              onChange={this.handleInputChange}
            />
          </Col>
        </FormGroup>

        { FormFactory.createInputDate({
          name: 'published',
          value: record.published,
          onChange: FormFactory.handleDateInputChange(this, 'published'),
          required: true
        }) }

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

        { FormFactory.createInputDate({
          name: 'lastHit',
          value: record.lastHit,
          onChange: FormFactory.handleDateInputChange(this, 'lastHit'),
          required: true
        }) }

        { FormFactory.createInput({
          name: 'hits',
          type: 'number',
          value: record.hits,
          onChange: FormFactory.handleInputChange(this),
          required: true
        }) }

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

        { FormFactory.createFormOptionsPanel({
          onDelete: !isNew && this.onDeleteClicked,
          onSave: this.onSaveClicked,
          isInvalid: this.isInvalid(),
          isNew
        }) }

        { !this.isInvalid() && (
          <div className="w-mt-7">
            <ArticleBox entry={record} />
          </div>
        )}

        { !this.isInvalid() && (
          <Loader ref="articleLoad" className="w-mt-7">
            <Button bsStyle="primary" className="pull-right" onClick={this.fetchArticle}>
              <FontAwesome name="newspaper-o" /> Fetch Article {record.article && '(Article is Cached)'}
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
