import { Button, List, ListItem, ListItemText } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';

interface GithubProps {
  installationId: string;
  jwt: string;
}

export default ({ installationId, jwt }: GithubProps): ReactElement => {
  const [repoNameList, setRepoNameList] = useState<string[]>([]);

  useEffect(() => {
    if (installationId)
      IntegrationApiRepo.readGithubProfile(installationId, jwt).then(
        (profile) => {
          const repositoryNames = profile.repositoryNames;
          setRepoNameList(repositoryNames);
        }
      );
  }, []);

  return (
    <>
      <Button href="https://github.com/apps/cito-data/installations/new">
        {' '}
        Install Cito Data Github App{' '}
      </Button>

      <p>Github App installed on repositories:</p>

      <List>
        {repoNameList.map((name) => {
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
