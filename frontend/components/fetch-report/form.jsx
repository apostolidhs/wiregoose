import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, FormControl, ControlLabel }
  from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import TimeAgoEnglishStrings
from 'react-timeago/lib/language-strings/en';
import TimeAgoBuildFormatter
from 'react-timeago/lib/formatters/buildFormatter';

const formatter = TimeAgoBuildFormatter(TimeAgoEnglishStrings)

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
          <Col componentClass={ControlLabel} sm={4}>Total Fetches</Col>
          <Col sm={2}>
            <FormControl.Static>{record.totalFetches}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>Succeeded/Failed Fetches</Col>
          <Col sm={2}>
            <FormControl.Static>{record.succeededFetches} / {record.totalFetches - record.succeededFetches}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>Stored/aborted Entries</Col>
          <Col sm={2}>
            <FormControl.Static>{record.entriesStored} / {record.succeededFetches - record.entriesStored}</FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4}>Period</Col>
          <Col sm={6}>
            <FormControl.Static>
              <TimeAgo
                date={record.started}
                minPeriod={1}
                formatter={formatter}
              />
              (<TimeAgo
                date={record.started}
                minPeriod={1}
                formatter={formatter}
              />)
            </FormControl.Static>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
