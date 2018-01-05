import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import CSSModules from 'react-css-modules';
import classnames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import tr from '../localization/localization.js';
import * as Events from '../events/events.jsx';
import * as Auth from '../authorization/auth.js';

import styles from './user.less';

@CSSModules(styles, {
  allowMultiple: true,
})
class Avatar extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['HEADER', 'HEADER_DROPDOWN', 'PROFILE']),
    isUser: PropTypes.bool
  }

  static defaultProps = {
    type: 'HEADER_DROPDOWN',
    isUser: false
  }

  componentWillMount() {
    this.updateAvatarClass();
    this.hasUserVerifyAccount();
  }

  componentWillReceiveProps() {
    this.hasUserVerifyAccount();
  }

  updateAvatarClass() {
    switch(this.props.type) {
      case 'HEADER':
        return this.setState({avatarClass: 'header'});

      case 'HEADER_DROPDOWN':
        return this.setState({avatarClass: 'header-dropdown'});

      case 'PROFILE':
      default:
        this.setState({avatarClass: 'profile'});
    }
  }

  hasUserVerifyAccount() {
    if (Auth.isAuthenticated() && !Auth.isEmailValid()) {
      this.setState({isEmailInvalid: true});
    }
  }

  renderAvatar() {
    const {avatarClass, isEmailInvalid} = this.state;
    const className = classnames(
      'avatar',
      `avatar-${avatarClass}`,
      {'avatar-invalid': isEmailInvalid}
    );

    return (
      <FontAwesome
        styleName={className}
        name="user-circle"
      />
    );
  }

  render() {
    const {isEmailInvalid} = this.state;
    if (!isEmailInvalid) {
      return this.renderAvatar();
    }

    return (
      <OverlayTrigger placement="bottom" overlay={
        <Tooltip id="validate-user-account">{tr.validateUserAccount}</Tooltip>
      }>
        {this.renderAvatar()}
      </OverlayTrigger>
    );
  }
}

export default Events.EventHOC(Avatar, ['credentials']);
