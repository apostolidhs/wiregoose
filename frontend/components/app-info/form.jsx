import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, InputGroup }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import FromNow from '../utilities/from-now.jsx';

export default class RssFetchReport extends React.Component {

  static propTypes = {
    record: PropTypes.shape(),
    onSave: PropTypes.func
  }

  static defaultProps = {
    record: {},
    onSave: undefined,
  }

  state = {
    record: this.props.record
  }

  isInvalid = () => {
    const { record } = this.state;
    return !(record.lastRssRegistrationFetch
      && record.rssRegistrationFetchFrequency > 0);
  }

  onSaveClicked = (e) => {
    e.preventDefault();
    this.props.onSave(this.state.record);
  }

  handleInputChange = (e) => {
    const record = this.state.record;
    record[e.target.name] = e.target.value;
    this.setState({ record });
  }

  handleDatePickerChange = (e) => {
    const record =  this.state.record;
    record.lastRssRegistrationFetch = e.toDate();
    this.setState({ record });
  }

  render() {
    return (
      <Form horizontal>

        <FormGroup controlId="formIdLastRssRegistrationFetch">
          <Col componentClass={ControlLabel} sm={5}>Last Rss Registration Fetch</Col>
          <Col sm={7}>
            <DatePicker
              name="lastRssRegistrationFetch"
              selected={moment(this.state.record.lastRssRegistrationFetch)}
              onChange={this.handleDatePickerChange}
            />
            <FromNow
              className="text-muted"
              date={this.state.record.lastRssRegistrationFetch}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdRssRegistrationFetchFrequency">
          <Col componentClass={ControlLabel} sm={5}>Rss Registration Fetch Frequency</Col>
          <Col sm={7}>
            <InputGroup>
              <FormControl
                type="number"
                name="rssRegistrationFetchFrequency"
                value={this.state.record.rssRegistrationFetchFrequency}
                onChange={this.handleInputChange}
                required
              />
              <InputGroup.Addon>
                {Math.round(this.state.record.rssRegistrationFetchFrequency / (60 * 1000))} m
                ({Math.round(this.state.record.rssRegistrationFetchFrequency / (60 * 60 * 1000))} h)
              </InputGroup.Addon>
            </InputGroup>
          </Col>
        </FormGroup>

        <div className="clearfix">
          <Button bsStyle="primary" className="pull-right" type="submit" onClick={this.onSaveClicked} disabled={this.isInvalid()}>
            <FontAwesome name="save" /> Save
          </Button>
        </div>
      </Form>
    );
  }
}
