export default interface LineageDto {
  id: string;
  createdAt: string;
  completed: boolean;
  dbCoveredNames: string[];
  diff?: string;
  // eslint-disable-next-line semi
}
