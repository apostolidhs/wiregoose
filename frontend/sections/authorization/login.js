import React from 'react';
import { browserHistory } from 'react-router';

import LoginComponent from '../../components/authorization/login.js';

export default class Login extends React.Component {
  render() {
    return (
      <LoginComponent
        onSignupClicked={() => browserHistory.replace('/auth/signup')}
        onForgotClicked={() => browserHistory.replace('/auth/forgot')}
        onLogin={() => browserHistory.replace('/')}
      />
    );
  }
}
