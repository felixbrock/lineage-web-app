import { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import getApiClient from '../../api-client';
import LineageDto from './lineage-dto';

// TODO - Implement Interface regarding clean architecture
export default class LineageApiRepository {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static client = getApiClient(appConfig.baseUrl.lineageService);

  static getOne = async (id: string): Promise<LineageDto | null> => {
    try {
      const response = await this.client.get(
        `/${LineageApiRepository.apiRoot}/${LineageApiRepository.version}/lineage/${id}`
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getLatest = async (
    tolerateIncomplete: boolean,
    minuteTolerance?: number
  ): Promise<LineageDto | null> => {
    try {
      const params = new URLSearchParams({
        tolerateIncomplete: tolerateIncomplete.toString(),
      });

      if (minuteTolerance) {
        params.append('minuteTolerance', minuteTolerance.toString());
      }

      const config: AxiosRequestConfig = {
        params,
      };

      const response = await this.client.get(
        `/${LineageApiRepository.apiRoot}/${LineageApiRepository.version}/lineage/`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static create = async () => {
    try {
      const response = await this.client.post(
        `/${LineageApiRepository.apiRoot}/${LineageApiRepository.version}/lineage/`,
        undefined
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
