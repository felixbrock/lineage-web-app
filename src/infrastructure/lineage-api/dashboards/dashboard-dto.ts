export default interface DashboardDto {
  id: string;
  url?: string;
  name?: string;
  materializationName: string;
  columnName: string;
  lineageIds: string[];
  columnId: string;
  materializationId: string;
    // eslint-disable-next-line semi
  }
  