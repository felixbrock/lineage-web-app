import { InjectionMode, asClass, createContainer } from 'awilix';
import AccountApiRepo from './infrastructure/account-api/account-api-repo';
import IntegrationApiRepo from './infrastructure/integration-api/integration-api-repo';
import ColumnsApiRepository from './infrastructure/lineage-api/columns/columns-api-repository';
import DashboardsApiRepository from './infrastructure/lineage-api/dashboards/dashboards-api-repository';
import DependenciesApiRepository from './infrastructure/lineage-api/dependencies/dependencies-api-repository';
import LineageApiRepository from './infrastructure/lineage-api/lineage/lineage-api-repository';
import LogicApiRepository from './infrastructure/lineage-api/logics/logics-api-repository';
import MaterializationsApiRepository from './infrastructure/lineage-api/materializations/materializations-api-repository';
import ObservabilityApiRepo from './infrastructure/observability-api/observability-api-repo';

const iocContainer = createContainer({ injectionMode: InjectionMode.CLASSIC });

iocContainer.register({
  matApiRepo: asClass(MaterializationsApiRepository),
  colApiRepo: asClass(ColumnsApiRepository),
  dashboardApiRepo: asClass(DashboardsApiRepository),
  dependencyApiRepo: asClass(DependenciesApiRepository),
  lineageApiRepo: asClass(LineageApiRepository),
  logicApiRepo: asClass(LogicApiRepository),
  accountApiRepo: asClass(AccountApiRepo),
  integrationApiRepo: asClass(IntegrationApiRepo),
  observabilityApiRepo: asClass(ObservabilityApiRepo)
});

export default iocContainer;
