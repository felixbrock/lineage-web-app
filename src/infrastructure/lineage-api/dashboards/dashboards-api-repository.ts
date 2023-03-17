import { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import getApiClient from '../../api-client';
import { consumeStream, uint8ArrayToString, writeToCache } from '../../cache';
import DashboardDto from './dashboard-dto';

// TODO - Implement Interface regarding clean architecture
export default class DashboardsApiRepository {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static client = getApiClient(appConfig.baseUrl.lineageService);

  static getBy = async (params: URLSearchParams): Promise<DashboardDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        params,
      };
      const url = `/${DashboardsApiRepository.apiRoot}/${DashboardsApiRepository.version}/dashboards`;

      const fullUrl = `${config.baseURL}${url}${params.toString()}`;

      const cachedRes = await caches.match(fullUrl);

      if (cachedRes) {
        if (!cachedRes.body) throw new Error('No body in cached response');
        const data = await consumeStream(cachedRes.body);

        const mats = JSON.parse(uint8ArrayToString(data));
        return mats;
      } else {
        const response = await this.client.get(url, config);
        const jsonResponse = response.data;
        if (response.status === 200) {
          await writeToCache(fullUrl, response, 'lineage');
          return jsonResponse;
        }
        throw new Error(jsonResponse);
      }
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
