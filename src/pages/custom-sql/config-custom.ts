export const HARDCODED_LOWER_THRESHOLD = 3;
export const HARDCODED_UPPER_THRESHOLD = 5;
export const HARDCODED_THRESHOLD_MODE = "absolute"
export const DEFAULT_FREQUENCY = '25 * * * ? *';
export const EXECUTION_TYPE = 'frequency';

export type MaterializationType = 'Table' | 'View';
export type Level = 'database' | 'schema' | 'table' | 'column';
export type Theme = 'light' | 'dark';

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