import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Image, Panel } from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as Auth from '../../components/authorization/auth.js';
import BrowserLanguageDetection from '../../components/utilities/browser-language-detection.js';
import tr from '../../components/localization/localization.js';
import {getError} from '../../components/services/error-handler.js';
import {templates} from '../../components/notifications/notifications.jsx';
import Loader from '../../components/loader/loader.jsx';

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

        if (_.isEmpty(errors) && reason.status === 400) {
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
        {tr.or} <a href="#" onClick={e => {e.preventDefault(); onSigninClicked();}}>{tr.signInPrompt}</a>
        </span>
        <Panel className="w-mt-14">
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
