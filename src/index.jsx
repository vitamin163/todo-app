import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import reducers from './store/reducers/reducers';
import App from './components/App/App';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
const root = document.getElementById('root');

render(<Provider store={store}>{app}</Provider>, root);
