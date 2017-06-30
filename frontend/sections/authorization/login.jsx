import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router'
// import CSSModules from 'react-css-modules';
// import styles from './login.less';
import { Row, Col } from 'react-bootstrap';
import LoginComponent from '../../components/authorization/login.jsx';
import * as Auth from '../../components/authorization/auth.js';

// @CSSModules(styles)
export default class Login extends React.Component {

  performLogin = (email, password) => {
    Auth.login(email, password)
      .then(() => {
        browserHistory.push('/componentsGallery');
      });
  }

  render() {
    const { onLogin } = this.props;
    return (
      <Row>
        <Col md={6} mdOffset={3} xs={10} xsOffset={1}>
          <LoginComponent onLoginClicked={this.performLogin} />
        </Col>
      </Row>
    );
  }
}
