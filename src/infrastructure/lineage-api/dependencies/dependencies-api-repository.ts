import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import DependencyDto from './dependency-dto';

// TODO - Implement Interface regarding clean architecture
export default class DependenciesApiRepository {
  private static version = 'v1';
  
  private static apiRoot =  'api';

  private static baseUrl = appConfig.baseUrl.lineageService;

  static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<DependencyDto[]> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${DependenciesApiRepository.baseUrl}/${DependenciesApiRepository.apiRoot}/${DependenciesApiRepository.version}/dependencies`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
