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

interface RepoNameResult {
  repoNames: string[],
  checked: boolean
}

export default ({
  installationId,
  accessToken,
  organizationId,
  jwt,
}: GithubProps): ReactElement => {
  const [repoNameResult, setRepoNameResult] = useState<RepoNameResult>({repoNames: [], checked: false});

  useEffect(() => {    
    if (installationId && accessToken){
      GithubApiRepo.getRepositories(accessToken, installationId)
        .then((repos) => {
          setRepoNameResult({repoNames: repos.map((repo) => repo.full_name), checked: true});
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
          if (profile) setRepoNameResult({repoNames: profile.repositoryNames, checked: true});
        })
        .catch((error: any) => {
          console.trace(error);
        });
      }
  }, []);

  useEffect(() => {
    if(!repoNameResult.checked) return;

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
              repositoryNames: repoNameResult.repoNames,
            },
            jwt
          );
        })
        .catch((error: any) => {
          console.trace(error);
        });
  }, [repoNameResult]);

  return (
    <>
      <Button
        href={`https://github.com/apps/cito-data/installations/new?state=${organizationId}`}
      >
        Install Cito Data Github App
      </Button>

      <p>Github App installed on repositories:</p>

      <List>
        {repoNameResult.repoNames.map((name) => {
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
