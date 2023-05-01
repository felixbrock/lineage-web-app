import Navbar from '../../components/navbar';
import { Paginator } from './tableComponents/pagination';
import { Alert, AlertInfo } from './tableComponents/alert';
import { NewTestState } from './tableComponents/mainTable';
import SearchBox from '../lineage/components/search-box';
import { useAccount, useApiRepository } from './dataComponents/useData';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import ObservabilityApiRepo from '../../infrastructure/observability-api/observability-api-repo';
import React, { createContext, Fragment, useEffect, useState } from 'react';
import {
  buildTableData,
  Database,
  Schema,
  TableData,
} from './dataComponents/buildTableData';
import { changeTests } from './dataComponents/handleTestData';
import { Theme, colorConfig, GlobalTableColorConfig, Level } from './config';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import {
  QualTestSuiteDto,
  TestSuiteDto,
} from '../../infrastructure/observability-api/test-suite-dto';
import { TestType } from './dataComponents/buildTableData';


export interface CurrentTestStates {
  tests: [TestSuiteDto[], React.Dispatch<React.SetStateAction<TestSuiteDto[]>>];
  qualTests: [
    QualTestSuiteDto[],
    React.Dispatch<React.SetStateAction<QualTestSuiteDto[]>>
  ];
}

interface TableContextProps {
  theme: {
    colorConfig: GlobalTableColorConfig;
    currentTheme: Theme;
    setCurrentTheme: React.Dispatch<React.SetStateAction<Theme>>;
  };
  handleTestChange: (
    parentElementIds: string[],
    testTypes: TestType[],
    newTestState: NewTestState,
    level: Level
  ) => Promise<boolean>;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}

const tableContext: TableContextProps = {
  theme: {
    colorConfig: colorConfig,
    currentTheme: colorConfig.defaultTheme,
    setCurrentTheme: () => {},
  },
  handleTestChange: () => Promise.resolve(false),
  setAlertInfo: () => {},
};

export const TableContext = createContext(tableContext);

export default function Test() {
  const jwt = useAccount();
  const [currentTheme, setCurrentTheme] = useState(
    tableContext.theme.currentTheme
  );
  const mats = useApiRepository(
    jwt,
    MaterializationsApiRepository.getBy,
    {}
  )[0];
  const cols = useApiRepository(jwt, ColumnsApiRepository.getBy, {})[0];
  const [testSuite, setTestSuite] = useApiRepository(
    jwt,
    ObservabilityApiRepo.getTestSuites
  ) as [TestSuiteDto[], React.Dispatch<React.SetStateAction<TestSuiteDto[]>>];
  const [testQualSuite, setTestQualSuite] = useApiRepository(
    jwt,
    ObservabilityApiRepo.getQualTestSuites
  ) as [
    QualTestSuiteDto[],
    React.Dispatch<React.SetStateAction<QualTestSuiteDto[]>>
  ];

  const currentTestStates: CurrentTestStates = {
    tests: [testSuite, setTestSuite],
    qualTests: [testQualSuite, setTestQualSuite],
  };

  const [initialTableData, setInitialTableData] = useState(new Map());

  const [tableState, setTableState] = useState({
    loading: true,
    tableData: new Map(),
  });

  const alertInfoInit: AlertInfo = {
    show: false,
    title: '',
    description: '',
  };
  const [alertInfo, setAlertInfo] = useState(alertInfoInit);

  function searchTableData(tableData: TableData, searchString: string) {
    const searchResults: TableData = new Map();

    tableData.forEach((database, databaseName) => {
      database.schemas.forEach((schema, schemaName) => {
        schema.tables.forEach((table, tableId) => {
          if (
            !table.name.includes(searchString) &&
            !schemaName.includes(searchString) &&
            !databaseName.includes(searchString)
          )
            return;
          const currentDb = searchResults.get(databaseName);
          if (currentDb) {
            const currentSchema = currentDb.schemas.get(schemaName);
            if (currentSchema) {
              currentSchema.tables.set(tableId, table);
            } else {
              const newSchema: Schema = { tables: new Map([[tableId, table]]) };
              currentDb.schemas.set(schemaName, newSchema);
            }
          } else {
            const newSchema: Schema = { tables: new Map([[tableId, table]]) };
            const newDatabase: Database = {
              schemas: new Map([[schemaName, newSchema]]),
            };
            searchResults.set(databaseName, newDatabase);
          }
        });
      });
    });

    console.log(searchResults);
    if (searchResults.size === 0) return tableData;
    return searchResults;
  }

  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    if (mats && cols && testSuite && testQualSuite) {
      const tableData = buildTableData(
        mats as MaterializationDto[],
        cols as ColumnDto[],
        testSuite as TestSuiteDto[],
        testQualSuite as QualTestSuiteDto[]
      );
      setInitialTableData(tableData);
      setTableState({
        loading: false,
        tableData: searchTableData(tableData, searchString),
      });
    }
  }, [mats, cols, testSuite, testQualSuite]);

  async function handleTestChange(
    parentElementIds: string[],
    testTypes: TestType[],
    newTestState: NewTestState
  ): Promise<boolean> {
    if (
      newTestState.newFrequency === undefined &&
      newTestState.newActivatedState === undefined
    ) {
      setAlertInfo({
        show: true,
        title: 'Not enough arguments.',
        description:
          'Please specify a frequency, an activation state, or both.',
      });
      return false;
    }

    const success = await changeTests(
      parentElementIds,
      testTypes,
      newTestState,
      currentTestStates,
      tableState.tableData,
      setAlertInfo,
      jwt
    );
    return success;
  }

  console.log(tableState);




  useEffect(() => {
    setTableState({
      ...tableState,
      tableData: searchTableData(initialTableData, searchString),
    });
  }, [searchString]);

  return (
    <TableContext.Provider
      value={{
        ...tableContext,
        theme: {
          ...tableContext.theme,
          currentTheme: currentTheme,
          setCurrentTheme: setCurrentTheme,
        },
        handleTestChange: handleTestChange,
        setAlertInfo: setAlertInfo,
      }}
    >
      <div className="mb-20 h-full w-full overflow-y-auto">
        <Navbar current="tests" jwt={jwt} />
        <Alert alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
        <div className="items-top relative flex h-20 justify-center">
          <div className="relative mt-2 w-1/4">
            <SearchBox
              placeholder="Search..."
              label="testsearchbox"
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
        </div>
        {tableState.loading ? (
          <>Loading...</>
        ) : (
          <Paginator
            tableData={tableState.tableData as TableData}
            buttonText={'Columns'}
            tableTitle="Tables"
            tableDescription="This is a test description."
            level={'table'}
          />
        )}
      </div>
    </TableContext.Provider>
  );
}
