import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { syncHistoryWithStore, routerReducer, routerMiddleware }
  from 'react-router-redux';
import './less/index.less';
import App from './components/app/App.jsx';
import * as Api from './actions/api.js';
import AppReducer from './reducers/index.js';

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

Api.setCredentialGetter(() => store.getState().session.auth.jwt);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <App store={store} history={history} />,
  document.getElementById('root'),
);
