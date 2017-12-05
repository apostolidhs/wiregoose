import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { Row, Col, Image, Panel } from 'react-bootstrap';

import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';
import tr from '../../components/localization/localization.js';
import {getError} from '../../components/services/error-handler.js';
import {templates} from '../../components/notifications/notifications.jsx';
import Loader from '../../components/loader/loader.jsx';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

export default class Forgot extends React.Component {

  state = {
    errors: {}
  }

  performPasswordRecover = (email) => {
    this.refs.load.promise = WiregooseApi.resetPassword(email)
      .then(() => {
        browserHistory.push('/');
      })
      .catch(reason => {
        const errors = {};
        // if (getError(reason, 4001)) {
        //   errors.invalidCredentials = tr.invalidCredentials;
        // }

        // if (_.isEmpty(errors) && reason.status === 400) {
        //   templates.unexpectedError();
        // }

        this.setState({errors});
      });
  }

  render() {
    const {errors} = this.state;
    return (
      <Loader ref="load" title={tr.resetPasswordCta} >
        <Row>
          <Col className="w-mt-14" >
            <Image className="center-block" width="80" src={mongooseIcon} />
            <h1 className="text-center w-m-0">
              <small>{tr.forgotPasswordPrompt}</small>
            </h1>
            <p className="text-center text-muted">
              {tr.forgotPasswordInfo.map((t, idx) => <span key={idx}>{t}<br/></span>)}
            </p>
          </Col>
          <Col className="w-mt-14" md={4} mdOffset={4} xs={10} xsOffset={1}>
            <Panel>
              <CredentialForm
                onCredentialSubmit={this.performPasswordRecover}
                submitTitle={tr.resetPasswordCta}
                hidePassword
              />
              <Link to="/auth/login">
                <small>{tr.backToLogin}</small>
              </Link>
            </Panel>
          </Col>
        </Row>
      </Loader>
    );
  }
}


