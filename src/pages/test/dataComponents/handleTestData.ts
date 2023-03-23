import MaterializationDto from '../../../infrastructure/lineage-api/materializations/materialization-dto';
import ObservabilityApiRepo, {
  CreateQualTestSuiteProps,
  CreateQuantTestSuiteProps,
  UpdateTestSuiteObject,
} from '../../../infrastructure/observability-api/observability-api-repo';
import {
  QualTestSuiteDto,
  TestSuiteDto,
} from '../../../infrastructure/observability-api/test-suite-dto';
import {
  DEFAULT_FREQUENCY,
  EXECUTION_TYPE,
  HARDCODED_THRESHOLD,
  Level,
  MATERIALIZATION_TYPE,
} from '../config';
import { AlertInfo, CurrentTestStates } from '../newtest';
import { NewTestState } from '../tableComponents/mainTable';
import { Column, Table, TableData, Test, TestType } from './buildTableData';
import { testsOnlyForTables } from '../config';

interface TestToCreate {
  parentElementId: string;
  testType: TestType;
}

interface ParentInfo {
  databaseName: string;
  schemaName: string;
  matName: string;
  mat: Table | undefined;
  col: Column | undefined;
}

function getParentInfo(
  tableData: TableData,
  parentElementId: string
): ParentInfo {
  let databaseName = '';
  let schemaName = '';
  let matName = '';
  let mat: Table | undefined;
  let col: Column | undefined;

  tableData.forEach((database, databaseName) => {
    database.schemas.forEach((schema, schemaName) => {
      const table = schema.tables.get(parentElementId);
      if (table) {
        databaseName = databaseName;
        schemaName = schemaName;
        matName = table.name;
        mat = table;
        return;
      } else {
        schema.tables.forEach((table, tableId) => {
          const column = table.columns.get(parentElementId);
          if (column) {
            databaseName = databaseName;
            schemaName = schemaName;
            matName = table.name;
            mat = table;
            col = column;
            return;
          }
        });
      }
    });
  });

  return {
    databaseName,
    schemaName,
    matName,
    mat,
    col,
  };
}

async function createColumnTest(
  tests: TestToCreate[],
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  tableData: TableData,
  jwt: string
) {
  const { newFrequency, newActivatedState } = newTestState;
  const testsToCreateSnowflake: CreateQuantTestSuiteProps[] = [];
  const testsToCreateUI: TestSuiteDto[] = [];

  tests.forEach(({ parentElementId, testType }) => {
    // this is unnecessary since the targetResourceId is already known but since the interface demands
    // the names, they need to be looked up
    // might be worth changing
    const { databaseName, schemaName, matName, col } = getParentInfo(
      tableData,
      parentElementId
    );

    if (!col) return new Error('No column found but there should be one');

    // if new state is not given create test with the default (off or false)
    const isTestActivated =
      newActivatedState === undefined ? false : newActivatedState;
    const testCron =
      newFrequency === undefined ? DEFAULT_FREQUENCY : newFrequency;

    const newTestForSnowflake: CreateQuantTestSuiteProps = {
      activated: isTestActivated,
      columnName: col.name,
      databaseName: databaseName,
      schemaName: schemaName,
      materializationName: matName,
      materializationType: MATERIALIZATION_TYPE,
      targetResourceId: parentElementId,
      type: testType,
      executionType: EXECUTION_TYPE,
      threshold: HARDCODED_THRESHOLD,
      cron: testCron,
    };

    testsToCreateSnowflake.push(newTestForSnowflake);

    // create temp test for the ui
    // id will be added after api request gives the new id
    const tempId = 'TEMP_ID' + parentElementId + testType;

    const newTestForUI: TestSuiteDto = {
      id: tempId,
      target: {
        databaseName: databaseName,
        targetResourceId: parentElementId,
        schemaName: schemaName,
        materializationType: MATERIALIZATION_TYPE,
        materializationName: matName,
        columnName: col.name,
      },
      activated: isTestActivated,
      type: testType,
      cron: testCron,
      executionType: EXECUTION_TYPE,
      boundsIntervalRelative: HARDCODED_THRESHOLD,
      threshold: HARDCODED_THRESHOLD,
    };
    testsToCreateUI.push(newTestForUI);
  });

  const [testSuite, setTestSuite] = currentTestStates.tests;

  // set new test for visual feedback
  setTestSuite([...testSuite, ...testsToCreateUI]);

  const acceptedTests = await ObservabilityApiRepo.postTestSuites(
    testsToCreateSnowflake,
    jwt
  );
  setTestSuite([...testSuite, ...acceptedTests]);
}

