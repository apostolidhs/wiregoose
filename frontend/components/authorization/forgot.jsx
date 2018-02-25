import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import Image from 'react-bootstrap/lib/Image';
import Panel from 'react-bootstrap/lib/Panel';
import CSSModules from 'react-css-modules';
import FontAwesome from 'react-fontawesome';

import CredentialForm from '../../components/authorization/credential-form.jsx';
import * as WiregooseApi from '../../components/services/wiregoose-api.js';
import {getError} from '../../components/services/error-handler.js';
import {templates} from '../../components/notifications/notifications.jsx';
import Loader from '../../components/loader/loader.jsx';
import tr from '../../components/localization/localization.js';

import mongooseIcon from '../../assets/img/logo-170-nologo.png';

import styles from './authorization.less';

@CSSModules(styles, {
  allowMultiple: true,
})
export default class Forgot extends React.Component {

  static propTypes = {
    onSigninClicked: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired
  }

  state = {}

  performPasswordRecover = (email) => {
    this.refs.load.promise = WiregooseApi.resetPassword(email)
      .then(() => this.setState({submitted: true, email}))
      .then(() => {
        this.props.onFinish();
      });
  }

  render() {
    const {onSigninClicked} = this.props;
    const {submitted, email} = this.state;
    return (
      <Loader ref="load" title={tr.resetPasswordCta} styleName="credential-form" >
        <Image className="center-block" width="80" src={mongooseIcon} />
        <h1 className="text-center w-m-0">
          <small>{tr.forgotPasswordPrompt}</small>
        </h1>
        <p className="text-center text-muted">
          {tr.forgotPasswordInfo.map((t, idx) => <span key={idx}>{t}<br/></span>)}
        </p>
        <Panel className="w-mt-14">
          {!submitted &&
            <CredentialForm
              onCredentialSubmit={this.performPasswordRecover}
              submitTitle={tr.resetPasswordCta}
              onlyEmail
            />
          }

          {submitted &&
            <div>
              <h1 className="text-center" >
                <FontAwesome name="check" className="text-success" />
              </h1>
              <p dangerouslySetInnerHTML={{
                  __html: tr.formatString(tr.resetPasswordSuccess, email).join('')
                }}
              />
            </div>
          }

          <a href="#" title={tr.backToLogin} onClick={e => {e.preventDefault(); onSigninClicked();}}>
            <small>{tr.backToLogin}</small>
          </a>
        </Panel>
      </Loader>
    );
  }
}


