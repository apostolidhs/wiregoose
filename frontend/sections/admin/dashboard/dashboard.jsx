import _ from 'lodash';
import React from 'react';
import { Row, Col, Panel, Button }
  from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import * as Notifications from '../../../components/notifications/notifications.jsx';
import Loader from '../../../components/loader/loader.jsx';
import AppInfoForm from '../../../components/app-info/form.jsx';
import AppInfoResponseTransformation from '../../../components/app-info/response-transformation.js';
import FetchReportForm from '../../../components/fetch-report/form.jsx';
import FetchReportResponseTransformation from '../../../components/fetch-report/response-transformation.js';
import SucceededFetchesPerPeriod from '../../../components/measures/succeeded-fetches-per-period.jsx';
import ArticleStatistics from '../../../components/measures/article-statistics.jsx';
import UserStatistics from '../../../components/user/user-statistics.jsx';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

export default class Dashboard extends React.Component {

  state = {
    appInfo: undefined,
    fetchReport: undefined,
    categories: undefined,
    supportedLanguages: undefined,
    articleStatistics: undefined
  };

  componentDidMount() {
    this.retrieveAppInfo();
    this.retrieveLastFetchReport();
    this.retrieveArticleStatistics();
    this.retrieveUserStatistics();
  }

  retrieveAppInfo = () => {
    this.refs.appInfoPrms.promise = WiregooseApi.crud.retrieveAll('app')
      .then(resp => {
        const content = resp.data.data;
        const appInfo = AppInfoResponseTransformation(content);
        this.setState({ appInfo });
      });
  }

  retrieveArticleStatistics = () => {
    this.refs.articleStatistics.promise = WiregooseApi.getArticleStatistics()
      .then(resp => this.setState({ articleStatistics: resp.data.data }));
  }

  retrieveUserStatistics = () => {
    this.refs.userStatistics.promise = WiregooseApi.getUserStatistics()
    .then(resp => this.setState({ userStatistics: resp.data.data }));
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

  forceFetchRssRegistrations = () =>
    this.refs.appInfoPrms.promise = WiregooseApi.rssFeed.fetchRssRegistrations()
      .then(() => Notifications.create.success('Rss registrations fetched successfully'))
      .then(() => this.retrieveAppInfo())
      .then(() => this.retrieveLastFetchReport())

  render() {
    return (
      <div>
        <Row>
          <Col md={6}>
            <Loader ref="appInfoPrms">
              { this.state.appInfo &&
                <Panel>
                  <h3>Rss Fetch Info</h3>
                  <AppInfoForm record={this.state.appInfo} onSave={this.updateAppInfo} />
                  <hr />
                  <div className="text-right">
                    Force Rss Fetch Now {' '}
                    <Button bsStyle="primary" bsSize="xsmall" onClick={this.forceFetchRssRegistrations}>
                      <FontAwesome name="rocket" /> Fetch
                    </Button>
                  </div>
                </Panel>
              }
            </Loader>
          </Col>
          <Col md={6}>
            <Loader ref="fetchReportPrms">
              { this.state.fetchReport &&
                <Panel>
                  <h3>Last Fetch Report</h3>
                  <FetchReportForm record={this.state.fetchReport} />
                </Panel>
              }
            </Loader>
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Loader ref="articleStatistics">
              <Panel>
                <h3>Articles</h3>
                { this.state.articleStatistics &&
                  <ArticleStatistics statistics={this.state.articleStatistics} />
                }
              </Panel>
            </Loader>
          </Col>
          <Col xs={4}>
            <Loader ref="userStatistics">
              { this.state.userStatistics &&
                <Panel>
                  <h3>Users</h3>
                  <UserStatistics record={this.state.userStatistics} />
                </Panel>
              }
            </Loader>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Panel>
              <h3>Fetched Entries Per Provider</h3>
              <SucceededFetchesPerPeriod />
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }

}
