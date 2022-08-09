import axios, { AxiosRequestConfig } from 'axios';
import ChannelInfoDto from './slack-channel-info-dto';

// TODO - Implement Interface regarding clean architecture
export default class SlackConversationsRepo {
  public static getConversations = async (
    accessToken: string
  ): Promise<ChannelInfoDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: new URLSearchParams({
          token: accessToken
        }),
      };

      const response = await axios.get(
        'https://slack.com/api/conversations.list',
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse)
        throw new Error('Did not receive slack conversations');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };
}