import axios, { AxiosRequestConfig } from 'axios';
import { mode } from '../../config';
import getRoot from '../shared/api-root-builder';
import AccountDto from './account-dto';

// TODO - Implement Interface regarding clean architecture
export default class AccountApiRepo {
  private static gateway =  mode === 'production' ? 'p2krek4fsj.execute-api.eu-central-1.amazonaws.com/production' : 'localhost:8081';

  private static path = 'api/v1';

  private static root = getRoot(AccountApiRepo.gateway, AccountApiRepo.path);

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<AccountDto[]> => {
    try {
      const apiRoot = await AccountApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/accounts`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
