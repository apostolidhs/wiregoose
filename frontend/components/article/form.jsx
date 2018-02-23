import isObject from 'lodash/isObject';
import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Collapse from 'react-bootstrap/lib/Collapse';
import FontAwesome from 'react-fontawesome';
import ReactJson from 'react-json-view';
import CSSModules from 'react-css-modules';

import ArticleBox from '../article-box/article-box.jsx';
import * as FormFactory from '../form/factory.jsx';
import Article from './article.jsx';

export default class ArticleForm extends React.Component {

  static propTypes = FormFactory.getFormPropTypes()
  static defaultProps = FormFactory.getFormDefaultPropTypes()

  state = {
    record: this.props.record,
    isArticlePreviewOpen: false
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(FormFactory.validateLink(this, 'link') === 'success'
      && record.content
      && record.createdAt
      && record.entryId
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

        {
          record.error &&
          <ReactJson src={record.error} collapsed={true} theme="monokai" />
        }

        { FormFactory.createInput({
          name: 'title',
          value: record.title,
          onChange: FormFactory.handleInputChange(this)
        }) }

        { FormFactory.createInput({
          name: 'byline',
          value: record.byline || '',
          onChange: FormFactory.handleInputChange(this)
        }) }

        { FormFactory.createInputLink({
          name: 'link',
          value: record.link,
          onChange: FormFactory.handleInputChange(this),
          validate: FormFactory.validateLink(this, 'link'),
          required: true
        }) }

        { FormFactory.createInputDate({
          name: 'createdAt',
          label: 'Created At',
          value: record.createdAt,
          onChange: FormFactory.handleDateInputChange(this, 'createdAt'),
          required: true
        }) }

        { FormFactory.createInputLink({
          name: 'content',
          value: record.link,
          onChange: FormFactory.handleInputChange(this),
          validate: FormFactory.validateLink(this, 'link'),
          required: true
        }) }

        <FormGroup controlId="formIdContent">
          <Col componentClass={ControlLabel} sm={2}>Content</Col>
          <Col sm={10}>
            <FormControl
              className="form-textarea-content"
              rows="20"
              componentClass="textarea"
              name="content"
              value={record.content}
              onChange={FormFactory.handleInputChange(this)}
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

        {isObject(record.entryId) && (
          <div className="w-mt-7">
            <ArticleBox entry={record.entryId} />
          </div>
        )}


        { !this.isInvalid() && (
          <div>
            <Button className="w-mt-7 pull-right" onClick={ () => this.setState({ isArticlePreviewOpen: !this.state.isArticlePreviewOpen }) }>
              <FontAwesome name="picture-o" /> Preview Article
            </Button>
            { this.state.isArticlePreviewOpen &&
              <Article className="w-mt-7" article={record} />
            }
          </div>
        )}

      </Form>
    )
  }

}
