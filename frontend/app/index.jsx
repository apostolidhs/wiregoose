import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Route, Router, browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { syncHistoryWithStore, routerReducer, routerMiddleware }
  from 'react-router-redux';
import './less/index.less';
import App from './components/app/App.jsx';
import AppReducer from './reducers/index.js';
import ComponentsGallery
  from './sections/components-gallery/ComponentsGallery.jsx';
import Login
  from './sections/authorization/Login.jsx';

const loggerMiddleware = createLogger({
  // diff: true,
});

let initialState;
const serializedInitialState = localStorage.getItem('state');
if (serializedInitialState) {
  initialState = JSON.parse(serializedInitialState);
}

const store = createStore(
  combineReducers({
    ...AppReducer,
    routing: routerReducer,
  }),
  initialState,
  applyMiddleware(
    loggerMiddleware,
    routerMiddleware(browserHistory),
    thunkMiddleware,
  ),
);

store.subscribe(() => {
  const state = store.getState();
  const serializedState = JSON.stringify(state);
  localStorage.setItem('state', serializedState);
});

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
