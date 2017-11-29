import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

import Body from '../../components/body/body.jsx';
import { GOOGLE_TRACKING_ID, IS_DEV } from '../../../config-public.js';

import Timeline from '../timeline/timeline.jsx';
import TimelineExplore from '../timeline/explore/explore.jsx';
import TimelineCategory from '../timeline/category/category.jsx';
import TimelineProvider from '../timeline/provider/provider.jsx';
import TimelineRegistration from '../timeline/registration/registration.jsx';
import Sidebar from '../timeline/sidebar/sidebar.jsx';
import Article from '../article/article.jsx';
import About from '../info/about.jsx';
import Credits from '../info/credits.jsx';
import Providers from '../info/providers.jsx';
import Login from '../authorization/login.jsx';
import Signup from '../authorization/signup.jsx';
import Forgot from '../authorization/forgot.jsx';
import InternalServerError from '../errors/500.jsx';
import notFoundError from '../errors/401.jsx';

if (!IS_DEV) {
  ReactGA.initialize(GOOGLE_TRACKING_ID);
}

export default class AppRouter extends React.Component {

  logPageView = () => {
    if (!IS_DEV) {
      ReactGA.set({ page: window.location.pathname + window.location.search });
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  render() {
    return (
      <Router history={browserHistory} onUpdate={this.logPageView} >
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
          <Route path="auth" >
            <Route path="login" component={Login} />
            <Route path="signup" component={Signup} />
            <Route path="forgot" component={Forgot} />
          </Route>
          <Route path="500" component={InternalServerError} />
          <Route path="401" component={notFoundError} />
          <Route path='*' component={notFoundError} />
        </Route>
      </Router>
    );
  }
}
