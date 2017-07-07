import React from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';

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
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(this.validateLink() === 'success'
      && record.name);
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

        <FormGroup controlId="formIdName">
          <Col componentClass={ControlLabel} sm={2}>Name</Col>
          <Col sm={10}>
            <FormControl
              type="text"
              name="name"
              value={this.state.record.name}
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
