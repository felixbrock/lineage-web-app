import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../config';
import {
  ExecutionType,
  MaterializationType,
  TestType,
} from '../../pages/test/test';
import { NominalTestSuiteDto, TestSuiteDto } from './test-suite-dto';

interface UpdateTestHistoryEntryDto {
  alertId: string;
  testType: string;
  userFeedbackIsAnomaly: string;
}

interface BaseTestSuiteProps {
  activated: boolean;
  type: TestType;
  databaseName: string;
  schemaName: string;
  materializationName: string;
  materializationType: MaterializationType;
  columnName?: string;
  targetResourceId: string;
  cron: string;
  executionType: ExecutionType;
}

export interface TestSuiteProps extends BaseTestSuiteProps {
  threshold: number;
}

export type NominalTestSuiteProps = BaseTestSuiteProps;

interface BaseUpdateTestSuiteObjProps {
  activated?: boolean;
  cron?: string;
  executionType?: ExecutionType;
}

interface UpdateTestSuiteObjProps extends BaseUpdateTestSuiteObjProps {
  threshold?: number;
}

interface BaseUpdateTestSuiteObject {
  id: string;
  props: BaseUpdateTestSuiteObjProps;
}

export interface UpdateTestSuiteObject
  extends Omit<BaseUpdateTestSuiteObject, 'props'> {
  props: UpdateTestSuiteObjProps;
}

export type UpdateNominalTestSuiteObject = BaseUpdateTestSuiteObject;

// TODO - Implement Interface regarding clean architecture
export default class ObservabilityApiRepo {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static baseUrl = appConfig.baseUrl.observabilityService;

  static postTestSuites = async (
    postTestSuiteObjects: TestSuiteProps[],
    jwt: string
  ): Promise<TestSuiteDto[]> => {
    try {
      const payload = { createObjects: postTestSuiteObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/test-suites`,
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

  static postNominalTestSuites = async (
    postTestSuiteObjects: NominalTestSuiteProps[],
    jwt: string
  ): Promise<NominalTestSuiteDto[]> => {
    try {
      const payload = { createObjects: postTestSuiteObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/nominal-test-suites`,
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

  static updateTestSuites = async (
    updateObjects: UpdateTestSuiteObject[],
    jwt: string
  ): Promise<void> => {
    try {
      const payload = { updateObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/test-suites`,
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

  static updateNominalTestSuites = async (
    updateObjects: UpdateNominalTestSuiteObject[],
    jwt: string
  ): Promise<void> => {
    try {
      const payload = { updateObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/nominal-test-suites`,
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

  static getTestSuites = async (jwt: string): Promise<TestSuiteDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/test-suites`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getNominalTestSuites = async (
    jwt: string
  ): Promise<NominalTestSuiteDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/nominal-test-suites`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateTestHistoryEntry = async (
    updateTestHistoryEntryDto: UpdateTestHistoryEntryDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = {
        userFeedbackIsAnomaly: updateTestHistoryEntryDto.userFeedbackIsAnomaly,
        testType: updateTestHistoryEntryDto.testType,
      };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/test-data/history/${updateTestHistoryEntryDto.alertId}`,
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
