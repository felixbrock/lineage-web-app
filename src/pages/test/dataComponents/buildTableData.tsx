import ColumnDto from '../../../infrastructure/lineage-api/columns/column-dto';
import MaterializationDto from '../../../infrastructure/lineage-api/materializations/materialization-dto';
import {
  QualTestSuiteDto,
  TestSuiteDto,
} from '../../../infrastructure/observability-api/test-suite-dto';

interface Test {
  name: string;
  active: boolean;
  cron: string;
  threshold: string;
  frequencyRange?: [number, number];
  activeChildren?: number;
}

interface Column {
  tests: Test[];
  name: string;
}

type Columns = Map<string, Column>;

export interface Table {
  tests: Test[];
  name: string;
  columns?: Columns;
}

type Tables = Map<string, Table>;

export interface Schema {
  tables: Tables;
}

type Schemas = Map<string, Schema>;

interface Database {
  schemas: Schemas;
}

export type TableData = Map<string, Database>;

function cronNumber(cron: string): number {
  const cronParts = {
    '* * * ? *': 1,
    '*/3 * * ? *': 3,
    '*/6 * * ? *': 6,
    '*/12 * * ? *': 12,
    '* * ? *': 24,
  };

  for (const [cronPart, numberInH] of Object.entries(cronParts)) {
    if (cron.includes(cronPart)) return numberInH;
  }
  return 0; // custom
}

// Optimize by returning all objects as maps with id as key
// Optimize by having the test only target one id (not columnName, databaseName ...)

export function buildTableData(
  mats: MaterializationDto[],
  cols: ColumnDto[],
  testSuites: TestSuiteDto[],
  qualTestSuites: QualTestSuiteDto[]
): TableData {
  function mapTests() {
    const columns: Columns = new Map();
    const tables: Tables = new Map();

    function addTestToMap(
      parentMap: Columns | Tables,
      parentMapValue: Table | Column,
      parentMapKey: string,
      testInfo: Test
    ) {
      const testParent = parentMap.get(parentMapKey);
      if (testParent) {
        testParent.tests.push(testInfo);
      } else {
        parentMap.set(parentMapKey, parentMapValue);
      }
    }

    [...testSuites, ...qualTestSuites].forEach((test) => {
      const testTargetId = test.target.targetResourceId;

      const testInfo: Test = {
        name: test.type,
        cron: test.cron,
        active: test.activated,
        threshold: '',
      };

      if (test.target.columnName) {
        const column: Column = {
          tests: [testInfo],
          name: test.target.columnName,
        };
        addTestToMap(columns, column, testTargetId, testInfo);
      } else {
        const table: Table = {
          tests: [testInfo],
          name: '',
          columns: new Map(),
        };
        addTestToMap(tables, table, testTargetId, testInfo);
      }
    });
    return [columns, tables];
  }

  const [allColumnTests, allTableTests] = mapTests();

  function mapColsToTable() {
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

    return columnsToTableMap;
  }

  const columnsToTableMap = mapColsToTable();

  function mapTables(allTableTests: Tables) {
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
      tableObject.columns?.forEach((column, key) => {
        if (column.tests.length === 0) return;
        column.tests.forEach((columnTest) => {
          const tableTest = tableObject.tests.find(
            (tableTest) => tableTest.name === columnTest.name
          );

          const numericalFrequency = cronNumber(columnTest.cron);

          if (tableTest) {
            if (columnTest.active) tableTest.activeChildren++;
            if (tableTest.cron === 'custom') return;
            if (numericalFrequency === 0) {
              tableTest.cron = 'custom';
              tableTest.frequencyRange = undefined;
              return;
            }

            if (tableTest.frequencyRange) {
              const numericalFrequency = cronNumber(columnTest.cron);

              if (tableTest.frequencyRange[0] > numericalFrequency) {
                tableTest.frequencyRange[0] = numericalFrequency;
              }
              if (tableTest.frequencyRange[1] < numericalFrequency) {
                tableTest.frequencyRange[1] = numericalFrequency;
              }
            }
          } else {
            const testSummary: Test = {
              name: columnTest.name,
              active: false,
              cron: numericalFrequency === 0 ? 'custom' : '',
              threshold: '',
              activeChildren: columnTest.active ? 1 : 0,
              frequencyRange:
                numericalFrequency === 0
                  ? undefined
                  : [numericalFrequency, numericalFrequency],
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

  const tableData = mapTables(allTableTests);
  return tableData;
}

/////
interface Test2 {
  att: number;
  arr?: [number, number];
}

function testTest(foo: Test2) {
  if (foo.arr?.length === 2) {
    const f1 = foo.arr[0];
    const f2 = foo.arr[1];
  }
}
