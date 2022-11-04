import { ExecutionType } from '../../pages/test/test';

interface BaseTestSuiteDto {
  id: string;
  organizationId: string;
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
  executionFrequency: number;
  cron?: string;
  executionType: ExecutionType;
}

export interface TestSuiteDto extends BaseTestSuiteDto {
  threshold: number;
}

export type NominalTestSuiteDto = BaseTestSuiteDto;
