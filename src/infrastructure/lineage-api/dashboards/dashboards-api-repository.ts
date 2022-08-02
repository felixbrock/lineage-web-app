import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../../shared/api-root-builder';
import DashboardDto from './dashboard-dto';

// TODO - Implement Interface regarding clean architecture
export default class DashboardsApiRepository {
  private static root = getRoot('dashboards', '3000', 'api/v1');

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<DashboardDto[]> => {
    try {
      const apiRoot = await DashboardsApiRepository.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/dashboards`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
