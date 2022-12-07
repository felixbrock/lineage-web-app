import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../config';
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

  private static baseUrl = appConfig.baseUrl.integrationService;

  static getSlackProfile = async (jwt: string): Promise<SlackProfileDto | null> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSlackProfile = async (
    postSlackProfileDto: PostSlackProfileDto,
    jwt: string
  ): Promise<SlackProfileDto | undefined> => {
    try {
      const data = postSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
        data,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateSlackProfile = async (
    updateSlackProfileDto: UpdateSlackProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
        data,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getSlackConversations = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<SlackConversationInfoDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params,
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/conversations`,
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
    accessToken: string,
    jwt: string
  ): Promise<undefined> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/conversation/join`,
        { oldChannelId, newChannelId, accessToken },
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

  static postGithubProfile = async (
    postGithubProfileDto: PostGithubProfileDto,
    jwt: string
  ): Promise<string> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        postGithubProfileDto,
        config
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
    updateGithubProfileDto: UpdateGithubProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateGithubProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        data,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getGithubProfile = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<GithubProfileDto | undefined> => {
    try {
      const configuration: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        params,
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        configuration
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

  static getAccessToken = async (code: string, jwt: string): Promise<string> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/token`,
        { code },
        config
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

  static getSnowflakeProfile = async (
    jwt: string
  ): Promise<SnowflakeProfileDto | null> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateSnowflakeProfile = async (
    updateSnowflakeProfileDto: UpdateSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
        data,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSnowflakeProfile = async (
    postSnowflakeProfileDto: PostSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = postSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
        data,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSnowflakeEnvironment = async (jwt: string): Promise<unknown> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/init`,
        undefined,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static querySnowflake = async (
    query: string,
    jwt: string
  ): Promise<any> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/query`,
        {
          query,
        },
        config
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
