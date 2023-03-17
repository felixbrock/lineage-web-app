import appConfig from '../../../config';
import getApiClient from '../../api-client';
import LogicDto from './logic-dto';

// TODO - Implement Interface regarding clean architecture
export default class LogicApiRepository {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static client = getApiClient(appConfig.baseUrl.lineageService);

  static getOne = async (id: string): Promise<LogicDto | null> => {
    try {
      const response = await this.client.get(
        `/${LogicApiRepository.apiRoot}/${LogicApiRepository.version}/logic/${id}`
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
