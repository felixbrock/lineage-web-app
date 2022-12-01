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
import GithubRedirect from './pages/github-redirect';
import SlackRedirect from './pages/slack-redirect';
import iocContainer from './ioc-container';
import appConfig from './config';

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
      ...appConfig.cloud.userPoolConfig,
    },
    oauth: {
      scope: ['email', 'openid'],
      responseType: 'code',
      ...appConfig.oauth,
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

    const matApiRepo = iocContainer.resolve('matApiRepo');
    const colApiRepo = iocContainer.resolve('colApiRepo');
    const dashboardApiRepo = iocContainer.resolve('dashboardApiRepo');
    const dependencyApiRepo = iocContainer.resolve('dependencyApiRepo');
    const lineageApiRepo = iocContainer.resolve('lineageApiRepo');
    const logicApiRepo = iocContainer.resolve('logicApiRepo');
    const accountApiRepo = iocContainer.resolve('accountApiRepo');
    const integrationApiRepo = iocContainer.resolve('integrationApiRepo');
    const observabilityApiRepo = iocContainer.resolve('observabilityApiRepo');

    setApp(
      <div className="App">
        <div id="app">
          <Router>
            <div id="ContentContainer">
              <Routes>
                <Route
                  path="/lineage"
                  element={
                    <Lineage
                      accountApiRepo={accountApiRepo}
                      colApiRepo={colApiRepo}
                      dashboardApiRepo={dashboardApiRepo}
                      dependencyApiRepo={dependencyApiRepo}
                      integrationApiRepo={integrationApiRepo}
                      lineageApiRepo={lineageApiRepo}
                      logicApiRepo={logicApiRepo}
                      matApiRepo={matApiRepo}
                    />
                  }
                />
                <Route
                  path="/test"
                  element={
                    <Test
                      accountApiRepo={accountApiRepo}
                      colApiRepo={colApiRepo}
                      lineageApiRepo={lineageApiRepo}
                      matApiRepo={matApiRepo}
                      observabilityApiRepo={observabilityApiRepo}
                    />
                  }
                />
                {/* in development copy query params and manually call Github redirect: https://smee.io/XeUBYbnaoGxxxcf */}
                <Route
                  path="/oauth/github/:code/:installationId/:state"
                  element={<GithubRedirect />}
                />
                <Route
                  path="/oauth/slack/:code/:state"
                  element={<SlackRedirect />}
                />
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
