import { AxiosRequestConfig } from 'axios';
import appConfig from '../../config';
import getApiClient from '../api-client';
import AccountDto from './account-dto';

// TODO - Implement Interface regarding clean architecture
export default class AccountApiRepo {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static client = getApiClient(appConfig.baseUrl.accountService);

  static getBy = async (params: URLSearchParams): Promise<AccountDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        params,
      };

      const response = await this.client.get(
        `/${AccountApiRepo.apiRoot}/${AccountApiRepo.version}/accounts`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
