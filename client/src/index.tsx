import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { GlobalProvider } from 'common/store'
import { registryWebSocket } from 'core';
registryWebSocket()

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider><App /></GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
