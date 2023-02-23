import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import DashboardDto from '../../infrastructure/lineage-api/dashboards/dashboard-dto';
import DependencyDto from '../../infrastructure/lineage-api/dependencies/dependency-dto';
import LineageDto from '../../infrastructure/lineage-api/lineage/lineage-dto';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';

export const defaultErrorLineage: LineageDto = {
  id: '62715f897e3d8066494d3f9e',
  createdAt: '',
  creationState: 'completed',
  dbCoveredNames: [],
  diff: '',
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
  },
];

export const defaultErrorDependencies: DependencyDto[] = [
  {
    id: '',
    type: '',
    tailId: '',
    headId: '',
  },
];

export const deafultErrorDashboards: DashboardDto[] = [];
