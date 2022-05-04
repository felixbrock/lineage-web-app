import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../../shared/api-root-builder';
import ColumnDto from './column-dto';

// TODO - Implement Interface regarding clean architecture
export default class ColumnsApiRepository {
  private static root = getRoot('columns', '3000', 'api/v1');

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<ColumnDto[]> => {
    try {
      const apiRoot = await ColumnsApiRepository.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/columns`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
