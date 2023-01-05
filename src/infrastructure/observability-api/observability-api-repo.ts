import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../config';
import {
  ExecutionType,
  MaterializationType,
  TestType,
} from '../../pages/test/test';
import { QualTestSuiteDto, TestSuiteDto } from './test-suite-dto';

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

export type QualTestSuiteProps = BaseTestSuiteProps;

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

export type UpdateQualTestSuiteObject = BaseUpdateTestSuiteObject;

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

  static postQualTestSuites = async (
    postTestSuiteObjects: QualTestSuiteProps[],
    jwt: string
  ): Promise<QualTestSuiteDto[]> => {
    try {
      const payload = { createObjects: postTestSuiteObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/qual-test-suites`,
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

  static updateQualTestSuites = async (
    updateObjects: UpdateQualTestSuiteObject[],
    jwt: string
  ): Promise<void> => {
    try {
      const payload = { updateObjects };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/qual-test-suites`,
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

  static getQualTestSuites = async (
    jwt: string
  ): Promise<QualTestSuiteDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/qual-test-suites`,
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
