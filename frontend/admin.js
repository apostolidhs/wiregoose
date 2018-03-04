import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Route, Router, IndexRoute, browserHistory, IndexRedirect, Redirect } from 'react-router';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import './less/index.less';
import Header from './components/header/header.js';
import Notifications from './components/notifications/notifications.js';
import * as Auth from './components/authorization/auth.js';
import * as WiregooseApi from './components/services/wiregoose-api.js';
import ComponentsGallery from './sections/components-gallery/components-gallery.js';
import Login from './sections/authorization/login.js';
import Admin from './sections/admin/admin.js';
import RssProvider from './sections/admin/rss-provider/rss-provider.js';
import RssRegistration from './sections/admin/rss-registration/rss-registration.js';
import FetchReport from './sections/admin/fetch-report/fetch-report.js';
import ArticleEntries from './sections/admin/article-entries/article-entries.js';
import Dashboard from './sections/admin/dashboard/dashboard.js';
import Article from './sections/admin/article/article.js';
import PreRender from './sections/admin/pre-render/pre-render.js';
import Proxy from './sections/admin/proxy/proxy.js';
import User from './sections/admin/user/user.js';

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
        <Header />
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
        <Route path="/admin" component={Body}>
          <IndexRedirect to="dashboard" />
          <Route path="auth" >
            <Route path="login" component={Login} />
          </Route>
          <Route component={Admin}>
            <Route path="componentsGallery" component={ComponentsGallery}/>
            <Route path="dashboard" component={Dashboard} />
            <Route path="rssprovider" component={RssProvider} />
            <Route path="rssregistration" component={RssRegistration} />
            <Route path="fetchreport" component={FetchReport} />
            <Route path="articleentries" component={ArticleEntries} />
            <Route path="article" component={Article} />
            <Route path="prerender" component={PreRender} />
            <Route path="proxy" component={Proxy} />
            <Route path="user" component={User} />
          </Route>
        </Route>
        <Route path="*">
          <IndexRedirect to="/admin" />
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
