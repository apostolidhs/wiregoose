import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Forgot from './forgot.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';

import { attachModal, detachModal } from '../modals/modals.jsx';

export default class AuthModal extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['LOGIN', 'SIGNUP', 'FORGOT']),
    prompt: PropTypes.any
  }

  static defaultProps = {
    type: 'LOGIN'
  }

  state = {
    type: this.props.type
  }

  openSignup = () => {
    this.setState({ type: 'SIGNUP' });
  }

  openSignin = () => {
    this.setState({ type: 'LOGIN' });
  }

  openForgot = () => {
    this.setState({ type: 'FORGOT' });
  }

  onSubmitionFinish = () => {
    detachModal();
  }

  render() {
    const {prompt} = this.props;
    const {type} = this.state;

    return (
      <Modal.Body>
        {prompt}
        {(() => {
          if (type === 'FORGOT') {
            return <Forgot onSigninClicked={this.openSignin} onFinish={this.onSubmitionFinish} />;
          } else if (type === 'SIGNUP') {
            return <Signup onSigninClicked={this.openSignin} onSignup={this.onSubmitionFinish} />;
          } else {
            return <Login onSignupClicked={this.openSignup} onForgotClicked={this.openForgot} onLogin={this.onSubmitionFinish} />;
          }
        })()}
      </Modal.Body>
    );
  }
}

export function launch({type, prompt}) {
  return attachModal(<AuthModal type={type} prompt={prompt} />, {closable: true});
}
