import ObservabilityApiRepo, {
  CreateQualTestSuiteProps,
  CreateQuantTestSuiteProps,
  UpdateQualTestSuiteObject,
  UpdateTestSuiteObject,
} from '../../../infrastructure/observability-api/observability-api-repo';
import {
  QualTestSuiteDto,
  TestSuiteDto,
} from '../../../infrastructure/observability-api/test-suite-dto';
import {
  DEFAULT_FREQUENCY,
  EXECUTION_TYPE,
  HARDCODED_THRESHOLD_MODE,
  MATERIALIZATION_TYPE,
} from '../config';
import { CurrentTestStates } from '../test';
import { NewTestState } from '../tableComponents/mainTable';
import { Column, Table, TableData, TestType } from './buildTableData';
import { testsOnlyForTables } from '../config';

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
  let dName = '';
  let sName = '';
  let mName = '';
  let mat: Table | undefined;
  let col: Column | undefined;

  tableData.forEach((database, databaseName) => {
    database.schemas.forEach((schema, schemaName) => {
      const table = schema.tables.get(parentElementId);
      if (table) {
        dName = databaseName;
        sName = schemaName;
        mName = table.name;
        mat = table;
        return;
      } else {
        schema.tables.forEach((el) => {
          const column = el.columns.get(parentElementId);
          if (column) {
            dName = databaseName;
            sName = schemaName;
            mName = el.name;
            mat = el;
            col = column;
            return;
          }
        });
      }
    });
  });

  return {
    databaseName: dName,
    schemaName: sName,
    matName: mName,
    mat,
    col,
  };
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
    customLowerThresholdMode: HARDCODED_THRESHOLD_MODE,
    customUpperThresholdMode: HARDCODED_THRESHOLD_MODE,
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
  const tempId = 'TEMP_ID' + parentElementId + testType;

  const newTestForUI: QualTestSuiteDto = {
    id: tempId,
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
function buildUpdatedTestSuite(
  testsToUpdate: string[],
  testSuite: TestSuiteDto[] | QualTestSuiteDto[],
  newTestState: NewTestState
) {
  const { newActivatedState, newFrequency } = newTestState;

  const updatedTestSuiteSnowflake:
    | UpdateTestSuiteObject[]
    | UpdateQualTestSuiteObject[] = testsToUpdate.map((testId) => ({
    id: testId,
    props: {
      ...(!(newActivatedState === undefined) && {
        activated: newActivatedState,
      }),
      ...(!(newFrequency === undefined) && { cron: newFrequency }),
    },
  }));

  return updatedTestSuiteSnowflake;
}

export async function changeTests(
  parentElementIds: string[],
  testTypes: TestType[],
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  tableData: TableData,
  setAlertInfo: any,
) {
  const { tests, qualTests } = currentTestStates;
  const [testSuite, setTestSuite] = tests;
  const [qualTestSuite, setQualTestSuite] = qualTests;

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
                  columnId,
                  { ...parentInfo, col: column },
                  testType,
                  newTestState
                );
                testsToCreateSnowflake.push(newTestSnowflake);
                testsToCreateUI.push(newTestUI);
              }
            });
          }
          // if the parent is a column and the testtype is not only for tables/mats
        } else if (parentInfo.col && !testsOnlyForTables.includes(testType)) {
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

  // check that no update Ids contain 'TEMP_ID'
  for (const id of [...testsToUpdate, ...qualTestsToUpdate]) {
    if (id.includes('TEMP_ID')) {
      setAlertInfo({
        show: true,
        title: 'Update/Creation in process',
        description: 'Please wait until we updated and created all tests',
      });
      return false;
    }
  }

  // temp test suites add 'TEMP_ID' to the ids of each test to mark them as temporary changes
  // they are displayed differently in the ui until the updates are accepted by the api repo
  const updatedTestSuiteSnowflake 
    = buildUpdatedTestSuite(testsToUpdate, testSuite, newTestState) as UpdateTestSuiteObject[];
  const updatedQualTestSuiteSnowflake 
    = buildUpdatedTestSuite(qualTestsToUpdate, qualTestSuite, newTestState) as UpdateQualTestSuiteObject[];

  // console.log('ttcs', testsToCreateSnowflake);
  // console.log('ttcui', testsToCreateUI);
  // console.log('qttcs', qualTestsToCreateSnowflake);
  // console.log('qttcui', qualTestsToCreateUI);
  // console.log('ttu', testsToUpdate);
  // console.log('qttu', qualTestsToUpdate);
  // console.log('tempui', updatedTestSuiteTempUI);
  // console.log('SAM', testSuite);
  // console.log('snow', updatedTestSuiteSnowflake);
  // console.log('Qtempui', updatedQualTestSuiteTempUI);
  // console.log('SAM', qualTestSuite);
  // console.log('Qsnow', updatedQualTestSuiteSnowflake);
  // console.log('state', newTestState);
  // console.log('----------------------------');

  // set new test for visual feedback
  // setTestSuite([...updatedTestSuiteTempUI, ...testsToCreateUI]);
  // setQualTestSuite([...updatedQualTestSuiteTempUI, ...qualTestsToCreateUI]);


  let acceptedTestSuite: TestSuiteDto[] = [];
  let acceptedQualTestSuite: QualTestSuiteDto[] = [];

  // create Tests
  if (testsToCreateSnowflake.length > 0) {
    acceptedTestSuite = await ObservabilityApiRepo.postTestSuites(
      testsToCreateSnowflake);
  }

  if (qualTestsToCreateSnowflake.length > 0) {
    // create QualTests
    acceptedQualTestSuite = await ObservabilityApiRepo.postQualTestSuites(
      qualTestsToCreateSnowflake);
  }

  if (updatedTestSuiteSnowflake.length > 0) {
    // update Tests
    ObservabilityApiRepo.updateTestSuites(updatedTestSuiteSnowflake);
  }

  if (updatedQualTestSuiteSnowflake.length > 0) {
    // update QualTests
    ObservabilityApiRepo.updateQualTestSuites(
      updatedQualTestSuiteSnowflake);
  }

  setTestSuite([...testSuite, ...acceptedTestSuite]);
  setQualTestSuite([...qualTestSuite, ...acceptedQualTestSuite]);

  return true;
}
