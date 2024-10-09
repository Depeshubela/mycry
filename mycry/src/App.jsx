import React, { useState,useEffect }  from "react";
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import ROUTES from "./router/router"
import PrivateRoute from "./router/PrivateRoute";
import FoxHeader from './components/foxHeader'
import BackHeader from './components/backHeader'
import FoxMainPage from "./metamask/mainPage"
import FoxStakePage from "./metamask/stakePage"
import BackMainPage from "./backend/mainPage"
import BackStakePage from "./backend/stakePage"
import BackLogin from "./backend/login"
import BackRegister from "./backend/register"
import BackRegisterConfirm from "./backend/registerConfirm"
import  {MyMetaMaskProvider} from "./metamask/MetaMaskContext";
import { MetaMaskProvider } from "@metamask/sdk-react";
import  {APIContextProvider} from "./backend/APIContext";
import { IntlProvider } from "react-intl";
import {AuthProvider} from "./components/auth/authContext";
import Page404 from "./errorPage/404";
import Copyright from "./components/copyright";
import CopyrightHeader from "./components/copyrightHeader";

const FoxRoutes = ({ setHeaderHeight, setLocale }) => {
  return (
    <MetaMaskProvider
      debug={true}
      sdkOptions={{
          dappMetadata: {
          name: "MyCry Dapp",
          url: window.location.protocol + '//' + window.location.host,
          },
          infuraAPIKey: "02c5f02b1ca74885874d8bb3455e99c1",
          
          // checkInstallationImmediately:true //啟用則在進入頁面時未安裝小狐狸會跳出提示讓安裝
    }}
    >
      <MyMetaMaskProvider>
          <Routes>
              <Route path='main' element={<><FoxHeader showHeader={true} setHeaderHeight={setHeaderHeight} setLocale={setLocale}/><FoxMainPage/></>} />
              <Route path='stake' element={<><FoxHeader showHeader={true} setHeaderHeight={setHeaderHeight} setLocale={setLocale}/><FoxStakePage/></>} />
              <Route path='*' element={<Page404 />} />
          </Routes>
      </MyMetaMaskProvider>
    </MetaMaskProvider>
  );
};

const BackRoutes = ({ setHeaderHeight, setLocale }) => {
  return (
    <AuthProvider>
      <APIContextProvider>
        <Routes>
            <Route path='login' element={<><BackLogin/></>} />
            <Route path='stake' element={<PrivateRoute><BackHeader showHeader={true} setHeaderHeight={setHeaderHeight} setLocale={setLocale}/><BackStakePage/></PrivateRoute>} />
            <Route path='main' element={<PrivateRoute><BackHeader showHeader={true} setHeaderHeight={setHeaderHeight} setLocale={setLocale}/><BackMainPage/></PrivateRoute>} />
            <Route path='register' element={<><BackRegister/></>} />
            <Route path='registerConfirm' element={<><BackRegisterConfirm/></>} />
            <Route path='*' element={<Page404 />} />
        </Routes>
      </APIContextProvider>
    </AuthProvider>
  );
};

const App = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [locale, setLocale] = useState('zh-TW')
  return (
      <IntlProvider messages={locale} locale={'zh-TW'} defaultLocale={'zh-TW'}>
        <Router>
          <Routes>
            <Route path="/mcc/metamask/*" element={<FoxRoutes setHeaderHeight={setHeaderHeight} setLocale={setLocale} />} />
            <Route path="/mcc/backend/*" element={<BackRoutes setHeaderHeight={setHeaderHeight} setLocale={setLocale}/>} />
            <Route path={ROUTES.MCC_COPYRIGHT} element={<><CopyrightHeader showHeader={true} setHeaderHeight={setHeaderHeight} setLocale={setLocale}/><Copyright/></>} />
            <Route path='*' element={<Page404 />} />
          </Routes>
        </Router>  
      </IntlProvider>
  );
};

export default App;