import axios, { AxiosRequestConfig } from 'axios';
import getRoot from '../shared/api-root-builder';
import AutomationDto from './automation-dto';
import SubscriptionDto from './subscription-dto';

export interface UpdateSubscriptionRequestObject {
  selectorId: string;
  alertsAccessedOnByUser: number;
}

// TODO - Implement Interface regarding clean architecture
export default class AutomationApiRepositoryImpl {
  private static root = getRoot('automation', '8080', 'api/v1');

  public static getOne = async (
    automationId: string,
    jwt: string
  ): Promise<AutomationDto | null> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${apiRoot}/automation/${automationId}`,
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
  ): Promise<AutomationDto[]> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.get(`${apiRoot}/automations`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static post = async (
    name: string,
    jwt: string
  ): Promise<AutomationDto | null> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${apiRoot}/automation`,
        { name },
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static delete = async (
    automationId: string,
    jwt: string
  ): Promise<boolean> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.delete(
        `${apiRoot}/automation/${automationId}`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return true;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static postSubscription = async (
    automationId: string,
    systemId: string,
    selectorId: string,
    jwt: string
  ): Promise<SubscriptionDto | null> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${apiRoot}/automation/${automationId}/subscription`,
        { systemId, selectorId },
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateSubscriptions = async (
    automationId: string,
    subscriptions: UpdateSubscriptionRequestObject[],
    jwt: string
  ): Promise<SubscriptionDto[]> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${apiRoot}/automation/${automationId}/subscriptions`,
        { subscriptions },
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static deleteSubscription = async (
    automationId: string,
    params: URLSearchParams,
    jwt: string
  ): Promise<boolean> => {
    try {
      const apiRoot = await AutomationApiRepositoryImpl.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
        params,
      };

      const response = await axios.delete(
        `${apiRoot}/automation/${automationId}/subscription`,
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
