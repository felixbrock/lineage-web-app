export const defaultErrorLineage = {
  id: '62715f897e3d8066494d3f9e',
  createdAt: 1,
};

export const defaultErrorMaterializations = [
  {
    id: '62715f8e7e3d8066494d3fac',
    dbtModelId: 'source.snowflake_usage.ACCOUNT_USAGE.TABLE_STORAGE',
    materializationType: 'VIEW',
    name: 'For help checkout https://docs.citodata.com ...',
    schemaName: 'ACCOUNT_USAGE',
    databaseName: 'SNOWFLAKE',
    logicId: 'todo - read from snowflake',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f8e7e3d8066494d3fad',
    dbtModelId: 'source.snowflake_usage.ACCOUNT_USAGE.TABLE_STORAGE_METRICS',
    materializationType: 'VIEW',
    name: 'Not able to load your data...',
    schemaName: 'ACCOUNT_USAGE',
    databaseName: 'SNOWFLAKE',
    logicId: 'todo - read from snowflake',
    lineageId: '62715f897e3d8066494d3f9e',
  },
];

export const defaultErrorColumns = [
  {
    id: '62715f907e3d8066494d402e',
    dbtModelId: 'source.snowflake_usage.ACCOUNT_USAGE.TABLE_STORAGE_METRICS',
    name: '...or message us at felix@citodata.com',
    index: '14',
    type: 'TIMESTAMP_LTZ',
    materializationId: '62715f8e7e3d8066494d3fac',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f907e3d8066494d402f',
    dbtModelId: 'source.snowflake_usage.ACCOUNT_USAGE.TABLE_STORAGE_METRICS',
    name: '...did you already set up your integrations?',
    index: '14',
    type: 'string',
    materializationId: '62715f8e7e3d8066494d3fad',
    lineageId: '62715f897e3d8066494d3f9e',
  },
];

export const defaultErrorDependencies = [
  {
    id: '627160c37e3d8066494d4394',
    type: 'DATA',
    headId: '62715f907e3d8066494d402e',
    tailId: '62715f907e3d8066494d402f',
    lineageId: '62715f897e3d8066494d3f9e',
  },
];

export const deafultErrorDashboards = [];
