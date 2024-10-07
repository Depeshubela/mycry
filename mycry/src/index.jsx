import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <App />
);

reportWebVitals();
