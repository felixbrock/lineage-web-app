import ColumnDto from '../../../infrastructure/lineage-api/columns/column-dto';
import MaterializationDto from '../../../infrastructure/lineage-api/materializations/materialization-dto';
import { CustomThresholdMode } from '../../../infrastructure/observability-api/observability-api-repo';
import {
  QualTestSuiteDto,
  TestSuiteDto,
  instanceOfTestSuiteDto,
} from '../../../infrastructure/observability-api/test-suite-dto';
import { HARDCODED_LOWER_THRESHOLD, HARDCODED_THRESHOLD_MODE, HARDCODED_UPPER_THRESHOLD, TEST_TYPES } from '../config';
import { buildCronExpression, Frequency, getFrequency } from '../utils/cron';

export type TestType = typeof TEST_TYPES[number];

export interface Test {
  id: string;
  type: TestType;
  active: boolean;
  cron: string; // is either '' (then has frequencyRange) or 'custom' or a cron string
  customLowerThreshold: number;
  customUpperThreshold: number;
  customLowerThresholdMode: CustomThresholdMode;
  customUpperThresholdMode: CustomThresholdMode;
  feedbackLowerThreshold: number;
  feedbackUpperThreshold: number;
  summary?: {
    frequencyRange: [Frequency, Frequency];
    activeChildren: number;
    totalChildren: number;
  };
}

export interface Column {
  tests: Test[];
  name: string;
}

export type Columns = Map<string, Column>;

export interface Table {
  tests: Test[];
  name: string;
  columns: Columns;
}

export type Tables = Map<string, Table>;

export interface Schema {
  tables: Tables;
}

export type Schemas = Map<string, Schema>;

export interface Database {
  schemas: Schemas;
}

export type TableData = Map<string, Database>;
//
// Suggestions
// Optimize by having the test only target one id (not columnName, databaseName ...)

