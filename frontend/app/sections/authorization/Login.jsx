import React from 'react';
import { connect } from 'react-redux';
// import CSSModules from 'react-css-modules';
// import styles from './login.less';
import { Row, Col } from 'react-bootstrap';
import { push } from 'react-router-redux';
import LoginComponent from '../../components/authorization/Login.jsx';
import Actions from '../../actions/index.js';

function mapDispatchToProps(dispatch) {
  return {
    performLogin: (email, password) =>
      dispatch(Actions(email, password))
        .then((state) => {
          switch (state.type) {
            case 'SESSION_LOGIN_SUCCESS':
              return dispatch(push(''));
            default:
              return state;
          }
        }),
  };
}

// @CSSModules(styles)
@connect(undefined, mapDispatchToProps)
export default class Login extends React.Component {

  static propTypes = {
    performLogin: React.PropTypes.func.isRequired,
  }

  render() {
    const { performLogin } = this.props;
    return (
      <Row>
        <Col md={6} mdOffset={3} xs={10} xsOffset={1}>
          <LoginComponent onLoginClicked={performLogin} />
        </Col>
      </Row>
    );
  }
}
