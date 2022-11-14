export default interface DependencyDto {
  id: string;
  type: string;
  headId: string;
  tailId: string;
  lineageIds: string[];
  // eslint-disable-next-line semi
}