export function buildTableData(
  mats: MaterializationDto[],
  cols: ColumnDto[],
  testSuites: TestSuiteDto[],
  qualTestSuites: QualTestSuiteDto[]
): TableData {
  const allColumnTests: Columns = new Map();
  const allTableTests: Tables = new Map();

  function addTestToMap(
    map: Columns | Tables,
    value: Table | Column,
    key: string,
    test: Test
  ) {
    let typedMap = map as Columns;
    let typedValue = value as Column;
    if (Object.hasOwn(value, 'columns')) {
      typedMap = map as Tables;
      typedValue = value as Table;
    }

    const testParent = typedMap.get(key);
    if (testParent) {
      testParent.tests.push(test);
    } else {
      typedMap.set(key, typedValue);
    }
  }

  [...testSuites, ...qualTestSuites].forEach((test) => {
    const testTargetId = test.target.targetResourceId;

    const testInfo: Test = {
      id: test.id,
      type: test.type as TestType,
      cron: test.cron,
      active: test.activated,
      customLowerThresholdMode: 
        instanceOfTestSuiteDto(test) ? 
          test.customLowerThresholdMode :
          HARDCODED_THRESHOLD_MODE,
      customUpperThresholdMode: 
        instanceOfTestSuiteDto(test) ?
          test.customUpperThresholdMode :
          HARDCODED_THRESHOLD_MODE,
      customLowerThreshold: 
        instanceOfTestSuiteDto(test) && test.customLowerThreshold ?
          test.customLowerThreshold :
          HARDCODED_LOWER_THRESHOLD,
      customUpperThreshold:
        instanceOfTestSuiteDto(test) && test.customUpperThreshold ?
          test.customUpperThreshold :
          HARDCODED_UPPER_THRESHOLD,
      feedbackLowerThreshold:         
        instanceOfTestSuiteDto(test) && test.feedbackLowerThreshold ?
          test.feedbackLowerThreshold :
          HARDCODED_LOWER_THRESHOLD,
      feedbackUpperThreshold:
        instanceOfTestSuiteDto(test) && test.feedbackUpperThreshold ?
          test.feedbackUpperThreshold :
          HARDCODED_UPPER_THRESHOLD,
    };

    // check if column test or table test
    if (test.target.columnName) {
      const column: Column = {
        tests: [testInfo],
        name: test.target.columnName,
      };
      addTestToMap(allColumnTests, column, testTargetId, testInfo);
    } else {
      const table: Table = {
        tests: [testInfo],
        name: test.target.materializationName,
        columns: new Map(),
      };
      addTestToMap(allTableTests, table, testTargetId, testInfo);
    }
  });

  // map all columns to their mats/tables
  const columnsToTableMap = new Map();

  for (const col of cols) {
    const { id, materializationId, name } = col;
    let columnObject: Column = {
      tests: [],
      name: name,
    };
    const columnTable = columnsToTableMap.get(materializationId);
    const columnTest = allColumnTests.get(id);
    if (columnTest) {
      columnObject = columnTest;
    }
    if (columnTable) {
      columnTable.set(id, columnObject);
    } else {
      columnsToTableMap.set(materializationId, new Map([[id, columnObject]]));
    }
  }

  // map all mats to their schemas and databases
  const tableData: TableData = new Map();

  mats.forEach((mat) => {
    const { databaseName, schemaName } = mat;

    const database = tableData.get(databaseName);

    let tableObject: Table = {
      columns: new Map(),
      tests: [],
      name: mat.name,
    };

    const tableTests = allTableTests.get(mat.id);
    const tableColumns = columnsToTableMap.get(mat.id);

    tableObject.tests = tableTests?.tests ?? [];
    tableObject.columns = tableColumns ?? new Map();

    // add table summaries
    tableObject.columns.forEach((column) => {
      if (column.tests.length === 0) return;
      column.tests.forEach((columnTest) => {
        // check for existing testSummary
        const tableTest = tableObject.tests.find(
          (tableTest) => tableTest.type === columnTest.type
        );

        // in h or 0 for custom
        const numericalFrequency = getFrequency(columnTest.cron);

        if (tableTest && tableTest.summary) {
          const { summary } = tableTest;
          if (columnTest.active) {
            summary.activeChildren++;
            if (summary.activeChildren === summary.totalChildren) {
              tableTest.active = true;
            }
          }
          const frequencyRange = summary.frequencyRange;

          if (frequencyRange) {
            if (frequencyRange[0] > numericalFrequency) {
              frequencyRange[0] = numericalFrequency;
            }
            if (frequencyRange[1] < numericalFrequency) {
              frequencyRange[1] = numericalFrequency;
            }

            // if frequencyRange is the same twice, set the common frequency as the cron of the test, otherwise as undefined ('')
            if (frequencyRange[0] === frequencyRange[1]) {
              tableTest.cron = buildCronExpression(frequencyRange[0]);
            } else {
              tableTest.cron = '';
            }
          }
        } else {
          const testSummary: Test = {
            id: 'testSummary',
            type: columnTest.type,
            active: false,
            cron: buildCronExpression(numericalFrequency),
            customLowerThresholdMode: columnTest.customLowerThresholdMode,
            customUpperThresholdMode: columnTest.customUpperThresholdMode,
            customLowerThreshold: columnTest.customLowerThreshold,
            customUpperThreshold: columnTest.customUpperThreshold,
            feedbackLowerThreshold: columnTest.feedbackLowerThreshold,
            feedbackUpperThreshold: columnTest.feedbackUpperThreshold,
            summary: {
              activeChildren: columnTest.active ? 1 : 0,
              totalChildren: tableObject.columns.size,
              frequencyRange: [numericalFrequency, numericalFrequency],
            },
          };

          tableObject.tests.push(testSummary);
        }
      });
    });

    const schemaObject: Schema = {
      tables: new Map([[mat.id, tableObject]]),
    };

    if (database) {
      const schema = database.schemas.get(schemaName);
      if (schema) {
        schema.tables.set(mat.id, tableObject);
      } else {
        database.schemas.set(schemaName, schemaObject);
      }
    } else {
      tableData.set(databaseName, {
        schemas: new Map([[schemaName, schemaObject]]),
      });
    }
  });
  return tableData;
}
