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
  EXECUTION_TYPE,
  HARDCODED_THRESHOLD,
  Level,
  MATERIALIZATION_TYPE,
} from '../config';
import { AlertInfo, CurrentTestStates } from '../newtest';
import { NewTestState } from '../tableComponents/mainTable';
import { Column, Table, TableData, Test } from './buildTableData';
import { testsOnlyForTables } from '../config';

interface TestToUpdate {
  parentElementId: string;
  test: Test;
}

function getParentInfo(tableData: TableData, parentElementId: string) {
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
  tests: TestToUpdate[],
  newTestState: NewTestState,
  currentTestStates: CurrentTestStates,
  tableData: TableData,
  jwt: string
) {
  const { newFrequency, newActivatedState } = newTestState;
  const testsToCreateSnowflake: CreateQuantTestSuiteProps[] = [];
  const testsToCreateUI: TestSuiteDto[] = [];
  const tempIds: string[] = [];

  tests.forEach(({ parentElementId, test }) => {
    // this is unnecessary since the targetResourceId is already known but since the interface demands
    // the names, they need to be looked up
    // might be worth changing
    const { databaseName, schemaName, matName, col } = getParentInfo(
      tableData,
      parentElementId
    );

    if (!col) return new Error('No column found but there should be one');

    const newTestForSnowflake: CreateQuantTestSuiteProps = {
      activated: newActivatedState,
      columnName: col.name,
      databaseName: databaseName,
      schemaName: schemaName,
      materializationName: matName,
      materializationType: MATERIALIZATION_TYPE,
      targetResourceId: parentElementId,
      type: test.type,
      executionType: EXECUTION_TYPE,
      threshold: HARDCODED_THRESHOLD,
      cron: newFrequency,
    };

    testsToCreateSnowflake.push(newTestForSnowflake);

    // create temp test for the ui
    // id will be added after api request gives the new id
    const tempId = 'TEMP_ID' + parentElementId + test.type;
    tempIds.push(tempId);

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
      activated: newActivatedState,
      type: test.type,
      cron: newFrequency,
      executionType: EXECUTION_TYPE,
      boundsIntervalRelative: HARDCODED_THRESHOLD,
      importanceThreshold: HARDCODED_THRESHOLD,
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
  newTestState: any,
  tableContextData: any
) {
  const { newActivatedState, newFrequency } = newTestState;
  const testsToUpdate: UpdateTestSuiteObject[] = [];
  const newTests: QualTestSuiteDto[] = tableContextData.testSuite;

  for (let testId of testIds) {
    const oldTest = newTests.find((test) => test.id === testId);
    if (oldTest) {
      oldTest.cron = newFrequency ?? oldTest?.cron;
      oldTest.activated = newActivatedState ?? oldTest?.activated;
    }

    testsToUpdate.push({
      id: testId,
      props: {
        ...{ activated: newActivatedState },
        ...(newFrequency && { cron: newFrequency }),
      },
    });
  }
  console.log('uct testsToUpdate', testsToUpdate);
  ObservabilityApiRepo.updateTestSuites(testsToUpdate, tableContextData.jwt);
  tableContextData.setTestSuite(newTests);
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

  const newTestForSnowflake: CreateQualTestSuiteProps = {
    activated: newTestState.newActivatedState,
    cron: newTestState.newFrequency,
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
    activated: newTestState.newActivatedState,
    type: test.type,
    cron: newTestState.newFrequency,
    executionType: EXECUTION_TYPE,
  };

  if (test.type === 'MaterializationSchemaChange') {
    const [testQualSuite, setTestQualSuite] = currentTestStates.qualTests;

    const updatedTestSuite = [...testQualSuite, newTestForUI];

    // set new test for visual feedback
    setTestQualSuite(updatedTestSuite);

    const acceptedTest = await ObservabilityApiRepo.postQualTestSuites(
      [newTestForSnowflake],
      jwt
    );

    setTestQualSuite(
      updatedTestSuite.map((test) => {
        if (test.id === temp_id) {
          test.id === acceptedTest[0].id;
        }
        return test;
      })
    );
  } else {
    const [testSuite, setTestSuite] = currentTestStates.tests;

    const updatedTestSuite: TestSuiteDto[] = [
      ...testSuite,
      {
        ...newTestForUI,
        threshold: HARDCODED_THRESHOLD,
        importanceThreshold: HARDCODED_THRESHOLD,
        boundsIntervalRelative: HARDCODED_THRESHOLD,
      },
    ];

    // set new test for visual feedback
    setTestSuite(updatedTestSuite);

    const acceptedTest = await ObservabilityApiRepo.postTestSuites(
      [{ ...newTestForSnowflake, threshold: HARDCODED_THRESHOLD }],
      jwt
    );
    setTestSuite(
      updatedTestSuite.map((test) => {
        if (test.id === temp_id) {
          test.id === acceptedTest[0].id;
        }
        return test;
      })
    );
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
          ...{ activated: newActivatedState },
          ...(newFrequency && { cron: newFrequency }),
        },
      },
    ],
    jwt
  );
  setTestSuite(
    // @ts-ignore
    testSuite.map((existingTest) => {
      if (existingTest.id === test.id) {
        existingTest.cron = newFrequency ?? existingTest?.cron;
        existingTest.activated = newActivatedState ?? existingTest?.activated;
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
  const { newActivatedState, newFrequency } = newTestState;
  const [testSuite, setTestSuite] = currentTestStates.tests;

  const testsToUpdate: string[] = [];
  const testsToCreateSnowflake: CreateQuantTestSuiteProps[] = [];
  const testsToCreateUI: TestSuiteDto[] = [];

  const { databaseName, schemaName, matName, mat } = getParentInfo(
    tableData,
    parentElementId
  );

  if (!mat) return new Error('Mat not found but there should be one');

  mat.columns.forEach((column, columnId) => {
    let hasTest = false;
    for (let test of column.tests) {
      if (test.type === testType) {
        testsToUpdate.push(test.id);
        hasTest = true;
        break;
      }
    }
    if (!hasTest) {

  });

  if (testsToUpdate.length > 0)
    // set new test for visual feedback
    setTestSuite([...testSuite, ...testsToCreateUI]);

  const acceptedTest = await ObservabilityApiRepo.postTestSuites(
    [{ ...newTestForSnowflake, threshold: HARDCODED_THRESHOLD }],
    jwt
  );
  setTestSuite(
    updatedTestSuite.map((test) => {
      if (test.id === temp_id) {
        test.id === acceptedTest[0].id;
      }
      return test;
    })
  );
  updateColumnTest(testsToUpdate, newTestState, tableContextData);
  if (testsToCreate.length > 0)
    await createColumnTest(testsToCreate, tableContextData);
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
  return;

  if (level === 'column') {
    return console.log(newTestState, test);
  }

  if (level === 'table') {
    if (!testsOnlyForTables.includes(test.type)) {
      // bulk create or change the tests for each column of the table
      await bulkChangeTests(parentElementId, test, newTestState);
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
