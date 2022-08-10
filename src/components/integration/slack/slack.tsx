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
} from '@mui/material';
import { slackConfig } from '../../../config';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';
import SlackConversationInfoDto from '../../../infrastructure/integration-api/slack-channel-info-dto';

const buildOAuthUrl = (accountId: string) => {
  const clientId = encodeURIComponent(slackConfig.slackClientId);
  const scopes = encodeURIComponent(
    'channels:read,channels:join,chat:write,groups:read,im:read,mpim:read'
  );

  return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&state=${accountId}`;
};

interface SlackProps {
  accountId: string;
  jwt: string;
}

export default ({ accountId, jwt }: SlackProps): ReactElement => {
  const [channels, setChannels] = useState<SlackConversationInfoDto[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectElements, setSelectElements] = useState<ReactElement[]>([]);

  const handleChannelSelectChange = async (
    event: SelectChangeEvent
  ): Promise<void> => {
    const channelId: string = event.target.value;
    const channelName = channels.filter(
      (element) => element.id === channelId
    )[0].name;

    await IntegrationApiRepo.updateSlackProfile(
      { channelId, channelName: channelName },
      jwt
    );

    await IntegrationApiRepo.joinSlackConversation(
      jwt
    );

    setSelectedChannel(channelId);
  };

  useEffect(() => {
    IntegrationApiRepo.getSlackConversations(jwt)
      .then((res) => {
        setChannels(res);

        return IntegrationApiRepo.getSlackProfile(jwt);
      })
      .then((res) => {
        if (res) setSelectedChannel(res.channelId);
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
      <Button href={buildOAuthUrl(accountId)}>{'Install'}</Button>
      <FormControl fullWidth>
        <InputLabel id="select-channel-label">Select Channel</InputLabel>
        <Select
          labelId="select-channel-label"
          id="select-channel"
          value={selectedChannel}
          label="Select Channel"
          onChange={handleChannelSelectChange}
        >
          {selectElements}
        </Select>
      </FormControl>
    </>
  );
};
