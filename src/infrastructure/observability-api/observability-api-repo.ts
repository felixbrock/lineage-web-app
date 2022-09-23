import axios, { AxiosRequestConfig } from 'axios';
import { mode } from '../../config';
import { MaterializationType, TestType } from '../../pages/test/test';
import getRoot from '../shared/api-root-builder';
import { NominalTestSuiteDto, TestSuiteDto } from './test-suite-dto';

interface UpdateTestHistoryEntryDto {
  alertId: string;
  userFeedbackIsAnomaly: string;
}

interface BaseTestSuiteProps {
  activated: boolean,
  type: TestType,
  executionFrequency: number,
  databaseName: string,
  schemaName: string,
  materializationName: string, 
  materializationType: MaterializationType,
  columnName?: string, 
  targetResourceId: string
  cron?: string
}

export interface TestSuiteProps extends BaseTestSuiteProps{
  threshold: number,
}

export type NominalTestSuiteProps = BaseTestSuiteProps

interface BaseUpdateTestSuiteObject {
  id: string;
  activated?: boolean;
  frequency?: number;
  cron?: string;
}

export interface UpdateTestSuiteObject extends BaseUpdateTestSuiteObject {
  threshold?: number;
}

export type UpdateNominalTestSuiteObject = BaseUpdateTestSuiteObject



// TODO - Implement Interface regarding clean architecture
export default class ObservabilityApiRepo {
  private static gateway =
    mode === 'production'
      ? 'ax4h0t5r59.execute-api.eu-central-1.amazonaws.com/production'
      : 'localhost:3012';

  private static path = 'api/v1';

  private static root = getRoot(
    ObservabilityApiRepo.gateway,
    ObservabilityApiRepo.path
  );

  public static postTestSuites = async (
    postTestSuiteObjects: TestSuiteProps[],
    jwt: string
  ): Promise<TestSuiteDto[]> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const payload = { createObjects: postTestSuiteObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${apiRoot}/test-suites`,
        payload,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static postNominalTestSuites = async (
    postTestSuiteObjects: NominalTestSuiteProps[],
    jwt: string
  ): Promise<NominalTestSuiteDto[]> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const payload = { createObjects: postTestSuiteObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${apiRoot}/nominal-test-suites`,
        payload,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateTestSuites = async (
    updateObjects: UpdateTestSuiteObject[],
    jwt: string
  ): Promise<void> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const payload = { updateObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${apiRoot}/test-suites`,
        payload,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateNominalTestSuites = async (
    updateObjects: UpdateNominalTestSuiteObject[],
    jwt: string
  ): Promise<void> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const payload = { updateObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${apiRoot}/nominal-test-suites`,
        payload,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getTestSuites = async (
    jwt: string
  ): Promise<TestSuiteDto[]> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${apiRoot}/test-suites`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static getNominalTestSuites = async (
    jwt: string
  ): Promise<NominalTestSuiteDto[]> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(`${apiRoot}/nominal-test-suites`, config);
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  public static updateTestHistoryEntry = async (
    updateTestHistoryEntryDto: UpdateTestHistoryEntryDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const data = {
        userFeedbackIsAnomaly: updateTestHistoryEntryDto.userFeedbackIsAnomaly,
      };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${apiRoot}/test-data/history/${updateTestHistoryEntryDto.alertId}`,
        data,
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
