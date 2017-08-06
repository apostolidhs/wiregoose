import React from 'react';
import ReactDOM from 'react-dom';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import './less/index.less';

import 'core-js/shim';
import Localization from './components/localization/localization.js';
import * as Auth from './components/authorization/auth.js';
import * as WiregooseApi from './components/services/wiregoose-api.js';
import * as Meta from './components/meta/meta.js';
import { subscribe } from './components/events/events.js';

import AppRouter from './sections/router/app.jsx';

if (Auth.isAuthenticated()) {
  WiregooseApi.setCredentialGetter(() => Auth.getSession().token);
}

Localization.setLanguage(Auth.getSessionLang());

subscribe('page-ready', (options) => {
  // @TODO: if same page ignore
  Meta.setOptions(options);
  if (typeof window.callPhantom === 'function') {
    window.callPhantom({
      id: 'page-ready',
      options: opts
    });
  }
});

// function requireAuth(nextState, replaceState) {
//   if (!Auth.isAuthenticated()) {
//     replaceState({
//       pathname: '/login',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }

ReactDOM.render(<AppRouter />, document.getElementById('root'));

// if (typeof ISOMORPHIC_WEBPACK === 'undefined') {
//   ReactDOM.render(<AppRouter />, document.getElementById('app'));
// }

// export default AppRouter;
