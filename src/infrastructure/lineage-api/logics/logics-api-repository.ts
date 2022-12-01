import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import LogicDto from './logic-dto';

// TODO - Implement Interface regarding clean architecture
export default class LogicApiRepository {
  private static version = 'v1';
  
  private static apiRoot =  'api';

  private static baseUrl = appConfig.baseUrl.lineageService;

  static getOne = async (
    id: string,
    jwt: string
  ): Promise<LogicDto | null> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${LogicApiRepository.baseUrl}/${LogicApiRepository.apiRoot}/${LogicApiRepository.version}/logic/${id}`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