export function updateColumnTest(
  testIds: string[],
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  jwt: string
) {
  const [testSuite, setTestSuite] = currentTestStates.tests;
  const { newActivatedState, newFrequency } = newTestState;
  setTestSuite(
    testSuite.map((existingTest) => {
      if (testIds.includes(existingTest.id)) {
        if (!(newFrequency === undefined)) {
          existingTest.cron = newFrequency;
        }
        if (!(newActivatedState === undefined)) {
          existingTest.activated = newActivatedState;
        }
      }
      return existingTest;
    })
  );
  ObservabilityApiRepo.updateTestSuites(
    testIds.map((testId) => ({
      id: testId,
      props: {
        ...(!(newActivatedState === undefined) && {
          activated: newActivatedState,
        }),
        ...(!(newFrequency === undefined) && { cron: newFrequency }),
      },
    })),
    jwt
  );
}

export async function createTableTest(
  parentElementId: string,
  test: Test,
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  tableData: TableData,
  jwt: string
) {
  // this is unnecessary since the targetResourceId is already known but since the interface demands
  // the names, they need to be looked up
  // might be worth changing
  // also not using the mat object so it is easier to make these changes
  const { databaseName, schemaName, matName } = getParentInfo(
    tableData,
    parentElementId
  );
  const { newActivatedState, newFrequency } = newTestState;

  const isTestActivated =
    newActivatedState === undefined ? false : newActivatedState;
  const testCron =
    newFrequency === undefined ? DEFAULT_FREQUENCY : newFrequency;

  const newTestForSnowflake: CreateQualTestSuiteProps = {
    activated: isTestActivated,
    cron: testCron,
    executionType: EXECUTION_TYPE,
    databaseName: databaseName,
    schemaName: schemaName,
    materializationName: matName,
    materializationType: MATERIALIZATION_TYPE,
    targetResourceId: parentElementId,
    type: test.type,
  };

  // create temp test for the ui
  // id will be added after api request gives the new id
  const temp_id = 'TEMP_ID' + parentElementId + test.type;

  const newTestForUI: QualTestSuiteDto = {
    id: temp_id,
    target: {
      databaseName: databaseName,
      targetResourceId: parentElementId,
      schemaName: schemaName,
      materializationType: MATERIALIZATION_TYPE,
      materializationName: matName,
    },
    activated: isTestActivated,
    type: test.type,
    cron: testCron,
    executionType: EXECUTION_TYPE,
  };

  if (test.type === 'MaterializationSchemaChange') {
    const [testQualSuite, setTestQualSuite] = currentTestStates.qualTests;

    const updatedTestSuite = [...testQualSuite, newTestForUI];

    // set new test for visual feedback
    setTestQualSuite(updatedTestSuite);

    const acceptedTests = await ObservabilityApiRepo.postQualTestSuites(
      [newTestForSnowflake],
      jwt
    );

    setTestQualSuite([...testQualSuite, ...acceptedTests]);
  } else {
    const [testSuite, setTestSuite] = currentTestStates.tests;

    const updatedTestSuite: TestSuiteDto[] = [
      ...testSuite,
      {
        ...newTestForUI,
        threshold: HARDCODED_THRESHOLD,
        boundsIntervalRelative: HARDCODED_THRESHOLD,
      },
    ];

    // set new test for visual feedback
    setTestSuite(updatedTestSuite);

    const acceptedTests = await ObservabilityApiRepo.postTestSuites(
      [{ ...newTestForSnowflake, threshold: HARDCODED_THRESHOLD }],
      jwt
    );
    setTestSuite([...testSuite, ...acceptedTests]);
  }
}

