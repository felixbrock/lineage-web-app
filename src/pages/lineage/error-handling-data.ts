export const defaultErrorLineage = {
  id: '62715f897e3d8066494d3f9e',
  createdAt: 1,
};

export const defaultErrorMaterializations = [
    {
      id: '62715f8e7e3d8066494d3fad',
      dbtModelId: '',
      materializationType: '',
      name: 'Not able to load your data...',
      schemaName: '',
      databaseName: '',
      logicId: '',
      lineageId: '62715f897e3d8066494d3f9e',
    },
  {
    id: '62715f8e7e3d8066494d3fae',
    dbtModelId: '',
    materializationType: '',
    name: '1.',
    schemaName: '',
    databaseName: '',
    logicId: '',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f8e7e3d8066494d3faf',
    dbtModelId: '',
    materializationType: '',
    name: '2.',
    schemaName: '',
    databaseName: '',
    logicId: '',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f8e7e3d8066494d3fag',
    dbtModelId: '',
    materializationType: '',
    name: '3.',
    schemaName: '',
    databaseName: '',
    logicId: '',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f8e7e3d8066494d3fah',
    dbtModelId: '',
    materializationType: '',
    name: 'In case you are seeking more information:',
    schemaName: '',
    databaseName: '',
    logicId: '',
    lineageId: '62715f897e3d8066494d3f9e',
  },

  {
    id: '62715f8e7e3d8066494d3fai',
    dbtModelId: '',
    materializationType: '',
    name: 'Visit',
    schemaName: '',
    databaseName: '',
    logicId: '',
    lineageId: '62715f897e3d8066494d3f9e',
  },

  {
    id: '62715f8e7e3d8066494d3faj',
    dbtModelId: '',
    materializationType: '',
    name: 'Message us',
    schemaName: '',
    databaseName: '',
    logicId: '',
    lineageId: '62715f897e3d8066494d3f9e',
  },

];

export const defaultErrorColumns = [
  {
    id: '62715f907e3d8066494d402d',
    dbtModelId: '',
    name: 'please set up your integrations',
    index: '',
    type: '',
    materializationId: '62715f8e7e3d8066494d3fad',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f907e3d8066494d402e',
    dbtModelId: '',
    name: 'GitHub',
    index: '',
    type: '',
    materializationId: '62715f8e7e3d8066494d3fae',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f907e3d8066494d402f',
    dbtModelId: '',
    name: 'Snowflake',
    index: '',
    type: '',
    materializationId: '62715f8e7e3d8066494d3faf',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f907e3d8066494d402g',
    dbtModelId: '',
    name: 'Slack',
    index: '',
    type: '',
    materializationId: '62715f8e7e3d8066494d3fag',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f907e3d8066494d402h',
    dbtModelId: '',
    name: '',
    index: '',
    type: '',
    materializationId: '62715f8e7e3d8066494d3fah',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f907e3d8066494d402i',
    dbtModelId: '',
    name: 'https://docs.citodata.com',
    index: '',
    type: '',
    materializationId: '62715f8e7e3d8066494d3fai',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '62715f907e3d8066494d402j',
    dbtModelId: '',
    name: 'contact@citodata.com',
    index: '',
    type: '',
    materializationId: '62715f8e7e3d8066494d3faj',
    lineageId: '62715f897e3d8066494d3f9e',
  },
];

export const defaultErrorDependencies = [
  {
    id: '627160c37e3d8066494d4394d',
    type: 'DATA',
    tailId: '62715f907e3d8066494d402d',
    headId: '62715f907e3d8066494d402e',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '627160c37e3d8066494d4394e',
    type: 'DATA',
    tailId: '62715f907e3d8066494d402e',
    headId: '62715f907e3d8066494d402f',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '627160c37e3d8066494d4394f',
    type: 'DATA',
    tailId: '62715f907e3d8066494d402f',
    headId: '62715f907e3d8066494d402g',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '627160c37e3d8066494d4394g',
    type: 'DATA',
    tailId: '62715f907e3d8066494d402g',
    headId: '62715f907e3d8066494d402h',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '627160c37e3d8066494d4394h',
    type: 'DATA',
    tailId: '62715f907e3d8066494d402h',
    headId: '62715f907e3d8066494d402i',
    lineageId: '62715f897e3d8066494d3f9e',
  },
  {
    id: '627160c37e3d8066494d4394h',
    type: 'DATA',
    tailId: '62715f907e3d8066494d402h',
    headId: '62715f907e3d8066494d402j',
    lineageId: '62715f897e3d8066494d3f9e',
  },
];

export const deafultErrorDashboards = [];
