import React from 'react';
import ReactDOM from 'react-dom';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import './less/index.less';

import 'core-js/shim';
import Localization from './components/localization/localization.js';
import BrowserLanguageDetection from './components/utilities/browser-language-detection.js';
import * as Auth from './components/authorization/auth.js';
import * as WiregooseApi from './components/services/wiregoose-api.js';
import * as Meta from './components/meta/meta.js';
import { subscribe } from './components/events/events.jsx';

import AppRouter from './sections/router/app.jsx';

if (Auth.isAuthenticated()) {
  WiregooseApi.setCredentialGetter(() => Auth.getSession().token);
}

const lang = BrowserLanguageDetection();
Localization.setLanguage(lang);

subscribe('page-ready', (options) => {
  // @TODO: if same page ignore
  Meta.setOptions(options);
  if (typeof window.callPhantom === 'function') {
    window.callPhantom({
      command: 'page-ready',
      message:  options
    });

  }
});

ReactDOM.render(<AppRouter />, document.getElementById('root'));
