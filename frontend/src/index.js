import React from 'react';
import { render } from 'react-dom';
import { PersistGate } from 'redux-persist/es/integration/react';

import App from './App';
import configureStore from './store';

const { store, persistor } = configureStore();

const root = document.getElementById('app');

const renderApp = () => (
  <PersistGate persistor={persistor}>
    <App store={store} />
  </PersistGate>
);

render(renderApp(), root);

if (module.hot) {
  module.hot.accept('./App', () => {
    render(renderApp(), root);
  });
}
