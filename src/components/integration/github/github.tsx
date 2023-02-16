import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { BiGitBranch } from 'react-icons/bi';
import {
  ButtonBig,
  ButtonSmall,
} from '../../../pages/lineage/components/buttons';
import LoadingScreen from '../../loading-screen';
import appConfig from '../../../config';

interface GithubProps {
  organizationId: string;
  jwt: string;
}

export default ({ organizationId }: GithubProps): ReactElement => {
  const repoNameResult = {
    repoNames: [],
    checked: false,
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!repoNameResult.checked) return;
    setIsLoading(false);
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
