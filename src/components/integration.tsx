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
      //href: 'https://slack.com/oauth/v2/authorize?client_id=3743837702852.3728367364791&scope=channels:history,channels:read,chat:write,chat:write.public,channels:manage,files:read,channels:join,files:write,users:read,im:read,users:write,im:write,users.profile:read,conversations.connect:write,im:history,links:read,links:write,mpim:read,mpim:write&user_scope=',
      href: 'https://slack.com/oauth/v2/authorize?client_id=3334524827045.3705229963495&scope=channels:join,channels:manage,channels:read,chat:write,chat:write.customize,chat:write.public,groups:read,im:read,mpim:read,usergroups:read,users:read&user_scope=',
      label: 'Install to Slack',
    },
    3: {
      href: 'https://google.com',
      label: 'Test3',
    },
  };

  return <Button href={links[index].href}>{links[index].label}</Button>;
  // return <Button href='#' onClick={() => window.open(links[index].href, '_blank')}>{links[index].label}</Button>;
};
