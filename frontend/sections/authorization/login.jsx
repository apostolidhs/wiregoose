import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { Row, Col, Image, Panel } from 'react-bootstrap';

import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as Auth from '../../components/authorization/auth.js';
import tr from '../../components/localization/localization.js';
import {getError} from '../../components/services/error-handler.js';
import {templates} from '../../components/notifications/notifications.jsx';
import Loader from '../../components/loader/loader.jsx';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

export default class Login extends React.Component {

  state = {
    errors: {}
  }

  performLogin = (email, password) => {
    this.refs.load.promise = Auth.login(email, password)
      .then(() => {
        browserHistory.push('/');
      })
      .catch(reason => {
        const errors = {};
        if (getError(reason, 4001)) {
          errors.invalidCredentials = tr.invalidCredentials;
        }

        if (_.isEmpty(errors) && reason.status === 400) {
          templates.unexpectedError();
        }

        this.setState({errors});
      });
  }

  render() {
    const {errors} = this.state;
    return (
      <Loader ref="load" title={tr.signIn} >
        <Row>
          <Col className="w-mt-14" >
            <Image className="center-block" width="80" src={mongooseIcon} />
            <h1 className="text-center w-m-0">
              <small>{tr.signIn}</small>
            </h1>
            <span className="text-center center-block text-muted">
            {tr.or} <Link to="/auth/signup">{tr.createAccountPrompt}</Link>
            </span>
          </Col>
          <Col className="w-mt-14" md={4} mdOffset={4} xs={10} xsOffset={1}>
            <Panel>
              {errors.invalidCredentials &&
                <p className={'text-danger'}>{errors.invalidCredentials}</p>
              }
              <CredentialForm onCredentialSubmit={this.performLogin} submitTitle={tr.signIn} />
              <Link to="/auth/forgot">
                <small>{tr.forgotPasswordPrompt}</small>
              </Link>
            </Panel>
          </Col>
        </Row>
      </Loader>
    );
  }
}
