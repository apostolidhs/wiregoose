import _ from 'lodash';
import React from 'react';
import NotificationSystem  from 'react-notification-system';

export const create = {
  success: createNotification('success'),
  warning: createNotification('warning'),
  error: createNotification('error'),
  info: createNotification('info')
}

const defaultOptions = {
  autoDismiss: 8000,
  position: 'tc'
};

let notificationSystem;

function createNotification(level) {
  return (message, opts = {}) => {
    const dopts = _.defaults({level, message}, opts, defaultOptions);
    if (!notificationSystem) {
      console.warn('notifications have not instantiated');
      return;
    }
    notificationSystem.addNotification(dopts);
  }
}

export default class Notifications extends React.Component {

  componentDidMount = () => {
    notificationSystem = this.refs.notificationSystem;
  }

  render() {
    return <NotificationSystem ref="notificationSystem" />;
  }
}
