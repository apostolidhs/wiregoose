import React from 'react';
import { browserHistory } from 'react-router';

import SignupComponent from '../../components/authorization/signup.jsx';

export default class Signup extends React.Component {
  render() {
    return (
      <SignupComponent
        onSigninClicked={() => browserHistory.replace('/auth/login')}
        onSignup={() => browserHistory.replace('/')}
      />
    );
  }
}
