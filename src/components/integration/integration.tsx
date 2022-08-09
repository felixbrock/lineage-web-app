import Github from './github/github';
import Slack from './slack/slack';

export default (index: number, accessToken?: string) => {
  

  const links: { [key: number]: any } = {
    0: <Github></Github>,
    1: <Github></Github>,
    2: Slack(accessToken),
    3: <Github></Github>,
  };

  return links[index];
};