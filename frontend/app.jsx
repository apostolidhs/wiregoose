import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import './less/index.less';
import Header from './components/header/header.jsx';
import Notifications from './components/notifications/notifications.jsx';
import * as Auth from './components/authorization/auth.js';
import * as WiregooseApi from './components/services/wiregoose-api.js';
import ComponentsGallery from './sections/components-gallery/components-gallery.jsx';

if (Auth.isAuthenticated()) {
  WiregooseApi.setCredentialGetter(() => Auth.getSession().token);
}

class Body extends React.Component {

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

const NotFound = () => (
  <h1>404.. This page is not found!</h1>);

// function requireAuth(nextState, replaceState) {
//   if (!Auth.isAuthenticated()) {
//     replaceState({
//       pathname: '/login',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }

class App extends React.Component {
  render () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Body}>
          <IndexRoute component={ComponentsGallery} />
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
