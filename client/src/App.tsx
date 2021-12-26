import React from 'react';
import './App.css';
import { AppRouter } from './router';
import { Login } from 'components/login';

function App() {
  return (
    <div className="App">
      <AppRouter />
      <Login />
    </div>
  );
}

export default App;
