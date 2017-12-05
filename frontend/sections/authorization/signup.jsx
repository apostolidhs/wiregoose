import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { Row, Col, Image, Panel } from 'react-bootstrap';

import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as Auth from '../../components/authorization/auth.js';
import BrowserLanguageDetection from '../../components/utilities/browser-language-detection.js';
import tr from '../../components/localization/localization.js';
import {getError} from '../../components/services/error-handler.js';
import {templates} from '../../components/notifications/notifications.jsx';
import Loader from '../../components/loader/loader.jsx';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

export default class Login extends React.Component {

  state = {
    errors: {}
  }

  performSignup = (email, password) => {
    const lang = BrowserLanguageDetection();
    this.refs.load.promise = Auth.signup(email, password, lang)
      .then(() => {
        browserHistory.push('/');
      })
      .catch(reason => {
        const errors = {};
        if (getError(reason, 4003)) {
          errors.email = tr.emailAlreadyExist;
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
      <Loader ref="load" title={tr.signUp} >
        <Row>
          <Col className="w-mt-14" >
            <Image className="center-block" width="80" src={mongooseIcon} />
            <h1 className="text-center w-m-0">
              <small>{tr.signUp}</small>
            </h1>
            <span className="text-center center-block text-muted">
            {tr.or} <Link to="/auth/login">{tr.signInPrompt}</Link>
            </span>
          </Col>
          <Col className="w-mt-14" md={4} mdOffset={4} xs={10} xsOffset={1}>
            <Panel>
              <CredentialForm
                onCredentialSubmit={this.performSignup}
                submitTitle={tr.signUp}
                errors={errors}
              />
            </Panel>
          </Col>
        </Row>
      </Loader>
    );
  }
}
