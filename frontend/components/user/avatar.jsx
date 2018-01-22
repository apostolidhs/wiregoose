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

  isUserEmailVerified() {
    return Auth.isAuthenticated() && Auth.isEmailValid();
  }

  renderAvatar(isEmailValid) {
    const {avatarClass} = this.state;
    const className = classnames(
      'avatar',
      `avatar-${avatarClass}`,
      {'avatar-invalid': !isEmailValid}
    );

    return (
      <FontAwesome
        styleName={className}
        name="user-circle"
      />
    );
  }

  render() {
    if (this.isUserEmailVerified()) {
      return this.renderAvatar(true);
    }

    return (
      <OverlayTrigger placement="bottom" overlay={
        <Tooltip id="validate-user-account">{tr.validateUserAccount}</Tooltip>
      }>
        {this.renderAvatar(false)}
      </OverlayTrigger>
    );
  }
}

export default Events.EventHOC(Avatar, ['credentials']);
