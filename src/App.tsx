import { ReactElement, useEffect, useState } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import './App.scss';
import Lineage from './pages/lineage/lineage';
import { authEnvConfig, oAuthEnvConfig } from './config';

export default (): ReactElement => {
  
  Amplify.configure({
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
      scope: ['email', 'openid', ],
      responseType: 'token',
      ...oAuthEnvConfig,
    },
  });

  const [user, setUser] = useState();

  const [app, setApp] = useState<ReactElement>(<div />);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        console.log(error);

        Auth.federatedSignIn();
      });
  }, []);

  useEffect(() => {
    if (!user) return;

    setApp(
      <div className="App">
      <div id='app'>
        <Router>
          <div id='ContentContainer'>
            <Routes>
              <Route path="/lineage" element={<Lineage/>} />
              <Route path="/" element={<Navigate to="/lineage"/>}/>
            </Routes>
          </div>
        </Router>
      </div>
    </div>
    );
  }, [user]);

  return app;
};
