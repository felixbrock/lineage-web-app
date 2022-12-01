import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import MaterializationDto from './materialization-dto';

// TODO - Implement Interface regarding clean architecture
export default class MaterializationsApiRepository {
  private static version = 'v1';
  
  private static apiRoot =  'api';

  private static baseUrl = appConfig.baseUrl.lineageService;

  static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<MaterializationDto[]> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${MaterializationsApiRepository.baseUrl}/${MaterializationsApiRepository.apiRoot}/${MaterializationsApiRepository.version}/materializations`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
