import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers/reducers';
import App from './components/app/App';
import { fetchTasks } from './actions';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

store.dispatch(fetchTasks());

const root = document.getElementById('root');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  root
);
