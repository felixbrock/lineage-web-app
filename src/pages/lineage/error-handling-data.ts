import ColumnDto from "../../infrastructure/lineage-api/columns/column-dto";
import DashboardDto from "../../infrastructure/lineage-api/dashboards/dashboard-dto";
import DependencyDto from "../../infrastructure/lineage-api/dependencies/dependency-dto";
import LineageDto from "../../infrastructure/lineage-api/lineage/lineage-dto";
import MaterializationDto from "../../infrastructure/lineage-api/materializations/materialization-dto";

export const defaultErrorLineage: LineageDto = {
  id: '62715f897e3d8066494d3f9e',
  createdAt: '',
  completed: true
};

export const defaultErrorMaterializations: MaterializationDto[] = [
    {
      id: '',
      relationName: '',
      type: '',
      name: '',
      schemaName: '',
      databaseName: '',
      logicId: '',
      lineageIds: [''],
    },
];

export const defaultErrorColumns: ColumnDto[] = [
  {
    id: '',
    relationName: '',
    name: '',
    index: '',
    dataType: '',
    materializationId: '',
    lineageIds: [''],
  },
];

export const defaultErrorDependencies: DependencyDto[] = [
  {
    id: '',
    type: '',
    tailId: '',
    headId: '',
    lineageIds: ['62715f897e3d8066494d3f9e'],
  },
];

export const deafultErrorDashboards: DashboardDto[] = [];