export function updateTableTest(
  test: Test,
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  jwt: string
) {
  let updateCallback;
  let currentTestState;
  if (test.type === 'MaterializationSchemaChange') {
    updateCallback = ObservabilityApiRepo.updateQualTestSuites;
    currentTestState = currentTestStates.qualTests;
    currentTestState = currentTestState as [
      QualTestSuiteDto[],
      React.Dispatch<React.SetStateAction<QualTestSuiteDto[]>>
    ];
  } else {
    updateCallback = ObservabilityApiRepo.updateTestSuites;
    currentTestState = currentTestStates.tests;
    currentTestState = currentTestState as [
      TestSuiteDto[],
      React.Dispatch<React.SetStateAction<TestSuiteDto[]>>
    ];
  }

  const [testSuite, setTestSuite] = currentTestState;

  const { newActivatedState, newFrequency } = newTestState;
  updateCallback(
    [
      {
        id: test.id,
        props: {
          ...(!(newActivatedState === undefined) && {
            activated: newActivatedState,
          }),
          ...(!(newFrequency === undefined) && { cron: newFrequency }),
        },
      },
    ],
    jwt
  );
  setTestSuite(
    // @ts-ignore
    testSuite.map((existingTest) => {
      if (existingTest.id === test.id) {
        if (!(newFrequency === undefined)) {
          existingTest.cron = newFrequency;
        }
        if (!(newActivatedState === undefined)) {
          existingTest.activated = newActivatedState;
        }
      }
      return existingTest;
    })
  );
}

export async function bulkChangeTests(
  parentElementId: string,
  test: Test,
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  tableData: TableData,
  jwt: string
) {
  const testType = test.type;
  const testIdsToUpdate: string[] = [];
  const testsToCreate: TestToCreate[] = [];

  const { mat } = getParentInfo(tableData, parentElementId);

  if (!mat) return new Error('Mat not found but there should be one');

  mat.columns.forEach((column, columnId) => {
    let hasTest = false;
    column.tests.forEach((test) => {
      if (test.type === testType) {
        testIdsToUpdate.push(test.id);
        hasTest = true;
        return;
      }
    });
    if (!hasTest) {
      testsToCreate.push({ parentElementId: columnId, testType: testType });
    }
  });

  if (testIdsToUpdate.length > 0)
    updateColumnTest(testIdsToUpdate, newTestState, currentTestStates, jwt);
  if (testsToCreate.length > 0)
    await createColumnTest(
      testsToCreate,
      newTestState,
      currentTestStates,
      tableData,
      jwt
    );
}

export async function changeTest(
  parentElementId: string,
  test: Test,
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  level: Level,
  tableData: TableData,
  jwt: string
) {
  if (newTestState.newFrequency === 'custom') {
    new Error('Implement custom cron jobs');
  }
  console.log(newTestState);

  if (level === 'column') {
    if (test.id === 'newTest') {
      await createColumnTest(
        [
          {
            parentElementId: parentElementId,
            testType: test.type,
          },
        ],
        newTestState,
        currentTestStates,
        tableData,
        jwt
      );
    } else {
      updateColumnTest([test.id], newTestState, currentTestStates, jwt);
    }
  }

  if (level === 'table') {
    if (!testsOnlyForTables.includes(test.type)) {
      // bulk create or change the tests for each column of the table
      await bulkChangeTests(
        parentElementId,
        test,
        newTestState,
        currentTestStates,
        tableData,
        jwt
      );
    } else {
      if (test.id === 'newTest') {
        await createTableTest(
          parentElementId,
          test,
          newTestState,
          currentTestStates,
          tableData,
          jwt
        );
      } else {
        updateTableTest(test, newTestState, currentTestStates, jwt);
      }
    }
  }
}

