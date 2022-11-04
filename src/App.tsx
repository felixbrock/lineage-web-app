import { ReactElement, useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import './App.scss';
import Lineage from './pages/lineage/lineage';
import Test from './pages/test/test';
import { authEnvConfig, oAuthEnvConfig } from './config';
import GithubRedirect from './pages/github-redirect';
import SlackRedirect from './pages/slack-redirect';
import Layout from './pages/layout';
import { LeftPanelContextProvider, RightPanelContextProvider } from './components/panelContext';

export default (): ReactElement => {
  Auth.configure({
    Auth: {
      region: 'eu-central-1',
      mandatorySignIn: true,
      // cookieStorage: {
      //   domain: 'app.hivedive.io',
      //   path: '/',
      //   expires: 365,
      //   secure: true,
      // },
      ...authEnvConfig,
    },
    oauth: {
      scope: ['email', 'openid'],
      responseType: 'code',
      ...oAuthEnvConfig,
    },
  });

  const [user, setUser] = useState();

  const [app, setApp] = useState<ReactElement>(<div />);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => {
        if (!user) setUser(cognitoUser);
      })
      .catch((error) => {
        console.log(error);

        setUser(undefined);

        return Auth.federatedSignIn();
      })
      .then(() => console.log('authenticated'));
  }, []);

  useEffect(() => {
    if (!user) return;

    setApp(
      <div className="App">
        <div id="app">
          <LeftPanelContextProvider>
          <RightPanelContextProvider>
          <Router>
            <div id="ContentContainer">
              <Routes>
                <Route path="/lineage" element={<Lineage />} />
                <Route path="/layout" element={<Layout />} />
                <Route path="/test" element={<Test />} />
                {/* in development copy query params and manually call Github redirect: https://smee.io/XeUBYbnaoGxxxcf */}
                <Route path="/oauth/github/:code/:installationId/:state" element={<GithubRedirect/>}/>
                <Route path="/oauth/slack/:code/:state" element={<SlackRedirect/>}/>
                <Route path="/" element={<Navigate to="/lineage" />} />
              </Routes>
            </div>
          </Router>
          </RightPanelContextProvider>
          </LeftPanelContextProvider>
        </div>
      </div>
    );
  }, [user]);

  return app;
};
