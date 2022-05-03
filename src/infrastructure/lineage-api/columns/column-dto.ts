export default interface ColumnDto {
  id: string;
  dbtModelId: string;
  name: string;
  index: string;
  type: string;
  materializationId: string;
  lineageId: string;
  // eslint-disable-next-line semi
}
