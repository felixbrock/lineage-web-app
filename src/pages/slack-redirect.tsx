import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IntegrationApiRepo from '../infrastructure/integration-api/integration-api-repo';
import SlackAccessTokenRepo from '../infrastructure/slack-api/access-token/slack-access-token-repo';
import AccountApiRepository from '../infrastructure/account-api/account-api-repo';

export default () => {
  const navigate = useNavigate();

  const { code, state } = useParams();

  const [user, setUser] = useState<string>();
  const [jwt, setJwt] = useState<any>();
  const [accountId, setAccountId] = useState<string>();

  const renderSlackRedirect = () => {
    setUser(undefined);
    setJwt('');
    setAccountId('');

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.federatedSignIn();
      });
  };

  useEffect(() => {
    renderSlackRedirect();
  }, []);

  useEffect(() => {
    if (!user) return;

    Auth.currentSession()
      .then((session) => {
        const accessToken = session.getAccessToken();

        const token = accessToken.getJwtToken();
        setJwt(token);

        return AccountApiRepository.getBy(new URLSearchParams({}), token);
      })
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setAccountId(accounts[0].id);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);
      });
  }, [user]);

  useEffect(() => {
    if (!accountId) return;

    if (!jwt) throw new Error('No user authorization found');

    if (!code) throw new Error('Did not receive a temp auth code from Slack');
    if (state !== 'todo')
      throw new Error(
        `Detected potential forgery attack with received state ${state}`
      );

    let accessToken: string;

    SlackAccessTokenRepo.getAccessToken(code)
      .then((res) => {
        accessToken = res;
        return IntegrationApiRepo.getSlackProfile(jwt);
      })
      .then((slackProfile) => {
        if (slackProfile)
          return IntegrationApiRepo.updateSlackProfile({ accessToken }, 'todo');
        return Promise.resolve();
      })
      .then(() =>
        navigate(`/lineage`, {
          state: {
            slackAccessToken: accessToken,
            showIntegrationSidePanel: true,
            sidePanelTabIndex: 2,
          },
        })
      )
      .catch(() => console.trace('Error when handling slack redirect'));
  }, [accountId]);

  return <></>;
};
