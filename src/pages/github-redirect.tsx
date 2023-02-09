import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import AccountApiRepository from '../infrastructure/account-api/account-api-repo';
import { useNavigate, useParams } from 'react-router-dom';
import IntegrationApiRepo from '../infrastructure/integration-api/integration-api-repo';

export default () => {
  const navigate = useNavigate();

  const { code, installationId, state } = useParams();

  const [user, setUser] = useState<string>();
  const [jwt, setJwt] = useState<any>();
  const [organizationId, setOrganizationId] = useState<string>();

  const renderGithubRedirect = () => {
    setUser(undefined);
    setJwt('');
    setOrganizationId('');

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.federatedSignIn();
      });
  };

  useEffect(() => {
    renderGithubRedirect();
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

        setOrganizationId(accounts[0].organizationId);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);
      });
  }, [user]);

  useEffect(() => {
    if (!organizationId) return;

    if (!jwt) throw new Error('No user authorization found');

    if (!code) throw new Error('Did not receive a temp auth code from Github');

    if (!installationId)
      throw new Error('Did not recieve installationId from Github');

    if (state !== organizationId)
      throw new Error(
        `Detected potential forgery attack with received state ${state}`
      );

    IntegrationApiRepo.getAccessToken(code, jwt)
      .then((accessToken) => {
        sessionStorage.setItem('github-installation-id', installationId);
        sessionStorage.setItem('github-access-token', accessToken);

        navigate(`/lineage`, {
          state: {
            redirectSource: 'github',
            sidePanelTabIndex: 1,
          },
          replace: true,
        });
      })
      .catch((error) => console.trace(error));
  }, [organizationId]);

  return <>redirecting...</>;
};
