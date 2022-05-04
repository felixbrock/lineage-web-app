import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../../shared/api-root-builder';
import DependencyDto from './dependency-dto';

// TODO - Implement Interface regarding clean architecture
export default class DependenciesApiRepository {
  private static root = getRoot('dependencies', '3000', 'api/v1');

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
