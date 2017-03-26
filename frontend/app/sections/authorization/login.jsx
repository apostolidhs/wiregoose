import React from 'react';
// import CSSModules from 'react-css-modules';
// import styles from './login.less';
import { Row, Col } from 'react-bootstrap';
import LoginComponent from '../../components/authorization/Login.jsx';

// @CSSModules(styles)
export default class Login extends React.Component {

  render() {
    return (
      <Row>
        <Col md={6} mdOffset={3} xs={10} xsOffset={1}>
          <LoginComponent />
        </Col>
      </Row>
    );
  }
}
