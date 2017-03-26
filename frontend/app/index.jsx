import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { Route, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import './less/index.less';
import App from './components/app/App.jsx';
import AppReducer from './reducers/index.js';
import ComponentsGallery
  from './sections/components-gallery/ComponentsGallery.jsx';
import Login
  from './sections/authorization/login.jsx';

const store = createStore(
  combineReducers({
    ...AppReducer,
    routing: routerReducer,
  }),
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={App}>
        <Route path="login" component={Login} />
        <Route path="componentsGallery" component={ComponentsGallery} />
        <Route path="/" component={ComponentsGallery} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
