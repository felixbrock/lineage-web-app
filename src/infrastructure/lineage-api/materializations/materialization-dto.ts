export default interface MaterializationDto {
  id: string;
  dbtModelId: string;
  materializationType: string;
  name: string;
  schemaName: string;
  databaseName: string;
  logicId: string;
  // eslint-disable-next-line semi
}
