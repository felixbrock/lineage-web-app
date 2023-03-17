import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import GithubApiRepo from '../../../infrastructure/github-api/github-api-repo';
import { BiGitBranch } from 'react-icons/bi';
import {
  ButtonBig,
  ButtonSmall,
} from '../../../pages/lineage/components/buttons';
import LoadingScreen from '../../loading-screen';
import appConfig from '../../../config';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';

interface GithubProps {
  organizationId: string;
}

interface RepoNameResult {
  repoNames: string[];
  checked: boolean;
}

export default ({ organizationId }: GithubProps): ReactElement => {
  const [repoNameResult, setRepoNameResult] = useState<RepoNameResult>({
    repoNames: [],
    checked: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [installationId, setInstallationId] = useState<string | undefined>();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    const githubAccessToken = sessionStorage.getItem('github-access-token');
    const githubInstallationId = sessionStorage.getItem(
      'github-installation-id'
    );
    if (githubAccessToken) setAccessToken(githubAccessToken);
    if (githubInstallationId) setInstallationId(githubInstallationId);

    if (githubInstallationId && githubAccessToken) {
      GithubApiRepo.getRepositories(githubAccessToken, githubInstallationId)
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
        new URLSearchParams({ organizationId })
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
        new URLSearchParams({ organizationId })
      )
        .then((profile) => {
          if (profile)
            return IntegrationApiRepo.updateGithubProfile({ installationId });
          return IntegrationApiRepo.postGithubProfile({
            installationId,
            organizationId,
            repositoryNames: repoNameResult.repoNames,
          });
        })
        .then(() => {
          sessionStorage.removeItem('github-access-token');
          sessionStorage.removeItem('github-installation-id');
        })
        .catch((error: any) => {
          console.trace(error);
        });
  }, [repoNameResult]);

  return (
    <>
      {isLoading && (
        <LoadingScreen tailwindCss="flex w-full items-center justify-center" />
      )}
      {!isLoading && repoNameResult.repoNames.length === 0 && (
        <div className="flex w-full items-center justify-center">
          <a
            href={`https://github.com/apps/${
              appConfig.react.mode === 'development'
                ? 'cito-data-dev'
                : 'cito-data'
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
                appConfig.react.mode === 'development'
                  ? 'cito-data-dev'
                  : 'cito-data'
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
