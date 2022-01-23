import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { GlobalProvider } from 'common/store';
import { WebsocketProvider } from 'core/store';

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>
      <WebsocketProvider>
        <App />
      </WebsocketProvider>
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
