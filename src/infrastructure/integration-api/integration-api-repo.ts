import axios, { AxiosRequestConfig } from 'axios';
import { TestHistoryEntry } from '../../components/metrics-graph';
import appConfig from '../../config';
import GithubProfileDto from './github-profile-dto';
import SlackConversationInfoDto from './slack-channel-info-dto';
import SlackProfileDto from './slack-profile-dto';
import SnowflakeProfileDto from './snowflake-profile-dto';

interface PostSlackProfileDto {
  accessToken: string;
  channelId: string;
  channelName: string;
}

interface UpdateSlackProfileDto {
  accessToken?: string;
  channelId?: string;
  channelName?: string;
}

interface PostSnowflakeProfileDto {
  accountId: string;
  username: string;
  password: string;
  warehouseName: string;
}

interface UpdateSnowflakeProfileDto {
  accountId?: string;
  username?: string;
  password?: string;
  warehouseName?: string;
}

interface PostGithubProfileDto {
  installationId: string;
  organizationId: string;
  repositoryNames: string[];
}

interface UpdateGithubProfileDto {
  installationId?: string;
}

// TODO - Implement Interface regarding clean architecture
export default class IntegrationApiRepo {
  private static version = 'v1';

  private static apiRoot = 'api';

  private static baseUrl = appConfig.baseUrl.integrationService;

  static getSlackProfile = async (
    jwt: string
  ): Promise<SlackProfileDto | null> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSlackProfile = async (
    postSlackProfileDto: PostSlackProfileDto,
    jwt: string
  ): Promise<SlackProfileDto | undefined> => {
    try {
      const data = postSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
        data,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateSlackProfile = async (
    updateSlackProfileDto: UpdateSlackProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateSlackProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/profile`,
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

  static getSlackConversations = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<SlackConversationInfoDto[]> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params,
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/conversations`,
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 200) throw new Error(jsonResponse.message);
      if (!jsonResponse) throw new Error('Did not receive slack conversations');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static joinSlackConversation = async (
    oldChannelId: string,
    newChannelId: string,
    accessToken: string,
    jwt: string
  ): Promise<undefined> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/slack/conversation/join`,
        { oldChannelId, newChannelId, accessToken },
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static postGithubProfile = async (
    postGithubProfileDto: PostGithubProfileDto,
    jwt: string
  ): Promise<string> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        postGithubProfileDto,
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      if (!jsonResponse) throw new Error('Github profile creation failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static updateGithubProfile = async (
    updateGithubProfileDto: UpdateGithubProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateGithubProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
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

  static getGithubProfile = async (
    params: URLSearchParams,
    jwt: string
  ): Promise<GithubProfileDto | undefined> => {
    try {
      const configuration: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        params,
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/profile`,
        configuration
      );

      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse.message);
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static getAccessToken = async (
    code: string,
    jwt: string
  ): Promise<string> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/github/token`,
        { code },
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      if (!jsonResponse)
        throw new Error('Github access token retrieval failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static getSnowflakeProfile = async (
    jwt: string
  ): Promise<SnowflakeProfileDto | null> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.get(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 200) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static updateSnowflakeProfile = async (
    updateSnowflakeProfileDto: UpdateSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = updateSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.patch(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
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

  static postSnowflakeProfile = async (
    postSnowflakeProfileDto: PostSnowflakeProfileDto,
    jwt: string
  ): Promise<unknown> => {
    try {
      const data = postSnowflakeProfileDto;

      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/profile`,
        data,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static postSnowflakeEnvironment = async (jwt: string): Promise<unknown> => {
    try {
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${jwt}` },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/init`,
        undefined,
        config
      );
      const jsonResponse = response.data;
      if (response.status === 201) return jsonResponse;
      throw new Error(jsonResponse);
    } catch (error: any) {
      return Promise.reject(new Error(error.response.data.message));
    }
  };

  static querySnowflake = async (query: string, jwt: string): Promise<any> => {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };

      const response = await axios.post(
        `${IntegrationApiRepo.baseUrl}/${IntegrationApiRepo.apiRoot}/${IntegrationApiRepo.version}/snowflake/query`,
        {
          query,
        },
        config
      );
      const jsonResponse = response.data;
      if (response.status !== 201) throw new Error(jsonResponse.message);
      if (!jsonResponse) throw new Error('Querying snowflake failed');
      return jsonResponse;
    } catch (error: unknown) {
      if (typeof error === 'string') return Promise.reject(error);
      if (error instanceof Error) return Promise.reject(error.message);
      return Promise.reject(new Error('Unknown error occured'));
    }
  };

  static getSelectionTestHistories = async (
    testSuiteReps: {
      id: string;
      type: string;
    }[],
    orgId: string,
    jwt: string
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

    const whereCondition = `array_contains(test_history.test_suite_id::variant, array_construct(${Object.values(
      testHistory
    )
      .map((el) => `'${el.testSuiteId}'`)
      .join(', ')}))`;

    const testHistoryQuery = `
    select 
      test_history.test_suite_id as test_suite_id,
      test_history.value as value,
      test_executions.executed_on as executed_on,
      test_results.expected_value_upper_bound as value_upper_bound,
      test_results.expected_value_lower_bound as value_lower_bound,
      test_history.is_anomaly as is_anomaly,
      test_history.user_feedback_is_anomaly as user_feedback_is_anomaly 
    from cito.observability.test_history as test_history
    inner join cito.observability.test_executions as test_executions
      on test_history.execution_id = test_executions.id
    left join cito.observability.test_results as test_results
      on test_history.execution_id = test_results.execution_id
    where ${whereCondition}
    order by test_executions.executed_on desc limit 200;`;

    const testHistoryResults = await IntegrationApiRepo.querySnowflake(
      testHistoryQuery,
      jwt
    );

    const results: { [key: string]: unknown }[] =
      testHistoryResults[orgId].reverse();

    results.forEach((el: { [key: string]: unknown }) => {
      const {
        VALUE: value,
        TEST_SUITE_ID: entryTestSuiteId,
        EXECUTED_ON: executedOn,
        VALUE_UPPER_BOUND: valueUpperBound,
        VALUE_LOWER_BOUND: valueLowerBound,
        IS_ANOMALY: isAnomaly,
        USER_FEEDBACK_IS_ANOMALY: userFeedbackIsAnomaly,
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

      if (
        typeof value !== 'number' ||
        typeof entryTestSuiteId !== 'string' ||
        typeof executedOn !== 'string' ||
        typeof isAnomaly !== 'boolean' ||
        typeof userFeedbackIsAnomaly !== 'number' ||
        !isOptionalOfType<number>(valueLowerBound, 'number') ||
        !isOptionalOfType<number>(valueUpperBound, 'number')
      )
        throw new Error('Received unexpected type');

      testHistory[entryTestSuiteId].historyDataSet.push({
        isAnomaly,
        userFeedbackIsAnomaly,
        timestamp: executedOn,
        valueLowerBound,
        valueUpperBound,
        value,
      });
    });

    return Object.values(testHistory);
  };
}
