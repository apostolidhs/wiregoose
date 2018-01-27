import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Form, FormGroup, Col, FormControl, ControlLabel }
  from 'react-bootstrap';

export default class UserStatistics extends React.Component {
  static propTypes = {
    record: PropTypes.shape()
  }

  static defaultProps = {
    record: {}
  }

  render() {
    const { record } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Total Users</Col>
          <Col sm={6}>
            <FormControl.Static>{record.total}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Facebook Users</Col>
          <Col sm={6}>
            <FormControl.Static>{record.facebookUsers}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Pending Validation</Col>
          <Col sm={6}>
            <FormControl.Static>{record.pendingValidation}</FormControl.Static>
          </Col>
        </FormGroup>
      </Form>
    );
  }

}
