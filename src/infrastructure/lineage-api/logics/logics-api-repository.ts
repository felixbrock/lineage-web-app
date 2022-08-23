import axios, { AxiosRequestConfig } from 'axios';
import { mode } from '../../../config';
import getRoot from '../../shared/api-root-builder';
import LogicDto from './logic-dto';

// TODO - Implement Interface regarding clean architecture
export default class LogicApiRepository {
  private static gateway =  mode === 'production' ? 'kga7x5r9la.execute-api.eu-central-1.amazonaws.com/production' : 'localhost:3000';

  private static path = 'api/v1';

  private static root = getRoot(LogicApiRepository.gateway, LogicApiRepository.path);

  public static getOne = async (
    id: string,
    jwt: string
  ): Promise<LogicDto | null> => {
    try {
      const apiRoot = await LogicApiRepository.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${apiRoot}/logic/${id}`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
