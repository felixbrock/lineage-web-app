import {
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import GithubApiRepo from '../../../infrastructure/github-api/github-api-repo';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';
import './github.scss';
import { BiGitBranch } from 'react-icons/bi';
import { mode } from '../../../config';

interface GithubProps {
  installationId?: string;
  accessToken?: string;
  organizationId: string;
  jwt: string;
}

interface RepoNameResult {
  repoNames: string[];
  checked: boolean;
}

export default ({
  installationId,
  accessToken,
  organizationId,
  jwt,
}: GithubProps): ReactElement => {
  const [repoNameResult, setRepoNameResult] = useState<RepoNameResult>({
    repoNames: [],
    checked: false,
  });

  useEffect(() => {
    if (installationId && accessToken) {
      GithubApiRepo.getRepositories(accessToken, installationId)
        .then((repos) => {
          setRepoNameResult({
            repoNames: repos.map((repo) => repo.full_name),
            checked: true,
          });
        })
        .catch((error: any) => {
          console.trace(error);
        });
    } else {
      IntegrationApiRepo.getGithubProfile(
        new URLSearchParams({ organizationId }),
        jwt
      )
        .then((profile) => {
          if (profile)
            setRepoNameResult({
              repoNames: profile.repositoryNames,
              checked: true,
            });
        })
        .catch((error: any) => {
          console.trace(error);
        });
    }
  }, []);

  useEffect(() => {
    if (!repoNameResult.checked) return;

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
      <h4>Connect to Github</h4>
      <Divider />

      <Button
        sx={{
          minHeight: 0,
          minWidth: 0,
          padding: 0,
          mt: 2,
          mb: 2,
          fontWeight: 'bold',
        }}
        href={`https://github.com/apps/${
          mode === 'development' ? 'cito-data-dev' : 'cito-data'
        }/installations/new?state=${organizationId}`}
      >
        Install Cito Data Github App
      </Button>

      <p className="caption">Installed on Following Repositories:</p>

      <List>
        {repoNameResult.repoNames.map((name) => {
          return (
            <ListItem dense={true}>
              <ListItemIcon>
                <BiGitBranch />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
