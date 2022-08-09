import { useNavigate, useParams } from 'react-router-dom';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';
import SlackAccessTokenRepo from '../../../infrastructure/slack-api/access-token/slack-access-token-repo';

export default async () => {
  const navigate = useNavigate();

  const { code, state } = useParams();

  if (!code) throw new Error('Did not receive a temp auth code from Slack');
  if (state !== 'todo')
    throw new Error(
      `Detected potential forgery attack with received state ${state}`
    );

  const accessToken = await SlackAccessTokenRepo.getAccessToken(code);

  const slackProfile = await IntegrationApiRepo.getSlackProfile('todo');

  if (slackProfile)
    await IntegrationApiRepo.updateSlackProfile({ accessToken }, 'todo');

  navigate(`/lineage`, {
    state: {
      slackAccessToken: accessToken,
      showIntegrationSidePanel: true,
      sidePanelTabIndex: 2,
    },
  });

  return <></>;
};
