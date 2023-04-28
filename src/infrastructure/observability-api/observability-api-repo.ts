import appConfig from '../../config';

import { CustomThreshold } from '../../pages/test/components/custom-threshold';
import {
  EXECUTION_TYPE,
  TEST_TYPES,
  MATERIALIZATION_TYPE,
} from '../../pages/test/config';
import { QualTestSuiteDto, TestSuiteDto } from './test-suite-dto';
import getApiClient from '../api-client';

type ExecutionType = typeof EXECUTION_TYPE;
type MaterializationType = typeof MATERIALIZATION_TYPE;
type TestType = typeof TEST_TYPES[number];

export const customThresholdModes = ['absolute', 'relative'] as const;
export type CustomThresholdMode = typeof customThresholdModes[number];

interface PostAnomalyFeedbackDto {
  alertId: string;
  testType: string;
  userFeedbackIsAnomaly: string;
  testSuiteId?: string;
  detectedValue?: string;
  thresholdType?: string;
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

export type CreateQuantTestSuiteProps = CreateTestSuiteBaseProps;

export type CreateQualTestSuiteProps = CreateTestSuiteBaseProps;

interface BaseUpdateTestSuiteObjProps {
  activated?: boolean;
  cron?: string;
  executionType?: ExecutionType;
  lastAlertSent?: string;
}

interface UpdateTestSuiteObjProps extends BaseUpdateTestSuiteObjProps {
  customLowerThreshold?: CustomThreshold;
  customUpperThreshold?: CustomThreshold;
  feedbackLowerThreshold?: number;
  feedbackUpperThreshold?: number;
}

export interface UpdateTestSuiteObject {
  id: string;
  props: UpdateTestSuiteObjProps;
}

export interface UpdateQualTestSuiteObject {
  id: string;
  props: BaseUpdateTestSuiteObjProps;
}

// TODO - Implement Interface regarding clean architecture
export default class ObservabilityApiRepo {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static client = getApiClient(appConfig.baseUrl.observabilityService);

  static postTestSuites = async (
    props: CreateQuantTestSuiteProps[]
  ): Promise<TestSuiteDto[]> => {
    try {
      const payload = { createObjects: props };

      const response = await this.client.post(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/test-suites`,
        payload
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postQualTestSuites = async (
    postTestSuiteObjects: CreateQualTestSuiteProps[]
  ): Promise<QualTestSuiteDto[]> => {
    try {
      const payload = { createObjects: postTestSuiteObjects };

      const response = await this.client.post(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/qual-test-suites`,
        payload
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateTestSuites = async (
    updateObjects: UpdateTestSuiteObject[]
  ): Promise<void> => {
    try {
      const payload = { updateObjects };

      const response = await this.client.patch(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/test-suites`,
        payload
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateQualTestSuites = async (
    updateObjects: UpdateQualTestSuiteObject[]
  ): Promise<void> => {
    try {
      const payload = { updateObjects };

      const response = await this.client.patch(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/qual-test-suites`,
        payload
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getTestSuites = async (): Promise<TestSuiteDto[]> => {
    try {
      const response = await this.client.get(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/test-suites`
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static getQualTestSuites = async (): Promise<QualTestSuiteDto[]> => {
    try {
      const response = await this.client.get(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/qual-test-suites`
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static adjustDetectedAnomaly = async (
    postAnomalyFeedbackDto: PostAnomalyFeedbackDto
  ): Promise<unknown> => {
    try {
      const data = { ...postAnomalyFeedbackDto };

      const response = await this.client.post(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/anomaly/feedback`,
        data
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };
}
