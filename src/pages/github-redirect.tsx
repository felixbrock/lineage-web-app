import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import IntegrationApiRepo from '../infrastructure/integration-api/integration-api-repo';
// import SlackAccessTokenRepo from '../infrastructure/slack-api/access-token/slack-access-token-repo';
import AccountApiRepository from '../infrastructure/account-api/account-api-repo';
import { useNavigate, useParams } from "react-router-dom";
import IntegrationApiRepo from '../infrastructure/integration-api/integration-api-repo';

export default () => {
  const navigate = useNavigate();

  const { code, installationId } = useParams();
  console.log(code);

  const [user, setUser] = useState<string>();
  const [jwt, setJwt] = useState<any>();
  // const [accountId, setAccountId] = useState<string>();
  const [organizationId, setOrganizationId] = useState<string>();

  const renderGithubRedirect = () => {
    setUser(undefined);
    setJwt('');
    // setAccountId('');
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

        // setAccountId(accounts[0].id);
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

    if (!installationId) throw new Error('Did not recieve installationId from Github');

    IntegrationApiRepo.createGithubProfile(installationId, organizationId, jwt)

      .then(() =>

        navigate(`/lineage`, {
          state: {
            installationId,
            showIntegrationPanel: true,
            sidePanelTabIndex: 2,
          },
          replace: true
        })
      )
      .catch((error) => console.trace(error));
  }, []);

  return <></>;
};

