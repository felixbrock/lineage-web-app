import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../shared/api-root-builder';
import SlackProfileDto from './slack-profile-dto';

interface PostSlackProfileDto {
  accessToken: string;
  workspaceId: string;
  channelId: string;
}

interface UpdateSlackProfileDto {
  accessToken?: string;
  workspaceId?: string;
  channelId?: string;
}

// TODO - Implement Interface regarding clean architecture
export default class IntegrationApiRepo {
  private static root = getRoot('integration', '3002', 'api/v1');

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
  ): Promise<unknown> => {
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
}
