export const DEFAULT_FREQUENCY = '25 * * * ? *';
export const EXECUTION_TYPE = 'frequency';
export const MATERIALIZATION_TYPE = 'Table';

export type Level = 'database' | 'schema' | 'table' | 'column';
export type Theme = 'light' | 'dark';

export const ENTRIES_PER_PAGE = [25, 50, 75];

export const TEST_TYPES = [
  'ColumnFreshness',
  'ColumnCardinality',
  'ColumnUniqueness',
  'ColumnNullness',
  'ColumnDistribution',
  'MaterializationRowCount',
  'MaterializationColumnCount',
  'MaterializationFreshness',
  'MaterializationSchemaChange',
] as const;

// only displayed for tables
export const testsOnlyForTables = [
  'MaterializationRowCount',
  'MaterializationColumnCount',
  'MaterializationFreshness',
  'MaterializationSchemaChange',
];

export const headingsOnlyForTables = [
  'Row Count',
  'Column Count',
  'Table Freshness',
  'Schema Change',
];

export interface TableColorConfig {
  textColor: string;
  bgColor: string;
  table: {
    [key in Level]: {
      textColor: string;
      bgColor: string;
      selectionTextColor: string;
      selectionBgColor: string;
      buttonTextColor: string;
    };
  };
}

export interface GlobalTableColorConfig {
  defaultTheme: Theme;
  light: TableColorConfig;
  dark: TableColorConfig;
}

export const colorConfig: GlobalTableColorConfig = {
  defaultTheme: 'light',
  light: {
    textColor: 'text-gray-900',
    bgColor: 'bg-white',
    table: {
      database: {
        textColor: '',
        bgColor: '',
        selectionTextColor: '',
        selectionBgColor: '',
        buttonTextColor: '',
      },
      schema: {
        textColor: '',
        bgColor: '',
        selectionTextColor: '',
        selectionBgColor: '',
        buttonTextColor: '',
      },
      table: {
        textColor: 'text-gray-700',
        bgColor: 'bg-white',
        selectionTextColor: 'text-cito',
        selectionBgColor: 'bg-gray-50',
        buttonTextColor: 'text-cito',
      },
      column: {
        textColor: 'text-gray-700',
        bgColor: 'bg-green-50',
        selectionTextColor: 'text-gray-700',
        selectionBgColor: 'bg-green-100',
        buttonTextColor: 'text-white',
      },
    },
  },
  dark: {
    textColor: 'text-white',
    bgColor: 'bg-gray-900',
    table: {
      database: {
        textColor: '',
        bgColor: '',
        selectionTextColor: '',
        selectionBgColor: '',
        buttonTextColor: '',
      },
      schema: {
        textColor: '',
        bgColor: '',
        selectionTextColor: '',
        selectionBgColor: '',
        buttonTextColor: '',
      },
      table: {
        textColor: 'text-gray-700',
        bgColor: 'bg-white',
        selectionTextColor: 'bg-gray-50',
        selectionBgColor: 'text-cito',
        buttonTextColor: 'text-cito',
      },
      column: {
        textColor: 'text-white',
        bgColor: 'bg-gray-200',
        selectionTextColor: 'bg-gray-400',
        selectionBgColor: 'text-white',
        buttonTextColor: 'text-white',
      },
    },
  },
};
