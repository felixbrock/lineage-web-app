import React, { ReactElement, useState, useEffect } from 'react';
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import TopNav from './components/top-nav/top-nav';
// import Subscriptions from './components/subscriptions/subscriptions';
// import Systems from './components/systems/systems';
// import DemoSystem from './components/demo-system/demo-system';
// import Footer from './components/footer/footer';
import './App.css';
import Systems from './pages/systems/systems';
import Selectors from './pages/selectors/selectors';
import Automations from './pages/automations/automations';
import HistoricalData from './pages/historical-data/historical-data';
import Footer from './components/footer/footer';
import {
  HeaderContainer,
  ContentContainer,
  FooterContainer,
  App,
} from './App-Items';
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
      scope: ['email', 'openid'],
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
        <App>
          <Router>
            <HeaderContainer>
              <TopNav />
            </HeaderContainer>
            <ContentContainer>
              <Switch>
                <Route path="/systems" component={Systems} />
                <Route path="/system/:id" component={Selectors} />
                <Route path="/automations" component={Automations} />
                <Route path="/historical-data" component={HistoricalData} />
                <Route exact path="/">
                  <Redirect to="/systems" />
                </Route>
              </Switch>
            </ContentContainer>
            <FooterContainer>
              <Footer />
            </FooterContainer>
          </Router>
        </App>
      </div>
    );
  }, [user]);

  return app;
};
