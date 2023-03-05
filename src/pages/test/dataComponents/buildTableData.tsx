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
}

type Columns = Map<string, Column>;

interface Table {
  columns: Columns;
  tests: Test[];
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

export function buildTableData(
  mats: MaterializationDto[],
  cols: ColumnDto[],
  testSuites: TestSuiteDto[],
  qualTestSuites: QualTestSuiteDto[]
): TableData {
  const tableData: TableData = new Map();

  console.log(mats);

  for (let mat of mats) {
    const databaseName = mat.databaseName;
    const schemaName = mat.schemaName;

    const database = tableData.get(databaseName);

    if (database) {
      const schema = database.schemas.get(schemaName);
      if (schema) {
        // @ts-ignore
        schema.tables.set(mat.name, mat);
      } else {
        database.schemas.set(schemaName, {
          // @ts-ignore
          tables: new Map([[mat.name, mat]]),
        });
      }
    } else {
      tableData.set(databaseName, {
    // @ts-ignore
        schemas: new Map([
          [schemaName, { tables: new Map([[mat.name, mat]]) }],
        ]),
      });
    }
  }

  console.log(tableData);
  return tableData;
}
