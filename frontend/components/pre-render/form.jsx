import isNumber from 'lodash/isNumber';
import React from 'react';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, Panel, Collapse }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import styles from './form.less';
import * as FormFactory from '../form/factory.jsx';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class PreRenderForm extends React.Component {

  static propTypes = FormFactory.getFormPropTypes()
  static defaultProps = FormFactory.getFormDefaultPropTypes()

  state = {
    record: this.props.record,
    isPagePreviewOpen: false
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(
      record.content
      && record.link
      && record.createdAt
      && record.lastHit
      && isNumber(record.hits)
    );
  }

  onSaveClicked = (e) => {
    e.preventDefault();
    this.props.onSave(this.state.record);
  }

  onDeleteClicked = (e) => {
    e.preventDefault();
    this.props.onDelete(this.state.record);
  }

  previewIframe = () => {
    this.setState({ isPagePreviewOpen: !this.state.isPagePreviewOpen }, () => {
      if (!this.state.isPagePreviewOpen) {
        return;
      }
      const iframe = document.createElement('iframe');
      const html = this.state.record.content;
      this.iframeContainerEl.appendChild(iframe);
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(html);
      iframe.contentWindow.document.close();
    });
  }

  render () {
    const {
      isNew,
    } = this.props;

    const {
      record
    } = this.state;

    return (
      <Form horizontal>

        { !isNew && FormFactory.createStaticText(record._id, 'ID') }

        { FormFactory.createInput({
          name: 'link',
          value: record.link,
          onChange: FormFactory.handleInputChange(this),
          required: true
        }) }

        { FormFactory.createInputDate({
          name: 'createdAt',
          label: 'Created At',
          value: record.createdAt,
          onChange: FormFactory.handleDateInputChange(this, 'createdAt'),
          required: true
        }) }

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

        <FormGroup controlId="formIdContent">
          <Col componentClass={ControlLabel} sm={2}>Content</Col>
          <Col sm={10}>
            <FormControl
              rows="10"
              className="form-textarea-content"
              componentClass="textarea"
              name="content"
              value={record.content}
              onChange={FormFactory.handleInputChange(this)}
              required
            />
          </Col>
        </FormGroup>

        { record.content && (
          <FormGroup controlId="formIdContentPreview" styleName="content-preview">
            <Col xs={12} className="w-mt-7">
              <Button className="pull-right" onClick={this.previewIframe}>
                <FontAwesome name="picture-o" /> Preview Page
              </Button>
            </Col>
            { this.state.isPagePreviewOpen &&
              <Col xs={12} className="w-mt-7">
                <div ref={el => this.iframeContainerEl = el}></div>
              </Col>
            }
          </FormGroup>
        )}

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
