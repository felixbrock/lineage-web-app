import { AxiosRequestConfig } from 'axios';
import { TestHistoryEntry } from '../../components/metrics-graph';
import appConfig from '../../config';
import { CustomThreshold } from '../../pages/test/components/custom-threshold';
import getApiClient from '../api-client';
import { EXECUTION_TYPE, TEST_TYPES, MATERIALIZATION_TYPE } from '../../pages/test/config';
import { CustomTestSuiteDto, QualTestSuiteDto, TestSuiteDto } from './test-suite-dto';

export const customThresholdModes = ['absolute', 'relative'] as const;
export type CustomThresholdMode = typeof customThresholdModes[number];

type ExecutionType = typeof EXECUTION_TYPE;
type MaterializationType = typeof MATERIALIZATION_TYPE;
type TestType = typeof TEST_TYPES[number];

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

interface CreateCustomTestSuiteProps {
  activated: boolean;
  cron: string;
  name: string;
  description?: string;
  sqlLogic: string;
  executionType: ExecutionType;
  targetResourceIds: string[];
};

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

interface UpdateCustomTestSuiteObjProps extends BaseUpdateTestSuiteObjProps {
  name?: string;
  description?: string;
  sqlLogic?: string;
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

export interface UpdateCustomTestSuiteObject {
  id: string;
  props: UpdateCustomTestSuiteObjProps;
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

  static postCustomTestSuite = async (
    postCustomTestSuiteObject: CreateCustomTestSuiteProps
  ): Promise<CustomTestSuiteDto> => {
    try {
      const payload = postCustomTestSuiteObject;

      const response = await this.client.post(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/custom-test-suite`,
        payload
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  }

  static updateCustomTestSuite = async (
    updateCustomTestSuiteObject: UpdateCustomTestSuiteObject
  ): Promise<void> => {
    try {
      const id = updateCustomTestSuiteObject.id;
      const payload = updateCustomTestSuiteObject.props;

      const response = await this.client.patch(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/custom-test-suite/${id}`,
        payload
      );

      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static deleteCustomTestSuite = async (
    id: string,
    mode: string
  ): Promise<void> => {
    try {
      const params = new URLSearchParams({
        mode
      });

      const config: AxiosRequestConfig = {
        params
      };

      const response = await this.client.delete(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/custom-test-suite/${id}`, config
      );
      
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
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

  static getCustomTestSuites = async (): Promise<CustomTestSuiteDto[]> => {
    try {
      const response = await this.client.get(
        `/${ObservabilityApiRepo.apiRoot}/${ObservabilityApiRepo.version}/custom-test-suites`
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  }

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

  static getSelectionTestHistories = async (
    testSuiteReps: {
      id: string;
      type: string;
    }[],
  ): Promise<TestHistoryEntry[]> => {
    const testHistory = testSuiteReps.reduce(
      (
        accumulation: { [testSuiteId: string]: TestHistoryEntry },
        el
      ): { [testSuiteId: string]: TestHistoryEntry } => {
        const localAcc = accumulation;

        localAcc[el.id] = {
          testType: el.type,
          testSuiteId: el.id,
          historyDataSet: [],
        };

        return localAcc;
      },
      {}
    );

    const ids = Object.values(testHistory).map(el => el.testSuiteId);

    const params = new URLSearchParams({
      ids: JSON.stringify(ids)
    })

    const config: AxiosRequestConfig = {
      params
    }

    const response = await this.client.get(
      `/${this.apiRoot}/${this.version}/front-end/history`, config);
    const testHistoryResults = await response.data;

    if (response.status !== 200) throw new Error(testHistoryResults);

    if (!testHistoryResults || testHistoryResults === null) return [];

    const results: { [key: string]: unknown }[] =
      testHistoryResults.reverse();

    results.forEach((el: { [key: string]: unknown }) => {
      const {
        value,
        test_suite_id: entryTestSuiteId,
        executed_on: executedOn,
        expected_value_upper_bound: valueUpperBound,
        expected_value_lower_bound: valueLowerBound,
        is_anomaly: isAnomaly,
        user_feedback_is_anomaly: userFeedbackIsAnomaly,
      } = el;

      const isOptionalOfType = <T>(
        val: unknown,
        targetType:
          | 'string'
          | 'number'
          | 'bigint'
          | 'boolean'
          | 'symbol'
          | 'undefined'
          | 'object'
          | 'function'
      ): val is T => val === null || typeof val === targetType;

      const isAnomalyValue = typeof isAnomaly === 'string' ? JSON.parse(isAnomaly) : isAnomaly;

      let valueLowerBoundNum = valueLowerBound;
      if (!valueLowerBound) valueLowerBoundNum = null;

      let valueUpperBoundNum = valueUpperBound;
      if (!valueUpperBound) valueUpperBoundNum = null;

      if (
        typeof value !== 'number' ||
        typeof entryTestSuiteId !== 'string' ||
        typeof executedOn !== 'string' ||
        typeof isAnomalyValue !== 'boolean' ||
        typeof userFeedbackIsAnomaly !== 'number' ||
        !isOptionalOfType<number>(valueLowerBoundNum, 'number') ||
        !isOptionalOfType<number>(valueUpperBoundNum, 'number')
      )
        throw new Error('Received unexpected type');

      testHistory[entryTestSuiteId].historyDataSet.push({
        isAnomaly: isAnomalyValue,
        userFeedbackIsAnomaly,
        timestamp: executedOn,
        valueLowerBound: valueLowerBoundNum,
        valueUpperBound: valueUpperBoundNum,
        value,
      });
    });

    return Object.values(testHistory);
  };

  static getTestSuiteData = async (
    targetResourceId: string,
    activated: boolean,
  ): Promise<Document[]> => {

    const params = {
      targetResourceId,
      activated: activated.toString()
    };

    const config: AxiosRequestConfig = {
      params
    }

    const response = await this.client.get(
      `/${this.apiRoot}/${this.version}/front-end/selected`, config);
    
    const results = await response.data;
    if (response.status === 200) return results;
    throw new Error(results);
  };

  static getAlertData = async (
    ids: string[] 
  ) => {

    const params = new URLSearchParams({
      ids: JSON.stringify(ids)
    });

    const config: AxiosRequestConfig = {
      params,
    }

    const response = await this.client.get(
      `/${this.apiRoot}/${this.version}/front-end/alerts`, config);
    const results = await response.data;
    if (response.status === 200) return results;

    throw new Error(results);
  };
}
