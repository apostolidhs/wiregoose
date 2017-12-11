import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Image, Panel } from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import CredentialForm from '../authorization/credential-form.jsx';
import * as Auth from '../authorization/auth.js';
import tr from '../localization/localization.js';
import {getError} from '../services/error-handler.js';
import {templates} from '../notifications/notifications.jsx';
import Loader from '../loader/loader.jsx';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

import styles from './authorization.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Login extends React.Component {

  static propTypes = {
    onSignupClicked: PropTypes.func.isRequired,
    onForgotClicked: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired
  }

  state = {
    errors: {}
  }

  performLogin = (email, password) => {
    this.refs.load.promise = Auth.login(email, password)
      .then(() => {
        this.props.onLogin();
      })
      .catch(reason => {
        const errors = {};
        if (getError(reason, 4001)) {
          errors.invalidCredentials = tr.invalidCredentials;
        }

        if (_.isEmpty(errors) && reason.status === 400) {
          templates.unexpectedError();
        }

        this.setState({errors});
      });
  }

  render() {
    const {errors} = this.state;
    const {onSignupClicked, onForgotClicked} = this.props;
    return (
      <Loader ref="load" title={tr.signIn} styleName="credential-form" >
        <Image className="center-block" width="80" src={mongooseIcon} />
        <h1 className="text-center w-m-0">
          <small>{tr.signIn}</small>
        </h1>
        <span className="text-center center-block text-muted">
        {tr.or} <a href="#" onClick={onSignupClicked}>{tr.createAccountPrompt}</a>
        </span>
        <Panel className="w-mt-14">
          {errors.invalidCredentials &&
            <p className={'text-danger'}>{errors.invalidCredentials}</p>
          }
          <CredentialForm onCredentialSubmit={this.performLogin} submitTitle={tr.signIn} />
          <a href="#" onClick={onForgotClicked}>
            <small>{tr.forgotPasswordPrompt}</small>
          </a>
        </Panel>
      </Loader>
    );
  }
}
