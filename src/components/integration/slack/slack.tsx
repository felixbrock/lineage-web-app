/* eslint-disable @typescript-eslint/dot-notation */
import { ReactElement, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  Divider,
} from '@mui/material';
import { mode, slackConfig } from '../../../config';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';
import SlackConversationInfoDto from '../../../infrastructure/integration-api/slack-channel-info-dto';
import SlackProfileDto from '../../../infrastructure/integration-api/slack-profile-dto';

const buildOAuthUrl = (organizationId: string) => {
  const clientId = encodeURIComponent(slackConfig.slackClientId);
  const scopes = encodeURIComponent(
    'channels:read,channels:join,channels:manage,chat:write,groups:read,groups:write,im:read,im:write,mpim:read,mpim:write'
  );

  return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&state=${organizationId}`;
};

interface SlackProps {
  organizationId: string;
  accessToken?: string;
  jwt: string;
}

export default ({
  accessToken,
  organizationId,
  jwt,
}: SlackProps): ReactElement => {
  const [channels, setChannels] = useState<SlackConversationInfoDto[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [selectElements, setSelectElements] = useState<ReactElement[]>([]);
  const [profile, setProfile] = useState<SlackProfileDto | null>();

  const handleChannelSelectChange = async (
    event: SelectChangeEvent
  ): Promise<void> => {
    const channelId: string = event.target.value;
    const channelName = channels.filter(
      (element) => element.id === channelId
    )[0].name;

    const oldChannelId = profile ? profile.channelId : selectedChannelId;

    const slackAccessToken = accessToken || profile?.accessToken;

    if (slackAccessToken)
      await IntegrationApiRepo.joinSlackConversation(
        oldChannelId,
        channelId,
        slackAccessToken,
        jwt
      );

    if (profile) {
      await IntegrationApiRepo.updateSlackProfile(
        { channelId, channelName },
        jwt
      );
      setProfile({ ...profile, channelId, channelName });
    } else if (accessToken) {
      const slackProfile = await IntegrationApiRepo.postSlackProfile(
        { accessToken, channelId, channelName },
        jwt
      );
      if (!slackProfile)
        throw new Error('Did not receive slack profile after creating it');
      setProfile(slackProfile);
    }

    setSelectedChannelId(channelId);
  };

  useEffect(() => {
    IntegrationApiRepo.getSlackConversations(
      new URLSearchParams(accessToken ? { accessToken } : {}),
      jwt
    )
      .then((res) => {
        setChannels(res);

        return IntegrationApiRepo.getSlackProfile(jwt);
      })
      .then((res) => {
        if (res) {
          setProfile(res);
          setSelectedChannelId(res.channelId);
        }
      })
      .catch((error: any) => {
        console.trace(error);
      });
  }, []);

  useEffect(() => {
    if (!channels.length) return;

    const elements = channels
      .filter((element) => element.isChannel && !element.isPrivate)
      .map((element) => <MenuItem value={element.id}>{element.name}</MenuItem>);

    setSelectElements(elements);
  }, [channels]);

  return (
    <>
      <h4>Connect to Slack</h4>

      <Divider />

      {mode === 'production' ? (
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
      ) : (
        <Button
          sx={{ minHeight: 0, minWidth: 0, padding: 0, mt: 2, mb: 2, fontWeight: 'bold' }}
          href={buildOAuthUrl(organizationId)}
        >
          {'Install'}
        </Button>
      )}

      <FormControl fullWidth>
        <InputLabel id="select-channel-label">Select Channel</InputLabel>
        <Select
          labelId="select-channel-label"
          id="select-channel"
          value={selectedChannelId}
          label="Select Channel"
          onChange={handleChannelSelectChange}
        >
          {selectElements}
        </Select>
      </FormControl>
    </>
  );
};
