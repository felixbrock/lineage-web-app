import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../../config';
import LineageDto from './lineage-dto';

// TODO - Implement Interface regarding clean architecture
export default class LineageApiRepository {
  private version = 'v1';
  
  private apiRoot =  'api';

  private baseUrl = appConfig.baseUrl.lineageService;

  getOne = async (
    id: string,
    jwt: string
  ): Promise<LineageDto | null> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${this.baseUrl}/${this.apiRoot}/${this.version}/lineage/${id}`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  getLatest = async (jwt: string, tolerateIncomplete: boolean): Promise<LineageDto | null> => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params: new URLSearchParams({ tolerateIncomplete: tolerateIncomplete.toString() }),
      };

      const response = await axios.get(`${this.baseUrl}/${this.apiRoot}/${this.version}/lineage/`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  create = async (jwt: string) => {
    try {
      

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${this.baseUrl}/${this.apiRoot}/${this.version}/lineage/`,
        undefined,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
