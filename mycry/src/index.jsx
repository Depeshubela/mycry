import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { MetaMaskProvider } from "@metamask/sdk-react";

window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    // <MetaMaskProvider
    //     debug={true}
    //     sdkOptions={{
    //         dappMetadata: {
    //         name: "Example React Dapp",
    //         url: window.location.protocol + '//' + window.location.host,
    //         },
    //         infuraAPIKey: "02c5f02b1ca74885874d8bb3455e99c1",

    //     }}
    //     >
      <App />
    // </MetaMaskProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
