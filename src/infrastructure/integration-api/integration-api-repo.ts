import { AxiosRequestConfig } from 'axios';
import appConfig from '../../config';
import getApiClient from '../api-client';
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
  warehouseName: string;
}

interface UpdateSnowflakeProfileDto {
  accountId?: string;
  username?: string;
  password?: string;
  warehouseName?: string;
}

interface PostGithubProfileDto {
  installationId: string;
  organizationId: string;
  repositoryNames: string[];
}

interface UpdateGithubProfileDto {
  installationId?: string;
}

// TODO - Implement Interface regarding clean architecture
export default class IntegrationApiRepo {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static client = getApiClient(appConfig.baseUrl.integrationService);

  static getSlackProfile = async (): Promise<SlackProfileDto | null> => {
    try {
      const response = await this.client.get(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSlackProfile = async (
    postSlackProfileDto: PostSlackProfileDto
  ): Promise<SlackProfileDto | undefined> => {
    try {
      const data = postSlackProfileDto;

      const response = await this.client.post(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
        data
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateSlackProfile = async (
    updateSlackProfileDto: UpdateSlackProfileDto
  ): Promise<unknown> => {
    try {
      const data = updateSlackProfileDto;

      const response = await this.client.patch(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
        data
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getSlackConversations = async (
    params: URLSearchParams
  ): Promise<SlackConversationInfoDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        params,
      };

      const response = await this.client.get(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/conversations`,
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse) throw new Error('Did not receive slack conversations');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static joinSlackConversation = async (
    oldChannelId: string,
    newChannelId: string,
    accessToken: string
  ): Promise<undefined> => {
    try {
      const response = await this.client.post(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/conversation/join`,
        { oldChannelId, newChannelId, accessToken }
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

  static postGithubProfile = async (
    postGithubProfileDto: PostGithubProfileDto
  ): Promise<string> => {
    try {
      const response = await this.client.post(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        postGithubProfileDto
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      if (!jsonResponse) throw new Error('Github profile creation failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static updateGithubProfile = async (
    updateGithubProfileDto: UpdateGithubProfileDto
  ): Promise<unknown> => {
    try {
      const data = updateGithubProfileDto;

      const response = await this.client.patch(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        data
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getGithubProfile = async (
    params: URLSearchParams
  ): Promise<GithubProfileDto | undefined> => {
    try {
      const config: AxiosRequestConfig = {
        params,
      };

      const response = await this.client.get(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        config
      );

      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse.message);
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static getAccessToken = async (code: string): Promise<string> => {
    try {
      const response = await this.client.post(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/token`,
        { code }
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      if (!jsonResponse)
        throw new Error('Github access token retrieval failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static getSnowflakeProfile =
    async (): Promise<SnowflakeProfileDto | null> => {
      try {
        const response = await this.client.get(
          `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`
        );
        const jsonResponse = response.data;
        if (response.status === 200) return jsonResponse;
        throw new Error(jsonResponse);
      } catch (error: any) {
        return Promise.reject(new Error(error.response.data.message));
      }
    };

  static updateSnowflakeProfile = async (
    updateSnowflakeProfileDto: UpdateSnowflakeProfileDto
  ): Promise<unknown> => {
    try {
      const data = updateSnowflakeProfileDto;

      const response = await this.client.patch(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
        data
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSnowflakeProfile = async (
    postSnowflakeProfileDto: PostSnowflakeProfileDto
  ): Promise<unknown> => {
    try {
      const data = postSnowflakeProfileDto;

      const response = await this.client.post(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
        data
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSnowflakeEnvironment = async (): Promise<unknown> => {
    try {
      const response = await this.client.post(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/init`,
        undefined
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static querySnowflake = async (query: string): Promise<any> => {
    try {
      const response = await this.client.post(
        `/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/query`,
        {
          query,
        }
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      if (!jsonResponse) throw new Error('Querying snowflake failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };
}
