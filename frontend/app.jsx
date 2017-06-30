import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';

import './less/index.less';
import Header from './components/header/header.jsx';
import * as Auth from './components/authorization/auth.js';
import ComponentsGallery from './sections/components-gallery/components-gallery.jsx';
import Login from './sections/authorization/login.jsx'
import Admin from './sections/admin/admin.jsx'
import RssProvider from './sections/admin/rss-provider/rss-provider.jsx'

class Body extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div>
        <Header />
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
          <Route path="login" component={Login} />
          <Route path="componentsGallery" component={ComponentsGallery}/>
          {
            Auth.isAuthenticated() &&
            <Route path="admin" component={Admin}>
              <IndexRoute component={RssProvider} />
              <Route path="rssprovider" component={RssProvider} />
            </Route>
          }
          <Route path='*' component={NotFound} />
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
