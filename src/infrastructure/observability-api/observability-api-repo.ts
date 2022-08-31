import axios, { AxiosRequestConfig } from 'axios';
import { mode } from '../../config';
import { MaterializationType, TestType } from '../../pages/test/test';
import getRoot from '../shared/api-root-builder';
import { TestSuiteDto } from './test-suite-dto';
import { RRule } from 'rrule'

interface UpdateTestHistoryEntryDto {
  alertId: string;
  userFeedbackIsAnomaly: string;
}

export interface TestSuiteProps {
  activated: boolean,
  type: TestType,
  threshold: number,
  executionFrequency: number | RRule,
  databaseName: string,
  schemaName: string,
  materializationName: string, 
  materializationType: MaterializationType,
  columnName: string, 
  targetResourceId: string
}


// TODO - Implement Interface regarding clean architecture
export default class ObservabilityApiRepo {
  private static gateway =  mode === 'production' ? 'ax4h0t5r59.execute-api.eu-central-1.amazonaws.com/production' : 'localhost:3012';

  private static path = 'api/v1';

  private static root = getRoot(ObservabilityApiRepo.gateway, ObservabilityApiRepo.path);


  public static postTestSuite = async (
    testSuiteProps: TestSuiteProps, 
    jwt: string
  ): Promise<TestSuiteDto> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const payload = {...testSuiteProps};

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${apiRoot}/test-suite`,
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

  public static updateTestSuite = async (
    id: string,
    jwt: string,
    activated?: boolean,
    threshold?: number,
    frequency?: number | RRule,
  ): Promise<void> => {
    try {
      const apiRoot = await ObservabilityApiRepo.root;

      const payload : {[key: string]: any} = {
      };

      if(activated !== undefined) payload.activated = activated;
      if(threshold) payload.threshold = threshold;
      if(frequency) payload.frequency = frequency;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${apiRoot}/test-suite/${id}`,
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

      const response = await axios.get(
        `${apiRoot}/test-suites`,
        config
      );
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
        `${apiRoot}/test-suite/history/${updateTestHistoryEntryDto.alertId}`,
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
