import { InputLabel, Select, FormControl, Divider } from '@mui/material';
import './slack.scss';
import appConfig from '../../../config';
import { ReactElement } from 'react';

const buildOAuthUrl = (organizationId: string) => {
  const clientId = encodeURIComponent(appConfig.slack.slackClientId);
  const scopes = encodeURIComponent(
    'channels:read,channels:join,channels:manage,chat:write,groups:read,groups:write,im:read,im:write,mpim:read,mpim:write'
  );

  return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&state=${organizationId}`;
};

interface SlackProps {
  organizationId: string;
  jwt: string;
}

export default ({ organizationId }: SlackProps): ReactElement => {
  return (
    <>
      <h4>Connect to Slack</h4>
      <Divider />
      <div className="integration-button">
        <a href={buildOAuthUrl(organizationId)}>
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </div>
      <FormControl fullWidth>
        <InputLabel id="select-channel-label">Select Channel</InputLabel>
        <Select
          labelId="select-channel-label"
          id="select-channel"
          value={''}
          label="Select Channel"
          onChange={() => {
            console.log('test');
          }}
        >
          {[]}
        </Select>
      </FormControl>
    </>
  );
};
