import Navbar from '../../components/navbar';
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
import { Transition } from '@headlessui/react';
import { changeTests } from './dataComponents/handleTestData';
import { Theme, colorConfig, GlobalTableColorConfig, Level } from './config';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import {
  QualTestSuiteDto,
  TestSuiteDto,
} from '../../infrastructure/observability-api/test-suite-dto';
import { TestType } from './dataComponents/buildTableData';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { Paginator } from './tableComponents/pagination';

export interface AlertInfo {
  show: boolean;
  title: string;
  description: string;
}

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
  const [jwt, account] = useAccount();
  const [currentTheme, setCurrentTheme] = useState(
    tableContext.theme.currentTheme
  );
  const [mats, setMats] = useApiRepository(
    jwt,
    MaterializationsApiRepository.getBy,
    {}
  );
  const [cols, setCols] = useApiRepository(jwt, ColumnsApiRepository.getBy, {});
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

function Alert({
  alertInfo,
  setAlertInfo,
}: {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}) {
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 top-16 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={alertInfo.show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-cito shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white">
                      {alertInfo.title}
                    </p>
                    <p className="mt-1 text-sm text-white">
                      {alertInfo.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setAlertInfo({ ...alertInfo, show: false });
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
