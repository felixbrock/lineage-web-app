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

export default (): ReactElement => {
  Auth.configure({
    Auth: {
      region: 'eu-central-1', 
      mandatorySignIn: true,
      userPoolId: 'eu-central-1_X27xCNSof',
      userPoolWebClientId: 'lh7qnvrevedkem43b7qvpjhl',
    },
    oauth: {
      scope: ['email', 'openid'],
      responseType: 'code',
      domain : 'auth-staging.citodata.com',
      redirectSignIn : 'https://app-staging.citodata.com',
      redirectSignOut : 'https://app-staging.citodata.com',
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
