export default interface ColumnDto {
  id: string;
  relationName: string;
  name: string;
  index: string;
  dataType: string;
  materializationId: string;
  lineageIds: string[];
  isIdentity?: boolean;
  isNullable?: boolean;
  comment?: string;
  // eslint-disable-next-line semi
}
