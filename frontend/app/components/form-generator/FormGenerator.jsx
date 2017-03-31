import React from 'react';
import _ from 'lodash';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';
import { toUppercasesWords } from '../text-utilities';

export default class FormGenerator extends React.Component {

  static propTypes = {
    model: React.PropTypes.shape().isRequired,
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
    this.props.onDelete();
  }

  handleInputChange = (e) => {
    const record = {
      ...this.state.record,
      [e.target.name]: e.target.value,
    };
    this.setState({ record });
  }

  renderString = (props, key, validationState) => {
    const validator = validationState && { validationState };

    return (
      <FormGroup
        controlId={`formId${key}`}
        key={key}
        {...validator}
      >
        <Col componentClass={ControlLabel} sm={2}>
          {toUppercasesWords(key)}
        </Col>
        <Col sm={10}>
          {(() => {
            if (key === '_id') {
              return (
                <FormControl.Static>
                  {this.state.record[key]}
                </FormControl.Static>
              );
            } else {
              return (
                <FormControl
                  type="text"
                  name={key}
                  value={this.state.record[key]}
                  onChange={this.handleInputChange}
                />
              );
            }
          })()}
        </Col>
      </FormGroup>
    );
  }

  renderUrl = (props, key) => {
    const validator = (isUri(this.state.record[key]) ? 'success' : 'warning');
    return this.renderString(props, key, validator);
  };

  render() {
    const {
      model,
      isNew,
    } = this.props;

    return (
      <Form horizontal>
        {
          _.map(model.schema, (props, key) =>
            this[`render${props.type}`](props, key))
        }
        <Button type="submit" onClick={this.onSaveClicked}>
          <FontAwesome name="save" /> { isNew ? 'Create' : 'Save' }
        </Button>
        <Button type="submit" onClick={this.onDeleteClicked}>
          <FontAwesome name="trash-o" /> Delete
        </Button>
      </Form>
    );
  }
}
