import React from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button, InputGroup }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { isUri } from 'valid-url';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import DatePicker from 'react-datepicker';

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

  render() {
    return (
      <Form horizontal>

        <FormGroup controlId="formIdLastRssRegistrationFetch">
          <Col componentClass={ControlLabel} sm={6}>Last Rss Registration Fetch</Col>
          <Col sm={6}>
            <DatePicker
              name="lastRssRegistrationFetch"
              selected={moment(this.state.record.lastRssRegistrationFetch)}
              onChange={this.handleInputChange}
            />
            <TimeAgo
              className="text-muted"
              date={this.state.record.lastRssRegistrationFetch}
              minPeriod={1}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formIdRssRegistrationFetchFrequency">
          <Col componentClass={ControlLabel} sm={6}>Rss Registration Fetch Frequency</Col>
          <Col sm={6}>
            <InputGroup>
              <FormControl
                type="number"
                name="rssRegistrationFetchFrequency"
                value={this.state.record.rssRegistrationFetchFrequency}
                onChange={this.handleInputChange}
                required
              />
              <InputGroup.Addon>
                {Math.round(this.state.record.rssRegistrationFetchFrequency / (60 * 1000))} mins
                ({Math.round(this.state.record.rssRegistrationFetchFrequency / (60 * 60 * 1000))} hours)
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
