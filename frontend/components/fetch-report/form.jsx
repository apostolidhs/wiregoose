import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, FormControl, ControlLabel }
  from 'react-bootstrap';;
import FromNow from '../text-utilities/from-now.jsx';

export default class FetchReportForm extends React.Component {

  static propTypes = {
    record: PropTypes.shape()
  }

  static defaultProps = {
    record: {}
  }

  render() {
    const {
      record
    } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Total Fetches</Col>
          <Col sm={6}>
            <FormControl.Static>{record.totalFetches}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Succeeded/Failed Fetches</Col>
          <Col sm={6}>
            <FormControl.Static>{record.succeededFetches} / {record.unsucceededFetches}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Stored/aborted Entries</Col>
          <Col sm={6}>
            <FormControl.Static>{record.entriesStored} / {record.entriesAborted}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Started</Col>
          <Col sm={6}>
            <FormControl.Static>
              <FromNow date={record.started} />
            </FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={6}>Duration</Col>
          <Col sm={6}>
            <FormControl.Static>
              {record.duration} seconds
            </FormControl.Static>
          </Col>
        </FormGroup>

        <h4>Failures</h4>
        <ReactJson src={record.failedFetches} collapsed={true} theme="monokai" />
      </Form>
    );
  }
}
