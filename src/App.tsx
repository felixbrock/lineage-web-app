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
          <Router>
            <div id="ContentContainer">
              <Routes>
                <Route path="/lineage" element={<Lineage />} />
                <Route path="/test" element={<Test />} />
                <Route path="/" element={<Navigate to="/lineage" />} />
              </Routes>
            </div>
          </Router>
        </div>
      </div>
    );
  }, [user]);

  return app;
};