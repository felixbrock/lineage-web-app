export default interface MaterializationDto {
  id: string;
  relationName: string;
  name: string;
  schemaName: string;
  databaseName: string;
  type: string;
  lineageIds: string[];
  logicId?: string ;
  ownerId?: string ;
  isTransient?: boolean ;
  comment?: string ;
  // eslint-disable-next-line semi
}
