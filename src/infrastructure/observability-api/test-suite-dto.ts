import { CustomThresholdMode } from './observability-api-repo';
import { EXECUTION_TYPE } from '../../pages/custom-sql/config-custom';
type ExecutionType = typeof EXECUTION_TYPE;

interface BaseTestSuiteDto {
  id: string;
  activated: boolean;
  type: string;
  cron: string;
  executionType: ExecutionType;
  deletedAt?: string;
  lastAlertSent?: string;
}

export interface TestSuiteDto extends BaseTestSuiteDto {
  target: {
    databaseName: string;
    targetResourceId: string;
    schemaName: string;
    materializationType: string;
    columnName?: string;
    materializationName: string;
  };
  customLowerThreshold?: number;
  customUpperThreshold?: number;
  customLowerThresholdMode: CustomThresholdMode;
  customUpperThresholdMode: CustomThresholdMode;
  feedbackLowerThreshold?: number;
  feedbackUpperThreshold?: number;
}

export const instanceOfTestSuiteDto = (obj: unknown): obj is TestSuiteDto =>
  !!obj && typeof obj === 'object' && 'customLowerThresholdMode' in obj;

export interface QualTestSuiteDto extends BaseTestSuiteDto {
  target: {
    databaseName: string;
    targetResourceId: string;
    schemaName: string;
    materializationType: string;
    columnName?: string;
    materializationName: string;
  };
};

export interface CustomTestSuiteDto extends BaseTestSuiteDto {
  name: string;
  description?: string;
  sqlLogic: string;
  target: {
    databaseName?: string;
    targetResourceIds?: string[];
    schemaName?: string;
    materializationType?: string;
    columnName?: string;
    materializationName?: string;
  };
  customLowerThreshold?: number;
  customUpperThreshold?: number;
  customLowerThresholdMode: CustomThresholdMode;
  customUpperThresholdMode: CustomThresholdMode;
  feedbackLowerThreshold?: number;
  feedbackUpperThreshold?: number;
}
