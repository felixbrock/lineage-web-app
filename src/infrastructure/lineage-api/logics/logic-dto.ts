export default interface LogicDto {
  id: string;
  dbtModelId: string;
  sql: string;
  parsedLogic: string;
  statementRefs: any[];
  lineageId: string;
  // eslint-disable-next-line semi
}
