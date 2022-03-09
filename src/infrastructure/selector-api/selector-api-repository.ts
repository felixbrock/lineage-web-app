import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../shared/api-root-builder';
import SelectorDto from './selector-dto';

// TODO - Implement Interface regarding clean architecture
export default class SelectorApiRepositoryImpl {
  private static root = getRoot('selector', '3000', 'api/v1');

  public static getOne = async (
    selectorId: string,
    jwt: string
  ): Promise<SelectorDto | null> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${apiRoot}/selector/${selectorId}`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getBy = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<SelectorDto[]> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/selectors`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (
    content: string,
    systemId: string,
    jwt: string
  ): Promise<SelectorDto | null> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(`${apiRoot}/selector`, { content, systemId }, config);
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (
    selectorId: string,
    jwt: string
  ): Promise<boolean> => {
    try {
      const apiRoot = await SelectorApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.delete(
        `${apiRoot}/selector/${selectorId}`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
