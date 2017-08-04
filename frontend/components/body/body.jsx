import React from 'react';
import PropTypes from 'prop-types';

import Header from '../header/header.jsx';
import Notifications from '../notifications/notifications.jsx';

export default class Body extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div>
        <Header enableAuth={false} />
        <Notifications />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
