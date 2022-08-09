import Github from './github/github';
import Slack from './slack/slack';

const getSlackComponent = (accessToken?: string) => {
  if(!accessToken)
  throw new Error('Slack access token missing');

  return Slack(accessToken);
};

export default (index: number, accessToken?: string) => {
  

  const links: { [key: number]: any } = {
    0: <Github></Github>,
    1: <Github></Github>,
    2: getSlackComponent(accessToken),
    3: <Github></Github>,
  };

  return links[index];
};