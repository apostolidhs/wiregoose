import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { Row, Col, Image, Panel } from 'react-bootstrap';

import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as Auth from '../../components/authorization/auth.js';
import mongooseIcon from '../../assets/img/logo-170-nologo.png';

// @CSSModules(styles)
export default class Login extends React.Component {

  performSignup = (email, password) => {
    Auth.signup(email, password)
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
            <small>Sign up</small>
          </h1>
          <span className="text-center center-block text-muted">
            or <Link to="/auth/login">sign in to your account</Link>
          </span>
        </Col>
        <Col className="w-mt-14" md={4} mdOffset={4} xs={10} xsOffset={1}>
          <Panel>
            <CredentialForm onCredentialSubmit={this.performSignup} submitTitle="Sign up" />
          </Panel>
        </Col>
      </Row>
    );
  }
}
