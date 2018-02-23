import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import isObject from 'lodash/isObject';
import { browserHistory } from 'react-router';

import tr from '../localization/localization.js';
import * as Auth from '../authorization/auth.js';
import * as Notifications from '../notifications/notifications.jsx';
import {isAdmin} from '../utilities/environment-detection.js';

export default function ServerErrorsInterceptor (error, handler) {
  const response = get(error, 'response', {});
  const status = (response && response.status) || -1;

  // authentication error
  if (status === 401) {
    const pathname = isAdmin() ? '/admin/auth/login' : '/auth/login';
    if (location.pathname !== pathname) {
      Auth.logout();
      browserHistory.push({pathname});
    }
    // rest authentication errors
  } else if (status >= 400 && status < 500) {
    if (handler) {
      Notifications.create.warning(tr.promptServerError400, {
        title: tr.promptServerError400Title
      });
    } else {
      const msg = upperFirst(response.data.error)
        || getStatusError(response);
      Notifications.create.warning(msg);
    }
    // server errors
  } else if (status >= 500) {
    if (handler) {
      browserHistory.push({ pathname: '/500' });
    } else {
      const msg = getStatusError(response);
      Notifications.create.warning(msg);
    }

    // requests that cannot be sent
  } else if (status === -1) {
    if (handler && isObject(handler) && handler.onOffline) {
      return handler.onOffline();
    } else {
      Notifications.create.warning(tr.promptServerErrorNotConnected, {
        title: tr.promptServerErrorNotConnectedTitle
      });
    }
  }
}

// we assume that in the worst error case, the response.status
// and the response.statusText will exist
function getStatusError({status, statusText}) {
  return `Server responded with status code ${status}, ${statusText}`;
}
