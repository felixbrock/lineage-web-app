import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import GithubApiRepo from '../../../infrastructure/github-api/github-api-repo';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';
import './github.scss';
import { BiGitBranch } from 'react-icons/bi';
import { mode } from '../../../config';
import {
  ButtonBig,
  ButtonSmall,
} from '../../../pages/lineage/components/buttons';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (installationId && accessToken) {
      GithubApiRepo.getRepositories(accessToken, installationId)
        .then((repos) => {
          setRepoNameResult({
            repoNames: repos.map((repo) => repo.full_name),
            checked: true,
          });
          setIsLoading(false);
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
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.trace(error);
        });
    }
  }, []);

  useEffect(() => {
    if (!repoNameResult.checked) return;
    setIsLoading(false);

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
      {isLoading && (
        <div className="flex w-full items-center justify-center">
          <svg
            className="h-10 w-10 animate-spin text-cito"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {!isLoading && repoNameResult.repoNames.length === 0 && (
        <div className="flex w-full items-center justify-center">
          <a
            href={`https://github.com/apps/${
              mode === 'development' ? 'cito-data-dev' : 'cito-data'
            }/installations/new?state=${organizationId}`}
          >
            <ButtonBig
              buttonText="Install the CitoData Github App"
              onClick={() => {}}
              className="bg-cito text-gray-50 hover:bg-indigo-600"
            />
          </a>
        </div>
      )}
      {!isLoading && repoNameResult.repoNames.length > 0 && (
        <>
          <div className="flex w-full items-center justify-between">
            <p className="caption">Installed on Following Repositories:</p>
            <a
              href={`https://github.com/apps/${
                mode === 'development' ? 'cito-data-dev' : 'cito-data'
              }/installations/new?state=${organizationId}`}
            >
              <ButtonSmall
                buttonText="Configure Repositories"
                onClick={() => {}}
              />
            </a>
          </div>

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
      )}
    </>
  );
};
