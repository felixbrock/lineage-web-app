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
  private version = 'v1';

  private apiRoot = 'api';

  private baseUrl = appConfig.baseUrl.integrationService;

  getSlackProfile = async (jwt: string): Promise<SlackProfileDto | null> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/slack/profile`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  postSlackProfile = async (
    postSlackProfileDto: PostSlackProfileDto,
    jwt: string
  ): Promise<SlackProfileDto | undefined> => {
    try {
      const data = postSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/slack/profile`,
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

  updateSlackProfile = async (
    updateSlackProfileDto: UpdateSlackProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/slack/profile`,
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

  getSlackConversations = async (
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
        `${this.baseUrl}/${this.apiRoot}/${this.version}/slack/conversations`,
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

  joinSlackConversation = async (
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
        `${this.baseUrl}/${this.apiRoot}/${this.version}/slack/conversation/join`,
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

  postGithubProfile = async (
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
        `${this.baseUrl}/${this.apiRoot}/${this.version}/github/profile`,
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

  updateGithubProfile = async (
    updateGithubProfileDto: UpdateGithubProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateGithubProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/github/profile`,
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

  getGithubProfile = async (
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
        `${this.baseUrl}/${this.apiRoot}/${this.version}/github/profile`,
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

  getAccessToken = async (code: string, jwt: string): Promise<string> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/github/token`,
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

  querySnowflake = async (
    query: string,
    targetOrgId: string,
    jwt: string
  ): Promise<any> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/snowflake/query`,
        {
          query,
          targetOrgId,
        },
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse) throw new Error('Querying snowflake failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  getSnowflakeProfile = async (
    jwt: string
  ): Promise<SnowflakeProfileDto | null> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/snowflake/profile`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  updateSnowflakeProfile = async (
    updateSnowflakeProfileDto: UpdateSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/snowflake/profile`,
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

  postSnowflakeProfile = async (
    postSnowflakeProfileDto: PostSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = postSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/snowflake/profile`,
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

  postSnowflakeEnvironment = async (jwt: string): Promise<unknown> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/snowflake/init`,
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
}
