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
  const [organizationId, setOrganizationId] = useState<string>();

  const renderSlackRedirect = () => {
    setUser(undefined);
    setOrganizationId('');

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

    AccountApiRepository.getBy(new URLSearchParams({}))
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setOrganizationId(accounts[0].organizationId);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);
      });
  }, [user]);

  useEffect(() => {
    if (!organizationId) return;

    if (!code) throw new Error('Did not receive a temp auth code from Slack');
    if (state !== organizationId)
      throw new Error(
        `Detected potential forgery attack with received state ${state}`
      );

    let accessToken: string;

    SlackAccessTokenRepo.getAccessToken(code)
      .then((res) => {
        accessToken = res;
        sessionStorage.setItem('slack-access-token', accessToken);

        return IntegrationApiRepo.getSlackProfile();
      })
      .then((slackProfile) => {
        if (slackProfile)
          return IntegrationApiRepo.updateSlackProfile({ accessToken });
        return Promise.resolve();
      })
      .then(() =>
        navigate(`/lineage`, {
          state: {
            redirectSource: 'slack',
            sidePanelTabIndex: 2,
          },
          replace: true,
        })
      )
      .catch((error) => console.trace(error));
  }, [organizationId]);

  return <>redirecting...</>;
};
