import React from 'react';
import { browserHistory } from 'react-router';

import ForgotComponent from '../../components/authorization/forgot.js';

export default class Forgot extends React.Component {
  render() {
    return (
      <ForgotComponent
        onSigninClicked={() => browserHistory.replace('/auth/login')}
        onFinish={() => {}}
      />
    );
  }
}
