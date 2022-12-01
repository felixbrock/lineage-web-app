import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import MaterializationDto from './materialization-dto';

// TODO - Implement Interface regarding clean architecture
export default class MaterializationsApiRepository {
  private version = 'v1';
  
  private apiRoot =  'api';

  private baseUrl = appConfig.baseUrl.lineageService;

  getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<MaterializationDto[]> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${this.baseUrl}/${this.apiRoot}/${this.version}/materializations`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
