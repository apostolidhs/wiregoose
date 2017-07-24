import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, Panel }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import ReactJson from 'react-json-view';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { isUri } from 'valid-url';
import CSSModules from 'react-css-modules';

import styles from './form.less';
import ArticleBox from '../article-box/article-box.jsx';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Article extends React.Component {

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
    return !(this.validateLink('link') === 'success'
      && record.content
      && record.createdAt
      && record.entryId
    );
  }

  validateLink = (type) => (isUri(this.state.record[type]) ? 'success' : 'warning');

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

  handleDatePickerChange = (e) => {
    const record =  this.state.record;
    record.createdAt = e.toDate();
    this.setState({ record });
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

        { !isNew &&
          <FormGroup controlId="formIdId">
            <Col componentClass={ControlLabel} sm={2}>ID</Col>
            <Col sm={10}>
              <FormControl.Static>{record._id}</FormControl.Static>
            </Col>
          </FormGroup>
        }

        {
          record.error &&
          <ReactJson src={record.error} collapsed={true} theme="monokai" />
        }

        <FormGroup controlId="formIdTitle">
          <Col componentClass={ControlLabel} sm={2}>Title</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="title"
              value={record.title}
              onChange={this.handleInputChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdByline">
          <Col componentClass={ControlLabel} sm={2}>Byline</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="byline"
              value={record.byline | ''}
              onChange={this.handleInputChange}
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

         <FormGroup controlId="formIdCreateAt">
          <Col componentClass={ControlLabel} sm={2}>Created At</Col>
          <Col sm={10}>
             <DatePicker
              name="createdAt"
              selected={moment(record.createdAt)}
              onChange={this.handleDatePickerChange}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdContent">
          <Col componentClass={ControlLabel} sm={2}>Content</Col>
          <Col sm={10}>
            <FormControl
              styleName="form-textarea-content"
              rows="20"
              componentClass="textarea"
              name="content"
              value={record.content}
              onChange={this.handleInputChange}
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

         { _.isObject(record.entryId) && (
          <div className="w-mt-7">
            <ArticleBox entry={record.entryId} />
          </div>
        )}

      </Form>
    )
  }

}
