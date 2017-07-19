import _ from 'lodash';
import { browserHistory } from 'react-router';

import * as Auth from '../authorization/auth.js';
import * as Notifications from '../notifications/notifications.jsx';

export default function ServerErrorsInterceptor (error) {
  const response = _.get(error, 'response', {});
  const status = response && response.status;

  // authentication error
  if (status === 401) {
    Auth.destroySession();
    //this.$state.go('auth.login');
    browserHistory.push({ pathname: '/login' });

    // rest authentication errors
  } else if (status >= 400 && status < 500) {
    const msg = _.upperFirst(response.data.error)
      || getStatusError(response);
    Notifications.create.warning(msg);

    // server errors
  } else if (status >= 500) {
    const msg = this.getStatusError(response);
    Notifications.create.warning(msg);

    // requests that cannot be sent
  } else if (status === -1) {
    Notifications.create.warning('Check your internet connectivity and try again', {
      title: 'Request did not send'
    });
  }
}

// we assume that in the worst error case, the response.status
// and the response.statusText will exist
function getStatusError({status, statusText}) {
  return `Server responded with status code <b>${status}</b> <p>${statusText}</p>`;
}
