import isEmpty from 'lodash/isEmpty';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import Image from 'react-bootstrap/lib/Image';
import Panel from 'react-bootstrap/lib/Panel';
import CSSModules from 'react-css-modules';

import FacebookLogin from './facebook';
import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as Auth from '../../components/authorization/auth.js';
import BrowserLanguageDetection from '../../components/utilities/browser-language-detection.js';
import tr from '../../components/localization/localization.js';
import {getError} from '../../components/services/error-handler.js';
import {templates} from '../../components/notifications/notifications.jsx';
import Loader from '../../components/loader/loader.jsx';
import {login as fbLogin} from '../services/facebook.js';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

import styles from './authorization.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Login extends React.Component {

  static propTypes = {
    onSigninClicked: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired
  }

  state = {
    errors: {}
  }

  onFacebookAuth = () => {
    this.refs.load.promise = fbLogin()
      .then(() => this.props.onLogin());
  }

  performSignup = (email, password) => {
    const lang = BrowserLanguageDetection();
    this.refs.load.promise = Auth.signup(email, password, lang)
      .then(() => {
        this.props.onSignup();
      })
      .catch(reason => {
        const errors = {};
        if (getError(reason, 4003)) {
          errors.email = tr.emailAlreadyExist;
        }

        if (isEmpty(errors) && reason.status === 400) {
          templates.unexpectedError();
        }

        this.setState({errors});
      });
  }

  render() {
    const {errors} = this.state;
    const {onSigninClicked} = this.props;
    return (
      <Loader ref="load" title={tr.signUp} styleName="credential-form" >
        <Image className="center-block" width="80" src={mongooseIcon} />
        <h1 className="text-center w-m-0">
          <small>{tr.signUp}</small>
        </h1>
        <span className="text-center center-block text-muted">
          {tr.or} <a href="#" title={tr.signInPrompt} onClick={e => {e.preventDefault(); onSigninClicked();}}>{tr.signInPrompt}</a>
        </span>
        <FacebookLogin className="w-mt-14" type="SIGNUP" onFacebookAuth={this.onFacebookAuth} />
        <div className="text-center text-muted w-mt-7">{tr.trFl('or')}</div>
        <Panel className="w-mt-7">
          <CredentialForm
            onCredentialSubmit={this.performSignup}
            submitTitle={tr.signUp}
            errors={errors}
          />
        </Panel>
      </Loader>
    );
  }
}
