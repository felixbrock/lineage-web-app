import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import { consumeStream, uint8ArrayToString, writeToCache } from '../../cache';
import DependencyDto from './dependency-dto';

// TODO - Implement Interface regarding clean architecture
export default class DependenciesApiRepository {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static baseUrl = appConfig.baseUrl.lineageService;

  static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<DependencyDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
        baseURL: DependenciesApiRepository.baseUrl,
      };
      const url = `/${DependenciesApiRepository.apiRoot}/${DependenciesApiRepository.version}/dependencies`;

      const fullUrl = `${config.baseURL}${url}${params.toString()}`;

      const cachedRes = await caches.match(fullUrl);

      if (cachedRes) {
        if (!cachedRes.body) throw new Error('No body in cached response');
        const data = await consumeStream(cachedRes.body);

        const mats = JSON.parse(uint8ArrayToString(data));
        return mats;
      } else {
        const response = await axios.get(url, config);
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
