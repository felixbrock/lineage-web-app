export interface TestSuiteDto {
  id: string;
  organizationId: string;
  target: {
    databaseName: string;
    targetResourceId: string;
    schemaName: string;
    materializationType: string;
    columnName?: string;
    materializationName: string;
  }
  activated: boolean;
  type: string;
  threshold: number;
  executionFrequency: number;
}
