type LineageCreationState =
  | 'pending'
  | 'wh-resources-done'
  | 'internal-lineage-done'
  | 'completed';

export default interface LineageDto {
  id: string;
  createdAt: string;
  creationState: LineageCreationState;
  dbCoveredNames: string[];
  diff?: string;
  // eslint-disable-next-line semi
}
