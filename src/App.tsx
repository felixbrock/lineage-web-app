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
// import { authEnvConfig, oAuthEnvConfig } from './config';

export default (): ReactElement => {
  // console.log(authEnvConfig, oAuthEnvConfig);

  Auth.configure({
    Auth: {
      region: 'eu-central-1', 
      mandatorySignIn: true,
      userPoolId: 'eu-central-1_Yr1WxcGZc',
      userPoolWebClientId: '1riotb1410u3t3d3l6jaos056j',
    },
    oauth: {
      scope: ['email', 'openid'],
      responseType: 'code',
      domain : 'citodata-test.auth.eu-central-1.amazoncognito.com',
      redirectSignIn : 'https://www.app-staging.citodata.com',
      redirectSignOut : 'https://www.app-staging.citodata.com',
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
        console.log('YYYYYYYYYYYYYYYYYYYYYY');

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
