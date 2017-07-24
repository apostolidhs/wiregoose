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
import Login from './sections/authorization/login.jsx';
import Admin from './sections/admin/admin.jsx';
import RssProvider from './sections/admin/rss-provider/rss-provider.jsx';
import RssRegistration from './sections/admin/rss-registration/rss-registration.jsx';
import FetchReport from './sections/admin/fetch-report/fetch-report.jsx';
import ArticleEntries from './sections/admin/article-entries/article-entries.jsx';
import Dashboard from './sections/admin/dashboard/dashboard.jsx';
import Article from './sections/admin/article/article.jsx';

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
        <Route path="/" component={Body}>
          <IndexRoute component={ComponentsGallery} />
          <Route path="login" component={Login} />
          <Route path="componentsGallery" component={ComponentsGallery}/>
          {
            Auth.isAuthenticated() &&
            <Route path="admin" component={Admin}>
              <IndexRoute component={Dashboard} />
              <Route path="dashboard" component={Dashboard} />
              <Route path="rssprovider" component={RssProvider} />
              <Route path="rssregistration" component={RssRegistration} />
              <Route path="fetchreport" component={FetchReport} />
              <Route path="articleentries" component={ArticleEntries} />
              <Route path="article" component={Article} />
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
