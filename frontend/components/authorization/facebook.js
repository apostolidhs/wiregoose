import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

import tr from '../localization/localization.js';

export default class Facebook extends React.Component {
  static propTypes = {
    onFacebookAuth: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['SIGNIN', 'SIGNUP']).isRequired
  }

  render() {
    const {onFacebookAuth, className, type} = this.props;
    const cmpClassName = classnames(className, 'btn btn-primary btn-block');
    return (
      <a className={cmpClassName} onClick={onFacebookAuth} >
        <FontAwesome name="facebook-official" className="w-mr-7" />
        {type === 'SIGNIN' ? tr.loginViaFacebook : tr.signupViaFacebook}
      </a>
    );
  }
}
