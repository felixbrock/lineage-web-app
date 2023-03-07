import { ExecutionType } from '../../pages/test/test';
import { CustomThresholdMode } from './observability-api-repo';

interface BaseTestSuiteDto {
  id: string;
  target: {
    databaseName: string;
    targetResourceId: string;
    schemaName: string;
    materializationType: string;
    columnName?: string;
    materializationName: string;
  };
  activated: boolean;
  type: string;
  cron: string;
  executionType: ExecutionType;
  deletedAt?: string;
}

export interface TestSuiteDto extends BaseTestSuiteDto {
  customLowerThreshold?: number;
  customUpperThreshold?: number;
  customLowerThresholdMode: CustomThresholdMode;
  customUpperThresholdMode: CustomThresholdMode;
  importanceThreshold: number;
  boundsIntervalRelative: number;
}

export const instanceOfTestSuiteDto = (obj: unknown): obj is TestSuiteDto =>
  !!obj && typeof obj === 'object' && 'importanceThreshold' in obj;

export type QualTestSuiteDto = BaseTestSuiteDto;
