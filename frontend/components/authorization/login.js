import isEmpty from 'lodash/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import Panel from 'react-bootstrap/lib/Panel';
import Image from 'react-bootstrap/lib/Image';
import CSSModules from 'react-css-modules';

import FacebookLogin from './facebook';
import CredentialForm from '../authorization/credential-form.js';
import * as Auth from '../authorization/auth.js';
import tr from '../localization/localization.js';
import {getError} from '../services/error-handler.js';
import {templates} from '../notifications/notifications.js';
import Loader from '../loader/loader.js';
import {login as fbLogin} from '../services/facebook.js';

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

  onFacebookAuth = () => {
    this.refs.load.promise = fbLogin()
      .then(() => this.props.onLogin());
  }

  performLogin = (email, password) => {
    this.refs.load.promise = Auth.login(email, password)
      .then(() => this.props.onLogin())
      .catch(reason => {
        const errors = {};
        if (getError(reason, 4001)) {
          errors.invalidCredentials = tr.invalidCredentials;
        }

        if (isEmpty(errors) && reason.status === 400) {
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
        {tr.or} <a href="#" title={tr.createAccountPrompt} onClick={e => {e.preventDefault(); onSignupClicked()}}>{tr.createAccountPrompt}</a>
        </span>
        <FacebookLogin className="w-mt-14" type="SIGNIN" onFacebookAuth={this.onFacebookAuth} />
        <div className="text-center text-muted w-mt-7">{tr.trFl('or')}</div>
        <Panel className="w-mt-7">
          {errors.invalidCredentials &&
            <p className={'text-danger'}>{errors.invalidCredentials}</p>
          }
          <CredentialForm
            onCredentialSubmit={this.performLogin}
            submitTitle={tr.signIn}
          />
          <a href="#" title={tr.forgotPasswordPrompt} onClick={e => {e.preventDefault(); onForgotClicked();}}>
            <small>{tr.forgotPasswordPrompt}</small>
          </a>
        </Panel>
      </Loader>
    );
  }
}
