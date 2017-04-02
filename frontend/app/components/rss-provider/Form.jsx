import React from 'react';
// import _ from 'lodash';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';

export default class FormGenerator extends React.Component {

  static propTypes = {
    record: React.PropTypes.shape(),
    onSave: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    isNew: React.PropTypes.bool,
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

  onSaveClicked = (e) => {
    e.preventDefault();
    this.props.onSave(this.state.record);
  }

  onDeleteClicked = (e) => {
    e.preventDefault();
    this.props.onDelete(this.state.record);
  }

  handleInputChange = (e) => {
    const record = {
      ...this.state.record,
      [e.target.name]: e.target.value,
    };
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
            />
          </Col>
        </FormGroup>

        <Button type="submit" onClick={this.onSaveClicked}>
          <FontAwesome name="save" /> { isNew ? 'Create' : 'Save' }
        </Button>
        { !isNew &&
          <Button type="submit" onClick={this.onDeleteClicked}>
            <FontAwesome name="trash-o" /> Delete
          </Button>
        }
      </Form>
    );
  }
}
