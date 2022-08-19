import { Button, List, ListItem, ListItemText } from '@mui/material';
import axios, { AxiosRequestConfig } from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import { githubConfig } from '../../../config';

interface GithubProps {
  tempAuthCode: string,
  installationId: string
  jwt: string
}

export default ({ tempAuthCode, installationId, jwt }: GithubProps): ReactElement => {

  const [repoNameList, setRepoNameList] = useState<string[]>([]);

  const getAccessCode = async (
    githubCode: string,
    clientId: string,
    clientSecret: string,
  ): Promise<string> => {
    try {

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      };

      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          code: githubCode,
          clientId,
          clientSecret,
        },
        config
      );

      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse)
        throw new Error('Retrieval of github access token failed');
      return jsonResponse.access_token;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  const getRepoName = async (
    installation: string,
    token: string
  ): Promise<string[]> => {
    try {

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `token ${token}`
        }
      };

      const response = await axios.get(
        `https://api.github.com/user/installations/${installation}/repositories`,
        config
      );

      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse)
        throw new Error('Retrieval of repos failed');

      const repositories: any[] = jsonResponse.repositories;
      const repoNames: string[] = repositories.map((repo) => repo.full_name);

      return repoNames;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };


  useEffect(() => {

    getAccessCode(tempAuthCode, githubConfig.githubClientId, githubConfig.githubClientSecret)
      .then((accessToken) => {
        return getRepoName(installationId, accessToken);
      })
      .then((repoNames) => {

        setRepoNameList(repoNames);
      })
      .catch((error: any) => {
        console.trace(error);
      });
 

  }, []);


  return (
    <>
      <Button href='https://github.com/apps/cito-data/installations/new'> Install Cito Data Github App </Button>

      <p>Github App installed on repositories:</p>
          
      <List>

        {repoNameList.map((name) => {
          return (
          <ListItem>
            <ListItemText primary={name}/>
          </ListItem>
          );
        })
      }
      </List>
    </>
  );

};