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
}

export interface TestSuiteDto extends BaseTestSuiteDto {
  threshold: number;
}

export type QualTestSuiteDto = BaseTestSuiteDto;
