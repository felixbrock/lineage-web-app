import { Button } from '@mui/material';

export default (index: number) => {
  const links: { [key: number]: any } = {
    0: {
      href: 'https://github.com/apps/cito-data/installations/new',
      label: 'Install Cito GitHub App',
    },
    1: {
      href: 'https://google.com',
      label: 'Google',
    },
    2: {
      href: 'https://slack.com/oauth/v2/authorize?client_id=3743097674080.3733004026065&scope=app_mentions:read,channels:history,channels:join,channels:manage,channels:read,chat:write,chat:write.public,conversations.connect:write,files:read,files:write,groups:read,groups:write,im:read,im:write,links:read,mpim:read,mpim:write,users:read,users:write',
      label: 'Install Cito Slack App',
    },
    3: {
      href: 'https://google.com',
      label: 'Test3',
    },
  };

  return <Button href={links[index].href}>{links[index].label}</Button>;
  // return <Button href='#' onClick={() => window.open(links[index].href, '_blank')}>{links[index].label}</Button>;
};
