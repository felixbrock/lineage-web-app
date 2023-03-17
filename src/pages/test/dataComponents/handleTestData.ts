import MaterializationDto from '../../../infrastructure/lineage-api/materializations/materialization-dto';
import ObservabilityApiRepo, {
  CreateQualTestSuiteProps,
  CreateQuantTestSuiteProps,
  UpdateTestSuiteObject,
} from '../../../infrastructure/observability-api/observability-api-repo';
import { QualTestSuiteDto } from '../../../infrastructure/observability-api/test-suite-dto';
import { Test } from './buildTableData';

export function createColumnTest(
  tests: CreateQuantTestSuiteProps[],
  jwt: string
) {
  ObservabilityApiRepo.postTestSuites(tests, jwt);
}

interface TestFrequencyProps {
  id: string;
  cron: string;
}
export function updateColumnTestFrequency(
  tests: TestFrequencyProps[],
  jwt: string
) {
  const testsToUpdate: UpdateTestSuiteObject[] = [];
  for (let test of tests) {
    const updateTestObject: UpdateTestSuiteObject = {
      id: test.id,
      props: {
        cron: test.cron,
        executionType: 'frequency',
      },
    };
    testsToUpdate.push(updateTestObject);
  }
  ObservabilityApiRepo.updateTestSuites(testsToUpdate, jwt);
}

export async function createTableTest(
  tableId: string,
  testState: Test,
  tableContextData: any,
  newTestState: any
) {
  console.log('createTableTest', testState);
  // this is unnecessary since the targetResourceId is already known but since the interface demands
  // the names, they need to be looked up
  // might be worth changing
  let mats: MaterializationDto[] = tableContextData.mats;

  const mat = mats.find((element) => element.id === tableId);

  let newTest: CreateQualTestSuiteProps;
  if (mat) {
    newTest = {
      activated: newTestState.newActivatedState,
      cron: newTestState.newFrequency,
      executionType: 'frequency',
      databaseName: mat?.databaseName,
      schemaName: mat?.schemaName,
      materializationName: mat?.name,
      materializationType: 'Table',
      targetResourceId: tableId,
      type: testState.name,
    };
  } else {
    return new Error('No Mat but there should be one');
  }

  if (testState.name === 'MaterializationSchemaChange') {
    const acceptedTest = await ObservabilityApiRepo.postQualTestSuites(
      [newTest],
      tableContextData.jwt
    );
    tableContextData.setTestQualSuite([
      ...tableContextData.testQualSuite,
      ...acceptedTest,
    ]);
  } else {
    const acceptedTest = await ObservabilityApiRepo.postTestSuites(
      // threshold not dynamic
      [{ ...newTest, threshold: 0 }],
      tableContextData.jwt
    );
    tableContextData.setTestSuite([
      ...tableContextData.testSuite,
      ...acceptedTest,
    ]);
  }
}

export function updateTableTest(
  tableId: string,
  testState: Test,
  tableContextData: any,
  newTestState: any
) {
  if (testState.name === 'MaterializationSchemaChange') {
    updateSuites(ObservabilityApiRepo.updateQualTestSuites);
  } else {
    updateSuites(ObservabilityApiRepo.updateTestSuites);
  }

  function updateSuites(observabilityApiCallback: any) {
    const { newActivatedState, newFrequency } = newTestState;
    observabilityApiCallback(
      [
        {
          id: testState.id,
          props: {
            ...{ activated: newActivatedState },
            ...(newFrequency && { cron: newFrequency }),
          },
        },
      ],
      tableContextData.jwt
    );
    const newTests: QualTestSuiteDto[] = tableContextData.testQualSuite;
    const oldTest = newTests.find((test) => test.id === testState.id);
    if (oldTest) {
      oldTest.cron = newFrequency ?? oldTest?.cron;
      oldTest.activated = newActivatedState ?? oldTest?.activated;
    }
    tableContextData.setTestQualSuite(newTests);
  }
}

export function bulkChangeTests(
  elementId: any,
  newTestState: any,
  columnLevel: boolean,
  testState: Test
) {
  return;
}

export function changeTest(
  elementId: any,
  newTestState: {},
  columnLevel: boolean,
  testState: Test,
  tableContextData: any
) {
  console.log(
    elementId,
    newTestState,
    columnLevel,
    testState,
    tableContextData
  );

  if (newTestState.newFrequency === '') return console.log('NO FREQUENCY');

  const columnTests = [
    'ColumnFreshness',
    'ColumnCardinality',
    'ColumnUniqueness',
    'ColumnNullness',
    'ColumnDistribution',
    //  'MaterializationRowCount',
    //  'MaterializationColumnCount',
    //  'MaterializationFreshness',
    //  'MaterializationSchemaChange',
  ];

  if (columnLevel === true) {
  }

  if (columnLevel === false) {
    if (columnTests.includes(testState.name)) {
    // implement bulk and columntests
      bulkChangeTests(elementId, newTestState, columnLevel, testState);
    } else {
      if (testState.id === 'newtest') {
        createTableTest(elementId, testState, tableContextData, newTestState);
      } else {
        updateTableTest(elementId, testState, tableContextData, newTestState);
      }
    }
  }
}
