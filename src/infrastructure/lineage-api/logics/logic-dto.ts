export default interface LogicDto {
  id: string;
  relationName: string;
  sql: string;
  dependentOn: any;
  parsedLogic: string;
  statementRefs: any;
  // eslint-disable-next-line semi
}
