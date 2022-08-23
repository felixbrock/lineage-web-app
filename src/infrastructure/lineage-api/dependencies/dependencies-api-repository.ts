import axios, { AxiosRequestConfig } from 'axios';
import { mode } from '../../../config';
import getRoot from '../../shared/api-root-builder';
import DependencyDto from './dependency-dto';

// TODO - Implement Interface regarding clean architecture
export default class DependenciesApiRepository {
  private static gateway =  mode === 'production' ? 'kga7x5r9la.execute-api.eu-central-1.amazonaws.com/production' : 'localhost:3000';

  private static path = 'api/v1';

  private static root = getRoot(DependenciesApiRepository.gateway, DependenciesApiRepository.path);

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<DependencyDto[]> => {
    try {
      const apiRoot = await DependenciesApiRepository.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/dependencies`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
