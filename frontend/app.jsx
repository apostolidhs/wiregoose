import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Route, Router, IndexRoute, browserHistory, Redirect } from 'react-router';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import './less/index.less';

import Header from './components/header/header.jsx';
import Notifications from './components/notifications/notifications.jsx';
import * as Auth from './components/authorization/auth.js';
import * as WiregooseApi from './components/services/wiregoose-api.js';

import ComponentsGallery from './sections/components-gallery/components-gallery.jsx';
import Timeline from './sections/timeline/timeline.jsx';
import TimelineExplore from './sections/timeline/explore/explore.jsx';
import TimelineCategory from './sections/timeline/category/category.jsx';
import TimelineProvider from './sections/timeline/provider/provider.jsx';
import TimelineRegistration from './sections/timeline/registration/registration.jsx';
import Sidebar from './sections/timeline/sidebar/sidebar.jsx';
import Article from './sections/article/article.jsx';
import About from './sections/info/about.jsx';
import Credits from './sections/info/credits.jsx';
import Providers from './sections/info/providers.jsx';
import InternalServerError from './sections/errors/500.jsx';
import notFoundError from './sections/errors/401.jsx';

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
          <Route path="article/:id" component={Article} />
          <Route component={Timeline} >
            <IndexRoute component={TimelineExplore} />
            <Route path="category/:id" component={TimelineCategory} />
            <Route path="provider/:id" component={TimelineProvider} />
            <Route path="registration/:id" component={TimelineRegistration} />
          </Route>
          <Route path="info" >
            <Route path="about" component={About} />
            <Route path="credits" component={Credits} />
            <Route path="providers" component={Providers} />
          </Route>
          <Route path="500" component={InternalServerError} />
          <Route path="401" component={notFoundError} />
          <Route path="componentsGallery" component={ComponentsGallery} />
          <Route path='*' component={notFoundError} />
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
