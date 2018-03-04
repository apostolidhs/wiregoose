import map from 'lodash/map';
import startCase from 'lodash/startCase';
import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Button from 'react-bootstrap/lib/Button';
import { isUri } from 'valid-url';
import FontAwesome from 'react-fontawesome';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export function createStaticText(value, label) {
  return (
    <FormGroup controlId={`form${label}`}>
      <Col componentClass={ControlLabel} sm={2}>{label}</Col>
      <Col sm={10}>
        <FormControl.Static>{value}</FormControl.Static>
      </Col>
    </FormGroup>
  );
}

export function createInput({type = 'text', name, value = '', onChange, label = startCase(name), required = false}) {
  return (
    <FormGroup controlId={`form${name}`}>
      <Col componentClass={ControlLabel} sm={2}>{label}</Col>
      <Col sm={10}>
        <FormControl
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      </Col>
    </FormGroup>
  )
}

export function createInputLink({name, value = '', onChange, label = startCase(name), validate, required = false}) {
  return (
    <FormGroup controlId={`form${name}`} validationState={validate}>
      <Col componentClass={ControlLabel} sm={2}>{label}</Col>
      <Col sm={10}>
        <FormControl
          type="url"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      </Col>
    </FormGroup>
  )
}

export function createSelection({name, value = '', onChange, label = startCase(name), required = false, enumeration}) {
  return (
    <FormGroup controlId={`form${name}`}>
      <Col componentClass={ControlLabel} sm={2}>{label}</Col>
      <Col sm={10}>
        <FormControl
          componentClass="select"
          placeholder="select"
          name={name}
          value={value}
          onChange={onChange}
          required>
          <option value="">-</option>
          {map(enumeration, value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </FormControl>
      </Col>
    </FormGroup>
  );
}

export function createInputDate({name, value = new Date, onChange, label = startCase(name), required = false}) {
  return (
    <FormGroup controlId={`form${name}`}>
      <Col componentClass={ControlLabel} sm={2}>{label}</Col>
      <Col sm={10}>
        <DatePicker
          name={name}
          selected={moment(value)}
          onChange={onChange}
          required
        />
      </Col>
    </FormGroup>
  );
}

export function createFormOptionsPanel({ onDelete, onSave, isNew, isInvalid }) {
  return (
    <div className="clearfix">
      <Button bsStyle="primary" className="pull-right" type="submit" onClick={onSave} disabled={isInvalid}>
        <FontAwesome name="save" /> { isNew ? 'Create' : 'Save' }
      </Button>
      { onDelete &&
        <Button bsStyle="warning" className="pull-right w-mr-7" type="submit" onClick={onDelete}>
          <FontAwesome name="trash-o" /> Delete
        </Button>
      }
    </div>
  );
}

export function handleInputChange(component, field = 'record') {
  return (e) => {
    const record = component.state[field];
    record[e.target.name] = e.target.value;
    component.setState({ [field]: record });
  }
}

export function handleDateInputChange(component, property, field = 'record') {
  return (e) => {
    const record = component.state[field];
    record[property] = e.toDate();
    component.setState({ [field]: record });
  }
}

export function validateLink(component, name, field = 'record') {
  return isUri(component.state[field][name]) ? 'success' : 'warning';
}

export function getFormPropTypes() {
  return {
    record: PropTypes.shape(),
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    isNew: PropTypes.bool,
  };
}

export function getFormDefaultPropTypes() {
  return {
    record: {},
    onDelete: undefined,
    onSave: undefined,
    isNew: true,
  };
}
