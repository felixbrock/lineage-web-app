import { Button } from '@mui/material';

export default (index: number) => {
  const links: { [key: number]: any } = {
    0: {
      href: 'https://github.com/apps/cito-data/installations/new',
      label: 'Install Cito GitHub App',
    },
    1: {
      href: 'https://google.com',
      label: 'Test1',
    },
    2: {
      href: 'https://google.com',
      label: 'Test2',
    },
    3: {
      href: 'https://google.com',
      label: 'Test3',
    },
  };

  return <Button href='#' onClick={() => window.open(links[index].href, '_blank')}>{links[index].label}</Button>;
};
