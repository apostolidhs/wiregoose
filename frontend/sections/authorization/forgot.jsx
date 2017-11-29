import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { Row, Col, Image, Panel } from 'react-bootstrap';

import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as Auth from '../../components/authorization/auth.js';
import mongooseIcon from '../../assets/img/logo-170-nologo.png';

// @CSSModules(styles)
export default class Login extends React.Component {

  performLogin = (email, password) => {
    Auth.login(email, password)
      .then(() => {
        browserHistory.push('/');
      });
  }

  render() {
    return (
      <Row>
        <Col className="w-mt-14" >
          <Image className="center-block" width="80" src={mongooseIcon} />
          <h1 className="text-center w-m-0">
            <small>Forgotten your password?</small>
          </h1>
          <p className="text-center text-muted">
            Enter your email address to reset your password.<br/>
            You may need to check your spam folder.
          </p>
        </Col>
        <Col className="w-mt-14" md={4} mdOffset={4} xs={10} xsOffset={1}>
          <Panel>
            <CredentialForm
              onCredentialSubmit={this.performLogin}
              submitTitle="Send verification email"
              hidePassword
            />
            <Link to="/auth/login">
              <small>Back to login</small>
            </Link>
          </Panel>
        </Col>
      </Row>
    );
  }
}
