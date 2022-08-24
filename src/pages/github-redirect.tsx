// import { Auth } from 'aws-amplify';
// import { useEffect, useState } from 'react';
// import AccountApiRepository from '../infrastructure/account-api/account-api-repo';
// import { useNavigate, useParams } from "react-router-dom";
// import IntegrationApiRepo from '../infrastructure/integration-api/integration-api-repo';
// import axios, { AxiosRequestConfig } from 'axios';
// import { githubConfig } from '../config';

import { useParams } from "react-router-dom";

export default () => {
  // const navigate = useNavigate();

  const { code, installationId } = useParams();

  // const [user, setUser] = useState<string>();
  // const [jwt, setJwt] = useState<any>();
  // const [organizationId, setOrganizationId] = useState<string>();
  // const [repoNames, setRepoNames] = useState<string[]>([]);

  // const renderGithubRedirect = () => {
  //   setUser(undefined);
  //   setJwt('');
  //   setOrganizationId('');
    
  //   Auth.currentAuthenticatedUser()
  //     .then((cognitoUser) => setUser(cognitoUser))
  //     .catch((error) => {
  //       console.trace(typeof error === 'string' ? error : error.message);

  //       Auth.federatedSignIn();
  //     });
  // };

  // useEffect(() => {
  //   renderGithubRedirect();
  // }, []);

  // useEffect(() => {
  //   if (!user) return;
    
  //   Auth.currentSession()
  //     .then((session) => {
  //       const accessToken = session.getAccessToken();

  //       const token = accessToken.getJwtToken();
  //       setJwt(token);

  //       return AccountApiRepository.getBy(new URLSearchParams({}), token);
  //     })
  //     .then((accounts) => {
  //       if (!accounts.length) throw new Error(`No accounts found for user`);

  //       if (accounts.length > 1)
  //         throw new Error(`Multiple accounts found for user`);

  //       setOrganizationId(accounts[0].organizationId);
  //     })
  //     .catch((error) => {
  //       console.trace(typeof error === 'string' ? error : error.message);
  //     });
  // }, [user]);

  // const getAccessCode = async (
  //   githubCode: string,
  //   clientId: string,
  //   clientSecret: string,
  // ): Promise<string> => {
  //   try {

  //     const config: AxiosRequestConfig = {
  //       headers: {
  //         Authorization: `Bearer ${jwt}`
  //       }
  //     };

  //     const response = await axios.post(
  //       'https://github.com/login/oauth/access_token',
  //       {
  //         code: githubCode,
  //         clientId,
  //         clientSecret,
  //       },
  //       config
  //     );

  //     const jsonResponse = response.data;
  //     if (response.status !== 200) throw new Error(jsonResponse.message);
  //     if (!jsonResponse)
  //       throw new Error('Retrieval of github access token failed');
  //     return jsonResponse.access_token;
  //   } catch (error: unknown) {
  //     if (typeof error === 'string') return Promise.reject(error);
  //     if (error instanceof Error) return Promise.reject(error.message);
  //     return Promise.reject(new Error('Unknown error occured'));
  //   }
  // };

  // const getRepoName = async (
  //   token: string,
  //   installation: string,
  // ): Promise<string[]> => {
  //   try {

  //     const config: AxiosRequestConfig = {
  //       headers: {
  //         Authorization: `token ${token}`
  //       }
  //     };

  //     const response = await axios.get(
  //       `https://api.github.com/user/installations/${installation}/repositories`,
  //       config
  //     );

  //     const jsonResponse = response.data;
  //     if (response.status !== 200) throw new Error(jsonResponse.message);
  //     if (!jsonResponse)
  //       throw new Error('Retrieval of repos failed');

  //     const repositories: any[] = jsonResponse.repositories;

  //     return repositories.map((repo) => repo.full_name);
  //   } catch (error: unknown) {
  //     if (typeof error === 'string') return Promise.reject(error);
  //     if (error instanceof Error) return Promise.reject(error.message);
  //     return Promise.reject(new Error('Unknown error occured'));
  //   }
  // };
  
  // useEffect(() => {
  //   if (!organizationId) return;
    
  //   if (!jwt) throw new Error('No user authorization found');

  //   if (!code) throw new Error('Did not receive a temp auth code from Github');

  //   if (!installationId) throw new Error('Did not receive installationId from Github');

  //   getAccessCode(code, githubConfig.githubClientId, githubConfig.githubClientSecret)
  //   .then((accessToken) => {
  //     return getRepoName(installationId, accessToken);
  //   })
  //   .then((element) => {
  //     setRepoNames(element);
  //   })
  //   .catch((error: any) => {
  //     console.trace(error);
  //   });
  // }, [organizationId]);

  // useEffect(() => {
  //   if(!repoNames.length) return;

  //   if (!installationId) throw new Error('Did not receive installationId from Github');

  //   if (!organizationId) return;


  //   IntegrationApiRepo.createGithubProfile(installationId, organizationId, repoNames, jwt)
  //     .then(() =>
  //       navigate(`/lineage`, {
  //         state: {
  //           installation: installationId,
  //           showIntegrationPanel: true,
  //           sidePanelTabIndex: 2,
  //         },
  //         replace: true
  //       })
  //     )
  //     .catch((error) => console.trace(error));
  // });

  return <>{code}{installationId}</>;
};

