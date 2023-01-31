import axios, { AxiosRequestConfig } from 'axios';
import appConfig from '../../config';
import {
  ExecutionType,
  MaterializationType,
  TestType,
} from '../../pages/test/test';
import { QualTestSuiteDto, TestSuiteDto } from './test-suite-dto';

interface PostAnomalyFeedbackDto {
  alertId: string;
  testType: string;
  userFeedbackIsAnomaly: string;
  testSuiteId?: string;
  importance?: string;
  boundsIntervalRelative?: string;
}

interface CreateTestSuiteBaseProps {
  activated: boolean;
  cron: string;
  executionType: ExecutionType;
  databaseName: string;
  schemaName: string;
  materializationName: string;
  columnName?: string;
  materializationType: MaterializationType;
  targetResourceId: string;
  type: TestType;
}

export interface CreateQuantTestSuiteProps extends CreateTestSuiteBaseProps {
  threshold: number;
}

export type CreateQualTestSuiteProps = CreateTestSuiteBaseProps;

interface BaseUpdateTestSuiteObjProps {
  activated?: boolean;
  cron?: string;
  executionType?: ExecutionType;
}

interface UpdateTestSuiteObjProps extends BaseUpdateTestSuiteObjProps {
  threshold?: number;
  importanceThreshold?: number;
  boundsIntervalRelative?: number;
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
    props: CreateQuantTestSuiteProps[],
    jwt: string
  ): Promise<TestSuiteDto[]> => {
    try {
      const payload = { createObjects: props };

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
    postTestSuiteObjects: CreateQualTestSuiteProps[],
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

  static adjustDetectedAnomaly = async (
    postAnomalyFeedbackDto: PostAnomalyFeedbackDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = {
        alertId: postAnomalyFeedbackDto.alertId,
        testSuiteId: postAnomalyFeedbackDto.testSuiteId,
        userFeedbackIsAnomaly: postAnomalyFeedbackDto.userFeedbackIsAnomaly,
        testType: postAnomalyFeedbackDto.testType,
        importance: postAnomalyFeedbackDto.importance,
        boundsIntervalRelative: postAnomalyFeedbackDto.boundsIntervalRelative,
      };

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${ObservabilityApiRepo.baseUrl}/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/anomaly/feedback`,
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
