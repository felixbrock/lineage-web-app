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
}

interface Column {
  tests: Test[];
  name: string;
}

type Columns = Map<string, Column>;

interface Table {
  tests: Test[];
  name: string;
  columns?: Columns;
}

type Tables = Map<string, Table>;

interface Schema {
  tables: Tables;
}

type Schemas = Map<string, Schema>;

interface Database {
  schemas: Schemas;
}

type TableData = Map<string, Database>;

// Optimize by returning all objects as maps with id as key

export function buildTableData(
  mats: MaterializationDto[],
  cols: ColumnDto[],
  testSuites: TestSuiteDto[],
  qualTestSuites: QualTestSuiteDto[]
): TableData {
  const tableData: TableData = new Map();

  console.log(mats);
  console.log(testSuites);
  console.log(qualTestSuites);

  for (let mat of mats) {
    const databaseName = mat.databaseName;
    const schemaName = mat.schemaName;

    const database = tableData.get(databaseName);

    const tableObject: Table = {
      columns: new Map(),
      tests: [],
      name: '',
    };

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
  }

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

    for (let test of [...testSuites, ...qualTestSuites]) {
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
          name: '',
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
    }
    return [columns, tables]
  }
  const [columns,tables] = mapTests()

    console.log(columns, tables)
  console.log(tableData);
  return tableData;
}
