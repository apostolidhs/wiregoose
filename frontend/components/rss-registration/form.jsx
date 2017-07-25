import React from 'react';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, Collapse }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import styles from './form.less';
import Select from '../select/select.jsx';
import Loader from '../loader/loader.jsx';
import * as WiregooseApi from '../services/wiregoose-api.js';
import FetchPreview from './fetch-preview.jsx';
import * as FormFactory from '../form/factory.jsx';

@CSSModules(styles, {
  allowMultiple: true
})
export default class FormGenerator extends React.Component {

  static propTypes = FormFactory.getFormPropTypes()
  static defaultProps = FormFactory.getFormDefaultPropTypes()

  state = {
    record: this.props.record,
    categories: [],
    supportedLanguages: [],
    isRssFeedPreviewOpen: false
  }

  componentDidMount() {
    const getStatic = (name) =>
      WiregooseApi.statics[name]()
        .then(resp => this.setState({ [name]: resp.data.data }));
    this.refs.load.promise = Promise.all(
      ['categories', 'supportedLanguages'].map(getStatic)
    );
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(FormFactory.validateLink(this, 'link') === 'success'
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

  handleProviderChange = (val) => {
    const record = this.state.record;
    record.provider = val && val._id || undefined;
    this.setState({ record });
  }

  getProviderOptions = (input) => {
    return WiregooseApi.crud.retrieveAll('rssprovider', {})
      .then(resp => ({options: resp.data.data.content}));
  }

  performRssFeedPreview = () => {
    this.setState({ isRssFeedPreviewOpen: true });
  }

  render() {
    const {
      isNew,
    } = this.props;

    const {
      record,
      categories,
      supportedLanguages,
      isRssFeedPreviewOpen
    } = this.state;

    return (
      <Loader ref="load">
        <Form horizontal>

          { !isNew && FormFactory.createStaticText(record._id, 'ID') }

          { FormFactory.createInputLink({
            name: 'link',
            value: record.link,
            onChange: FormFactory.handleInputChange(this),
            validate: FormFactory.validateLink(this, 'link'),
            required: true
          }) }

          <FormGroup controlId="formIdPreview" className="text-right">
            <Col xs={12}>
              <Button bsStyle="primary"
                bsSize="small"
                type="button"
                onClick={this.performRssFeedPreview}
                disabled={FormFactory.validateLink(this, 'link') !== 'success'}>
                <FontAwesome name="picture-o" /> Preview Link Source
              </Button>
            </Col>
          </FormGroup>

          <Collapse in={isRssFeedPreviewOpen} mountOnEnter={true} className="w-mb-7">
            <FetchPreview link={record.link} styleName="preview" />
          </Collapse>

          { FormFactory.createSelection({
            name: 'category',
            value: record.category,
            onChange: FormFactory.handleInputChange(this),
            enumeration: categories,
            required: true
          }) }

          { FormFactory.createSelection({
            name: 'lang',
            value: record.lang,
            onChange: FormFactory.handleInputChange(this),
            enumeration: supportedLanguages,
            required: true
          }) }

          <FormGroup controlId="formIdProvider">
            <Col componentClass={ControlLabel} sm={2}>Provider</Col>
            <Col sm={10}>
              <Select
                name="provider"
                value={record.provider}
                loadOptions={this.getProviderOptions}
                onChange={this.handleProviderChange}
                valueKey="_id"
                labelKey="name"
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
        </Form>
      </Loader>
    );
  }
}
