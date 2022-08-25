import { Button, List, ListItem, ListItemText } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import GithubApiRepo from '../../../infrastructure/github-api/github-api-repo';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';

interface GithubProps {
  installationId?: string;
  accessToken?: string;
  organizationId: string;
  jwt: string;
}

export default ({
  installationId,
  accessToken,
  organizationId,
  jwt,
}: GithubProps): ReactElement => {
  const [repoNames, setRepoNames] = useState<string[]>([]);

  useEffect(() => {
    if (installationId && accessToken){
      GithubApiRepo.getRepositories(installationId, accessToken)
        .then((repos) => {
          setRepoNames(repos.map((repo) => repo.full_name));
        })
        .catch((error: any) => {
          console.trace(error);
        });
      }
    else {
      IntegrationApiRepo.getGithubProfile(
        new URLSearchParams({ organizationId }),
        jwt
      )
        .then((profile) => {
          if (profile) setRepoNames(profile.repositoryNames);
        })
        .catch((error: any) => {
          console.trace(error);
        });
      }
  }, []);

  useEffect(() => {
    if (installationId && accessToken)
      IntegrationApiRepo.getGithubProfile(
        new URLSearchParams({ organizationId }),
        jwt
      )
        .then((profile) => {
          if (profile)
            return IntegrationApiRepo.updateGithubProfile(
              { installationId },
              jwt
            );
          return IntegrationApiRepo.postGithubProfile(
            {
              installationId,
              organizationId,
              repositoryNames: repoNames,
            },
            jwt
          );
        })
        .catch((error: any) => {
          console.trace(error);
        });
  }, [repoNames]);

  return (
    <>
      <Button
        href={`https://github.com/apps/cito-data/installations/new?state=${organizationId}`}
      >
        Install Cito Data Github App
      </Button>

      <p>Github App installed on repositories:</p>

      <List>
        {repoNames.map((name) => {
          return (
            <ListItem>
              <ListItemText primary={name} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
