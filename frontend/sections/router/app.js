import React from 'react';
import { Route, Router, IndexRoute, browserHistory, Redirect } from 'react-router';
import ReactGA from 'react-ga';

import Body from '../../components/body/body.js';
import * as Notifications from '../../components/notifications/notifications.js';
import tr from '../../components/localization/localization.js';
import * as Auth from '../../components/authorization/auth.js';
import {publish, EventHOC} from '../../components/events/events.js';
import { GOOGLE_TRACKING_ID, IS_DEV, APP_URL } from '../../../config-public.js';

import Timeline from '../timeline/timeline.js';
import TimelineExplore from '../timeline/explore/explore.js';
import TimelineUser from '../timeline/explore/user.js';
import TimelineCategory from '../timeline/category/category.js';
import TimelineProvider from '../timeline/provider/provider.js';
import TimelineRegistration from '../timeline/registration/registration.js';
import TimelineBookmarks from '../timeline/bookmarks/bookmarks.js';
import Article from '../article/article.js';
import About from '../info/about.js';
import Credits from '../info/credits.js';
import Providers from '../info/providers.js';
import Profile from '../user/profile.js';
import Interests from '../user/interests.js';
import Login from '../authorization/login.js';
import Signup from '../authorization/signup.js';
import Forgot from '../authorization/forgot.js';
import InternalServerError from '../errors/500.js';
import NotFoundError from '../errors/401.js';

if (!IS_DEV) {
  ReactGA.initialize(GOOGLE_TRACKING_ID);
}

class AppRouter extends React.Component {

  onPageChange = () => {
    if (!IS_DEV) {
      ReactGA.set({ page: window.location.pathname + window.location.search });
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    const {query} = browserHistory.getCurrentLocation();
    if (query.validated) {
      Notifications.create.success(tr.validateUserAccountSuccess);
      Auth.validateUserEmail();
      publish('credentials', {type: 'VALIDATE_USER_EMAIL'});
    }
  }

  renderRedirectIfAuthorizedRoute(path, component, isAuthorized = true) {
    function onEnter(nextState, replaceState) {
      const isAuthenticated = Auth.isAuthenticated();
      if (isAuthorized && isAuthenticated || !isAuthorized && !isAuthenticated) {
        replaceState({
          pathname: '/',
          state: { nextPathname: nextState.location.pathname }
        })
      }
    }

    return <Route path={path} onEnter={onEnter} component={component} />;
  }

  render() {
    const isAuthenticated = Auth.isAuthenticated();
    return (
      <Router history={browserHistory} onUpdate={this.onPageChange} >
        <Route path="/" component={Body}>
          <Route path="admin" >
            <Route path="*" component={() => window.location = `${APP_URL}/admin.html`} />
          </Route>
          <Route path="article/:id" component={Article} />
          <Route component={Timeline} >
            <IndexRoute component={() =>
              Auth.isAuthenticated()
              ? <TimelineUser />
              : <TimelineExplore />
            } />
            <Route path="explore" component={TimelineExplore} />
            <Route path="category/:id" component={TimelineCategory} />
            <Route path="provider/:id" component={TimelineProvider} />
            <Route path="registration/:id" component={TimelineRegistration} />
            {this.renderRedirectIfAuthorizedRoute('bookmarks', TimelineBookmarks, false)}
          </Route>
          <Route path="info" >
            <Route path="about" component={About} />
            <Route path="credits" component={Credits} />
            <Route path="providers" component={Providers} />
          </Route>
          <Route path="auth" >
            {this.renderRedirectIfAuthorizedRoute('login', Login)}
            {this.renderRedirectIfAuthorizedRoute('signup', Signup)}
            {this.renderRedirectIfAuthorizedRoute('forgot', Forgot)}
          </Route>
          {this.renderRedirectIfAuthorizedRoute('profile', Profile, false)}
          {this.renderRedirectIfAuthorizedRoute('interests', Interests, false)}
          <Route path="500" component={InternalServerError} />
          <Route path="401" component={NotFoundError} />
          <Route path='*' component={NotFoundError} />
        </Route>
      </Router>
    );
  }
}

export default AppRouter;
