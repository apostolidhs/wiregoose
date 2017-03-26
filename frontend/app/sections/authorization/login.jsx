import React from 'react';
// import CSSModules from 'react-css-modules';
// import styles from './login.less';
import LoginComponent from '../../components/authorization/Login.jsx';

// @CSSModules(styles)
export default class Login extends React.Component {

  render() {
    return (
      <div className="w-m">
        <LoginComponent />
      </div>
    );
  }
}
