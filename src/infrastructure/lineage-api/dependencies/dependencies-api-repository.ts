import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import DependencyDto from './dependency-dto';

// TODO - Implement Interface regarding clean architecture
export default class DependenciesApiRepository {
  private version = 'v1';
  
  private apiRoot =  'api';

  private baseUrl = appConfig.baseUrl.lineageService;

  getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<DependencyDto[]> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${this.baseUrl}/${this.apiRoot}/${this.version}/dependencies`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