function buildNewTest(
  parentElementId: string,
  parentInfo: ParentInfo,
  testType: TestType,
  newTestState: NewTestState
): [CreateQuantTestSuiteProps, TestSuiteDto] {
  const { databaseName, schemaName, matName, col } = parentInfo;
  const { newActivatedState, newFrequency } = newTestState;

  const isTestActivated =
    newActivatedState === undefined ? false : newActivatedState;
  const testCron =
    newFrequency === undefined ? DEFAULT_FREQUENCY : newFrequency;

  const newTestForSnowflake: CreateQuantTestSuiteProps = {
    activated: isTestActivated,
    ...(col && { columnName: col.name }),
    databaseName: databaseName,
    schemaName: schemaName,
    materializationName: matName,
    materializationType: MATERIALIZATION_TYPE,
    targetResourceId: parentElementId,
    type: testType,
    executionType: EXECUTION_TYPE,
    threshold: HARDCODED_THRESHOLD,
    cron: testCron,
  };

  // create temp test for the ui
  // id will be added after api request gives the new id
  const tempId = 'TEMP_ID' + parentElementId + testType;

  const newTestForUI: TestSuiteDto = {
    id: tempId,
    target: {
      databaseName: databaseName,
      targetResourceId: parentElementId,
      schemaName: schemaName,
      materializationType: MATERIALIZATION_TYPE,
      materializationName: matName,
      ...(col && { columnName: col.name }),
    },
    activated: isTestActivated,
    type: testType,
    cron: testCron,
    executionType: EXECUTION_TYPE,
    boundsIntervalRelative: HARDCODED_THRESHOLD,
    threshold: HARDCODED_THRESHOLD,
  };
  return [newTestForSnowflake, newTestForUI];
}
function buildNewQualTest(
  parentElementId: string,
  parentInfo: ParentInfo,
  testType: TestType,
  newTestState: NewTestState
): [CreateQualTestSuiteProps, QualTestSuiteDto] {
  const { databaseName, schemaName, matName, col } = parentInfo;
  const { newActivatedState, newFrequency } = newTestState;

  const isTestActivated =
    newActivatedState === undefined ? false : newActivatedState;
  const testCron =
    newFrequency === undefined ? DEFAULT_FREQUENCY : newFrequency;

  const newTestForSnowflake: CreateQualTestSuiteProps = {
    activated: isTestActivated,
    cron: testCron,
    executionType: EXECUTION_TYPE,
    databaseName: databaseName,
    schemaName: schemaName,
    materializationName: matName,
    materializationType: MATERIALIZATION_TYPE,
    targetResourceId: parentElementId,
    type: testType,
    ...(col && { columnName: col.name }),
  };

  // create temp test for the ui
  // id will be added after api request gives the new id
  const temp_id = 'TEMP_ID' + parentElementId + testType;

  const newTestForUI: QualTestSuiteDto = {
    id: temp_id,
    target: {
      databaseName: databaseName,
      targetResourceId: parentElementId,
      schemaName: schemaName,
      materializationType: MATERIALIZATION_TYPE,
      materializationName: matName,
    },
    activated: isTestActivated,
    type: testType,
    cron: testCron,
    executionType: EXECUTION_TYPE,
  };

  return [newTestForSnowflake, newTestForUI];
}

