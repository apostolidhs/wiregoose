import React from 'react';
import { Route, Router, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import Header from '../header/Header.jsx';
import ComponentsGallery
  from './sections/components-gallery/ComponentsGallery.jsx';
import Login
  from './sections/authorization/Login.jsx';
import Admin
  from './sections/admin/Admin.jsx';
import RssProvider
  from './sections/admin/rss-provider/RssProvider.jsx';
import * as Session from './actions/session.js';

class Body extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
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

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} component={Component}>
      {
        (() => {
          //if (Session.) {

          //} else {
            return this.props.children;
          //}
        })()
      }
    </Route>
  );
}

export default class App extends React.Component {

  static propTypes = {
    store: React.PropTypes.object,
    history: React.PropTypes.object
  }

  render() {
    const {
      store,
      history,
    } = this.props;

    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Body}>
            <IndexRoute component={ComponentsGallery} />
            <Route path="login" component={Login} />
            <Route path="componentsGallery" component={ComponentsGallery} />
            <PrivateRoute path="admin" component={Admin}>
              <IndexRoute component={RssProvider} />
              <Route path="rssprovider" component={RssProvider} />
            </PrivateRoute>
          </Route>
        </Router>
      </Provider>
    );
  }
}
