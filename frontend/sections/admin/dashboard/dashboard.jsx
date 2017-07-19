import React from 'react';
import { Row, Col, Panel }
  from 'react-bootstrap';

import * as Notifications from '../../../components/notifications/notifications.jsx';
import Loader from '../../../components/loader/loader.jsx';
import AppInfoForm from '../../../components/app-info/form.jsx';
import AppInfoResponseTransformation from '../../../components/app-info/response-transformation.js';
import * as WiregooseApi from '../../../components/services/wiregoose-api.js';

export default class Dashboard extends React.Component {

  state = {
    appInfo: undefined
  };

  componentDidMount() {
    this.retrieveAppInfo();
  }

  retrieveAppInfo = () => {
    this.refs.load.promise =  WiregooseApi.crud.retrieveAll('app')
      .then(resp => {
        const content = resp.data.data;
        const appInfo = AppInfoResponseTransformation(content);
        this.setState({ appInfo });
      });
  }

  updateAppInfo = record =>
    this.refs.load.promise = WiregooseApi.crud.updateSingle('app', record)
      .then(() => Notifications.create.info('Rss fetch info updated'))
      .then(() => this.retrieveAppInfo())

  render() {
    return (
      <Loader ref="load">
        { this.state.appInfo &&
          <Row>
            <Col md={8}>
              <Panel>
                <h4>Rss Fetch Info</h4>
                <AppInfoForm record={this.state.appInfo} onSave={this.updateAppInfo} />
              </Panel>
            </Col>
          </Row>
        }

      </Loader>
    );
  }

}
