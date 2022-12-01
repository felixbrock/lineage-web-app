import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import LogicDto from './logic-dto';

// TODO - Implement Interface regarding clean architecture
export default class LogicApiRepository {
  private version = 'v1';
  
  private apiRoot =  'api';

  private baseUrl = appConfig.baseUrl.lineageService;

  getOne = async (
    id: string,
    jwt: string
  ): Promise<LogicDto | null> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${this.baseUrl}/${this.apiRoot}/${this.version}/logic/${id}`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
