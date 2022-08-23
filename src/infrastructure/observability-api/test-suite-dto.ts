export interface TestSuiteDto {
  id: string;
  organizationId: string;
  targetResourceId: string;
  activated: boolean;
  type: string;
  threshold: number;
  executionFrequency: number;
  databaseName: string;
  schemaName: string;
  materializationName: string;
  columnName?: string;
  materializationType: string;
}
