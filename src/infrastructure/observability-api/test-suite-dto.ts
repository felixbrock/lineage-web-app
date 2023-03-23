import { ExecutionType } from '../../pages/test/test';

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
  threshold: number;
  boundsIntervalRelative: number;
}

export const instanceOfTestSuiteDto = (obj: unknown): obj is TestSuiteDto =>
  !!obj && typeof obj === 'object' && 'threshold' in obj;

export type QualTestSuiteDto = BaseTestSuiteDto;
