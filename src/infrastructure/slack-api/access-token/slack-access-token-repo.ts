import axios, { AxiosRequestConfig } from 'axios';
import { slackClientId, slackClientSecret } from '../../../config';

// TODO - Implement Interface regarding clean architecture
export default class SlackAccessTokenRepo {
  public static getAccessToken = async (
    tempAuthCode: string
  ): Promise<string> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: new URLSearchParams({
          code: tempAuthCode,
          client_id: slackClientId,
          client_secret: slackClientSecret
        }),
      };

      const response = await axios.post(
        'https://slack.com/api/oauth.v2.access',
        undefined,
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse.access_token)
        throw new Error('Did not receive an access token');
      return jsonResponse.access_token;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };
}