export async function changeTests(
  parentElementIds: string[],
  testTypes: TestType[],
  testIds: string[],
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  level: Level,
  tableData: TableData,
  jwt: string
) {
  const { tests, qualTests } = currentTestStates;
  const [testSuite, setTestSuite] = tests;
  const [qualTestSuite, setQualTestSuite] = tests;

  // tests
  const testsToCreateSnowflake: CreateQuantTestSuiteProps[] = [];
  const testsToCreateUI: TestSuiteDto[] = [];
  // qual tests
  const qualTestsToCreateSnowflake: CreateQualTestSuiteProps[] = [];
  const qualTestsToCreateUI: QualTestSuiteDto[] = [];
  // tests update
  const testsToUpdate: string[] = [];
  // qual tests update
  const qualTestsToUpdate: string[] = [];

  // updates
  if (testIds.length > 0) {
    testIds.forEach((testId) => {
      if (testSuite.find((test) => test.id === testId))
        testsToUpdate.push(testId);
      if (qualTestSuite.find((test) => test.id === testId))
        qualTestsToUpdate.push(testId);
    });
  }

  // creation
  if (parentElementIds.length > 0) {
    parentElementIds.forEach((parentElementId) => {
      const parentInfo = getParentInfo(tableData, parentElementId);

      testTypes.forEach((testType) => {
        // is the parent not a column
        if (!parentInfo.col && parentInfo.mat) {
          // and the testType is tabletest
          if (testsOnlyForTables.includes(testType)) {
            let matHasTest = false;
            parentInfo.mat.tests.forEach((test) => {
              if (test.type === testType) {
                matHasTest = true;
                if (test.type === 'MaterializationSchemaChange') {
                  qualTestsToUpdate.push(test.id);
                } else {
                  testsToUpdate.push(test.id);
                }
                return;
              }
            });
            if (!matHasTest) {
              if (testType === 'MaterializationSchemaChange') {
                const [newQualTestSnowflake, newQualTestUI] = buildNewQualTest(
                  parentElementId,
                  parentInfo,
                  testType,
                  newTestState
                );
                qualTestsToCreateSnowflake.push(newQualTestSnowflake);
                qualTestsToCreateUI.push(newQualTestUI);
              } else {
                const [newTestSnowflake, newTestUI] = buildNewTest(
                  parentElementId,
                  parentInfo,
                  testType,
                  newTestState
                );
                testsToCreateSnowflake.push(newTestSnowflake);
                testsToCreateUI.push(newTestUI);
              }
            }
            // if testType is not for tables, create or update all tests of the columns of the table
          } else if (!testsOnlyForTables.includes(testType)) {
            parentInfo.mat.columns.forEach((column, columnId) => {
              let hasTest = false;
              column.tests.forEach((test) => {
                if (test.type === testType) {
                  testsToUpdate.push(test.id);
                  hasTest = true;
                  return;
                }
              });
              if (!hasTest) {
                const [newTestSnowflake, newTestUI] = buildNewTest(
                  parentElementId,
                  parentInfo,
                  testType,
                  newTestState
                );
                testsToCreateSnowflake.push(newTestSnowflake);
                testsToCreateUI.push(newTestUI);
              }
            });
          }
        } else if (parentInfo.col) {
          let hasTest = false;
          parentInfo.col.tests.forEach((test) => {
            if (test.type === testType) {
              testsToUpdate.push(test.id);
              hasTest = true;
              return;
            }
          });
          if (!hasTest) {
            const [newTestSnowflake, newTestUI] = buildNewTest(
              parentElementId,
              parentInfo,
              testType,
              newTestState
            );
            testsToCreateSnowflake.push(newTestSnowflake);
            testsToCreateUI.push(newTestUI);
          }
        } else {
          return new Error('Every ID should have either a column or table/mat');
        }
      });
    });
  }

  console.log('ttcs', testsToCreateSnowflake);
  console.log('ttcui', testsToCreateUI);
  console.log('qttcs', qualTestsToCreateSnowflake);
  console.log('qttcui', qualTestsToCreateUI);
  console.log('ttu', testsToUpdate);
  console.log('qttu', qualTestsToUpdate);
  console.log('state', newTestState);
  return;

  // create Tests
  ObservabilityApiRepo.postTestSuites;
  // create QualTests
  ObservabilityApiRepo.postQualTestSuites;
  // update Tests
  ObservabilityApiRepo.updateTestSuites;
  // update QualTests
  ObservabilityApiRepo.updateQualTestSuites;
}
