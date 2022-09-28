import axios, { AxiosRequestConfig } from 'axios';

export interface RepositoryDto {
  full_name: string;
  [key: string]: any;
}

// TODO - Implement Interface regarding clean architecture
export default class GithubApiRepo {
  public static getRepositories = async (
    token: string,
    installation: string
  ): Promise<RepositoryDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `token ${token}`,
        },
      };

      const response = await axios.get(
        `https://api.github.com/user/installations/${installation}/repositories`,
        config
      );

      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);

      if (!jsonResponse) return [];

      return jsonResponse.repositories;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };
}
