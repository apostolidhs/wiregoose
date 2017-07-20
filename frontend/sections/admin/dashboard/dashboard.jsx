import _ from 'lodash';
import React from 'react';
import { Row, Col, Panel }
  from 'react-bootstrap';

import * as Notifications from '../../../components/notifications/notifications.jsx';
import Loader from '../../../components/loader/loader.jsx';
import AppInfoForm from '../../../components/app-info/form.jsx';
import AppInfoResponseTransformation from '../../../components/app-info/response-transformation.js';
import FetchReportForm from '../../../components/fetch-report/form.jsx';
import FetchReportResponseTransformation from '../../../components/fetch-report/response-transformation.js';
import SucceededFetchesPerPeriod from '../../../components/measures/succeeded-fetches-per-period.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

export default class Dashboard extends React.Component {

  state = {
    appInfo: undefined,
    fetchReport: undefined,
    categories: undefined,
    supportedLanguages: undefined
  };

  componentDidMount() {
    this.retrieveAppInfo();
    this.retrieveLastFetchReport();
  }

  retrieveAppInfo = () => {
    this.refs.appInfoPrms.promise = WiregooseApi.crud.retrieveAll('app')
      .then(resp => {
        const content = resp.data.data;
        const appInfo = AppInfoResponseTransformation(content);
        this.setState({ appInfo });
      });
  }

  retrieveLastFetchReport = () => {
    this.refs.fetchReportPrms.promise = WiregooseApi.crud.retrieveAll('fetchReport', {
      page: 1,
      count: 1,
      sortBy: 'finished'
    })
      .then(resp => {
        const content = _.first(resp.data.data.content);
        if (!_.isEmpty(content)) {
          const fetchReport = FetchReportResponseTransformation(content);
          this.setState({ fetchReport });
        }
      });
  }

  updateAppInfo = record =>
    this.refs.appInfoPrms.promise = WiregooseApi.crud.updateSingle('app', record)
      .then(() => Notifications.create.info('Rss fetch info updated'))
      .then(() => this.retrieveAppInfo())

  render() {
    return (
      <div>
        <Row>
          <Col md={6}>
            <Loader ref="appInfoPrms">
              { this.state.appInfo &&
                <Panel>
                  <h4>Rss Fetch Info</h4>
                  <AppInfoForm record={this.state.appInfo} onSave={this.updateAppInfo} />
                </Panel>
              }
            </Loader>
          </Col>
          <Col md={6}>
            <Loader ref="fetchReportPrms">
              { this.state.fetchReport &&
                <Panel>
                  <h4>Last Fetch Report</h4>
                  <FetchReportForm record={this.state.fetchReport} />
                </Panel>
              }
            </Loader>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Panel>
              <h4>Fetched Entries Per Provider</h4>
              <SucceededFetchesPerPeriod />
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }

}
