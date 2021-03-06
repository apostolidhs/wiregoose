import React from 'react';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Button from 'react-bootstrap/lib/Button';
import Collapse from 'react-bootstrap/lib/Collapse';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import styles from './form.less';
import Select from '../select/select.js';
import * as WiregooseApi from '../services/wiregoose-api.js';
import FetchPreview from './fetch-preview.js';
import * as FormFactory from '../form/factory.js';
import { SUPPORTED_LANGUAGES, CATEGORIES } from '../../../config-public.js';

@CSSModules(styles, {
  allowMultiple: true
})
export default class FormGenerator extends React.Component {

  static propTypes = FormFactory.getFormPropTypes()
  static defaultProps = FormFactory.getFormDefaultPropTypes()

  state = {
    record: this.props.record,
    isRssFeedPreviewOpen: false
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
    const {isNew} = this.props;
    const {record, isRssFeedPreviewOpen} = this.state;

    return (
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
          enumeration: CATEGORIES,
          required: true
        }) }

        { FormFactory.createSelection({
          name: 'lang',
          value: record.lang,
          onChange: FormFactory.handleInputChange(this),
          enumeration: SUPPORTED_LANGUAGES,
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
    );
  }
}
