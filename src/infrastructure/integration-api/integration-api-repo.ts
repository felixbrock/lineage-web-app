import axios, { AxiosRequestConfig } from 'axios';
import { mode } from '../../config';
import getRoot from '../shared/api-root-builder';
import GithubProfileDto from './github-profile-dto';
import SlackConversationInfoDto from './slack-channel-info-dto';
import SlackProfileDto from './slack-profile-dto';
import SnowflakeProfileDto from './snowflake-profile-dto';

interface PostSlackProfileDto {
  accessToken: string;
  channelId: string;
  channelName: string;
}

interface UpdateSlackProfileDto {
  accessToken?: string;
  channelId?: string;
  channelName?: string;
}


interface PostSnowflakeProfileDto {
  accountId: string;
  username: string;
  password: string;
}

interface UpdateSnowflakeProfileDto {
  accountId?: string;
  username?: string;
  password?: string;
}

// TODO - Implement Interface regarding clean architecture
export default class IntegrationApiRepo {
  private static gateway =  mode === 'production' ? 'wej7xjkvug.execute-api.eu-central-1.amazonaws.com/production' : 'localhost:3002';

  private static path = 'api/v1';

  private static root = getRoot(IntegrationApiRepo.gateway, IntegrationApiRepo.path);

  public static getSlackProfile = async (
    jwt: string
  ): Promise<SlackProfileDto | null> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${apiRoot}/slack/profile`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static postSlackProfile = async (
    postSlackProfileDto: PostSlackProfileDto,
    jwt: string
  ): Promise<SlackProfileDto | undefined> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const data = postSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(`${apiRoot}/slack/profile`, data, config);
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateSlackProfile = async (
    updateSlackProfileDto: UpdateSlackProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const data = updateSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(`${apiRoot}/slack/profile`, data, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getSlackConversations = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<SlackConversationInfoDto[]> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        params
      };

      const response = await axios.get(
        `${apiRoot}/slack/conversations`,
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

  public static joinSlackConversation = async (
    oldChannelId: string,
    newChannelId: string,
    accessToken: string,
    jwt: string
  ): Promise<undefined> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      };

      const response = await axios.post(
        `${apiRoot}/slack/conversation/join`, {oldChannelId, newChannelId, accessToken},
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  public static createGithubProfile = async (
    installationId: string,
    organizationId: string,
    repositoryNames: string[],
    jwt: string
  ): Promise<string> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      };

      const response = await axios.post(
        `${apiRoot}/github/profile`, 
        {
          installationId,
          organizationId,
          repositoryNames
        },
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      if (!jsonResponse)
        throw new Error('Github profile creation failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };


  public static readGithubProfile = async (
    installationId: string,
    jwt: string
  ): Promise<GithubProfileDto> => {
    try {

      const apiRoot = await IntegrationApiRepo.root;

      const configuration: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
        params: {
          installationId
        }
      };

      const response = await axios.get(
        `${apiRoot}/github/profile`,
        configuration
      );

      const jsonResponse = response.data;
      console.log(jsonResponse);
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse.message);

    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  public static querySnowflake = async (
    query: string,
    targetOrganizationId: string,  
    jwt: string
  ): Promise<any> => {

    try {
      const apiRoot = await IntegrationApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      };

      const response = await axios.post(
        `${apiRoot}/snowflake/query`, 
        {
         query,
         targetOrganizationId
        },
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse)
        throw new Error('Querying snowflake failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };


public static getSnowflakeProfile = async (
    jwt: string
  ): Promise<SnowflakeProfileDto | null> => {
try {
      const apiRoot = await IntegrationApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${apiRoot}/snowflake/profile`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateSnowflakeProfile = async (
    updateSnowflakeProfileDto: UpdateSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const data = updateSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(`${apiRoot}/snowflake/profile`, data, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static postSnowflakeProfile = async (
    postSnowflakeProfileDto: PostSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const apiRoot = await IntegrationApiRepo.root;

      const data = postSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(`${apiRoot}/snowflake/profile`, data, config);
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
