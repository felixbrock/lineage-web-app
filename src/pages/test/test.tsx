import React, { ReactElement, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './test.scss';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';

import LineageApiRepository from '../../infrastructure/lineage-api/lineage/lineage-api-repository';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import LineageDto from '../../infrastructure/lineage-api/lineage/lineage-dto';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import AccountApiRepository from '../../infrastructure/account-api/account-api-repo';

import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth } from 'aws-amplify';

import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';
import ObservabilityApiRepo, {
  TestSuiteProps,
  UpdateTestSuiteObject,
} from '../../infrastructure/observability-api/observability-api-repo';
import {
  QualTestSuiteDto,
  TestSuiteDto,
} from '../../infrastructure/observability-api/test-suite-dto';
import AccountDto from '../../infrastructure/account-api/account-dto';
import SearchBox from '../lineage/components/search-box';
import Navbar from '../../components/navbar';
import LoadingScreen from '../../components/loading-screen';
import Scheduler from './scheduler/scheduler';

const showRealData = true;

export const testTypes = [
  'ColumnFreshness',
  'ColumnCardinality',
  'ColumnUniqueness',
  'ColumnNullness',
  'ColumnDistribution',
  'MaterializationRowCount',
  'MaterializationColumnCount',
  'MaterializationFreshness',
  'MaterializationSchemaChange',
] as const;
export type TestType = typeof testTypes[number];

export const parseTestType = (testType: unknown): TestType => {
  const identifiedElement = testTypes.find((element) => element === testType);
  if (identifiedElement) return identifiedElement;
  throw new Error('Provision of invalid type');
};

const numericDataTests: TestType[] = [
  'ColumnNullness',
  'ColumnCardinality',
  'ColumnUniqueness',
  'ColumnDistribution',
];
const stringAndBinaryDataTests: TestType[] = [
  'ColumnNullness',
  'ColumnCardinality',
  'ColumnUniqueness',
];
const logicalDataTests: TestType[] = ['ColumnNullness'];
const dateAndTimeDataTests: TestType[] = ['ColumnNullness', 'ColumnFreshness'];
const semiStructuredDataTests: TestType[] = ['ColumnNullness'];
const geospatialDataTests: TestType[] = ['ColumnNullness'];

const snowflakeTypes: { [key: string]: TestType[] } = {
  number: numericDataTests,
  decimal: numericDataTests,
  numeric: numericDataTests,
  int: numericDataTests,
  integer: numericDataTests,
  bigint: numericDataTests,
  smallint: numericDataTests,
  tinyint: numericDataTests,
  byteint: numericDataTests,
  float: numericDataTests,
  float4: numericDataTests,
  float8: numericDataTests,
  double: numericDataTests,
  'double precision': numericDataTests,
  real: numericDataTests,
  varchar: stringAndBinaryDataTests,
  character: stringAndBinaryDataTests,
  char: stringAndBinaryDataTests,
  string: stringAndBinaryDataTests,
  text: stringAndBinaryDataTests,
  binary: stringAndBinaryDataTests,
  varbinary: stringAndBinaryDataTests,
  boolean: logicalDataTests,
  date: dateAndTimeDataTests,
  datetime: dateAndTimeDataTests,
  time: dateAndTimeDataTests,
  timestamp: dateAndTimeDataTests,
  timestamp_ltz: dateAndTimeDataTests,
  timestamp_ntz: dateAndTimeDataTests,
  timestamp_tz: dateAndTimeDataTests,
  variant: semiStructuredDataTests,
  object: semiStructuredDataTests,
  array: semiStructuredDataTests,
  geography: geospatialDataTests,
};

export const frequencies = ['1h', '3h', '6h', '12h', '24h', 'custom'] as const;
export type Frequency = typeof frequencies[number];

export const parseFrequency = (obj: string): Frequency => {
  const identifiedElement = frequencies.find((element) => element === obj);
  if (identifiedElement) return identifiedElement;
  throw new Error('Provision of invalid type');
};

const frequencySelectionItems: { value: Frequency; label: string }[] = [
  { value: '1h', label: '1h' },
  { value: '3h', label: '3h' },
  { value: '6h', label: '6h' },
  { value: '12h', label: '12h' },
  { value: '24h', label: '1d' },
  { value: 'custom', label: 'Custom...' },
];

const buildCronExpression = (frequency: Frequency) => {
  const currentDate = new Date();
  const currentMinutes = currentDate.getUTCMinutes();
  const currentHours = currentDate.getUTCHours();

  switch (frequency) {
    case '1h':
      return `${currentMinutes} * * * ? *`;

    case '3h':
      return `${currentMinutes} */3 * * ? *`;

    case '6h':
      return `${currentMinutes} */6 * * ? *`;

    case '12h':
      return `${currentMinutes} */12 * * ? *`;

    case '24h':
      return `${currentMinutes} ${currentHours} * * ? *`;
    default:
      throw new Error('Unhandled frequency type');
  }
};

const getFrequency = (cron: string): Frequency => {
  const parts = cron.split(' ');

  if (parts.length !== 6)
    throw new Error(
      'Unexpected cron exp. format received. Expected 6 elements'
    );

  if (
    !Number.isNaN(Number(parts[0])) &&
    parts.slice(1).every((el) => el === '*' || el === '?')
  )
    return '1h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/3' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '3h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/6' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '6h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/12' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '12h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    !Number.isNaN(Number(parts[1])) &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '24h';
  return 'custom';
};

export const materializationTypes = ['Table', 'View'] as const;
export type MaterializationType = typeof materializationTypes[number];

export const parseMaterializationType = (
  materializationType: string
): MaterializationType => {
  const typeLowerCase = materializationType.toLowerCase().includes('table')
    ? 'table'
    : 'view';

  const identifiedElement = materializationTypes.find(
    (element) =>
      element === typeLowerCase.charAt(0).toUpperCase() + typeLowerCase.slice(1)
  );
  if (identifiedElement) return identifiedElement;
  throw new Error('Provision of invalid type');
};

export const executionTypes = ['frequency'] as const;
export type ExecutionType = typeof executionTypes[number];

export const parseExecutionType = (executionType: unknown): ExecutionType => {
  const identifiedElement = executionTypes.find(
    (element) => element === executionType
  );
  if (identifiedElement) return identifiedElement;
  throw new Error('Provision of invalid type');
};

interface TestConfig {
  type: TestType;
  activated: boolean;
  testSuiteId?: string;
}

interface ColumnTestConfig {
  id: string;
  label: string;
  type: string;
  cron: string;
  executionType: ExecutionType;
  threshold: number;
  testConfigs: TestConfig[];
  testsActivated: boolean;
  importanceThreshold: number;
  boundsIntervalRelative: number;
}

interface TestDefinitionSummary {
  type: TestType;
  activationCount: number;
  totalCount: number;
}

interface MaterializationTestsConfig {
  columnTestConfigs: ColumnTestConfig[];
  navExpanded: boolean;
  label: string;
  cron?: string;
  executionType?: ExecutionType;
  threshold?: number;
  testDefinitionSummary: TestDefinitionSummary[];
  testsActivated: boolean;
  materializationTestConfigs: TestConfig[];
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#a487ff',
    },
    secondary: {
      main: '#000000',
    },
    success: {
      main: '#6f47ef',
    },
    info: {
      main: '#c8c8c8',
    },
  },
});

const tableCellSx = { p: '1px', mt: '0px', mb: '0px', mr: '2px', ml: '2px' };
const tableHeaderCellSx = {
  p: '2px',
  mt: '0px',
  mb: '0px',
  mr: '2px',
  ml: '2px',
  fontWeight: 'bold',
};
const tableNameSx = { mt: '0px', mb: '0px', mr: '2px', ml: '2px' };

export default (): ReactElement => {
  const [account, setAccount] = useState<AccountDto>();
  const [user, setUser] = useState<any>();
  const [jwt, setJwt] = useState('');

  const [lineage, setLineage] = useState<LineageDto>();
  const [materializations, setMaterializations] = useState<
    MaterializationDto[]
  >([]);
  const [columns, setColumns] = useState<ColumnDto[]>([]);
  const [testSuites, setTestSuites] = useState<TestSuiteDto[]>([]);
  const [qualTestSuites, setQualTestSuites] = useState<QualTestSuiteDto[]>([]);
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [testSelection, setTestSelection] = useState<{
    [key: string]: MaterializationTestsConfig;
  }>({});
  const [searchedTestSelection, setSearchedTestSelection] = useState<{
    [key: string]: MaterializationTestsConfig;
  }>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const [initialLoadCompleted, setInitialLoadCompleted] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [schedulerProps, setSchedulerProps] = useState<{
    show: boolean;
    target?: { matId: string; colId?: string };
    cronExp?: string;
  }>({ show: false });

  const closeSchedulerCallback = () =>
    setSchedulerProps({ ...schedulerProps, show: false });

  const createdScheduleCallback = (expression: string) => {
    setSchedulerProps({ ...schedulerProps, show: false, cronExp: expression });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - Object.keys(testSelection).length
        )
      : 0;

  const changeColumnFrequency = (
    target: { matId: string; colId: string },
    props: { cron: string; executionType: ExecutionType }
  ) => {
    const testSelectionLocal = testSelection;

    const matTestConfig = testSelectionLocal[target.matId];
    matTestConfig.executionType = undefined;

    const columnTestConfigIndex = testSelectionLocal[
      target.matId
    ].columnTestConfigs.findIndex((el) => el.id === target.colId);

    if (columnTestConfigIndex === -1)
      throw new Error('Column Test Config not found');

    const testsToUpdate = testSelectionLocal[target.matId].columnTestConfigs[
      columnTestConfigIndex
    ].testConfigs.filter((el) => el.testSuiteId);

    if (!testsToUpdate.length)
      throw new Error('No activated tests found. Threshold change not allowed');

    const updateObjects = testsToUpdate.map((test): UpdateTestSuiteObject => {
      if (!test.testSuiteId)
        throw new Error('Test with status activated found that does not exist');

      return {
        id: test.testSuiteId,
        props,
      };
    });

    ObservabilityApiRepo.updateTestSuites(updateObjects, jwt);

    testSelectionLocal[target.matId].columnTestConfigs[
      columnTestConfigIndex
    ].cron = props.cron;
    testSelectionLocal[target.matId].columnTestConfigs[
      columnTestConfigIndex
    ].executionType = props.executionType;

    setTestSelection({ ...testSelectionLocal });
    return;
  };

  const handleColumnFrequencyClick = (
    eventTarget: unknown,
    target: { matId: string; colId: string }
  ) => {
    const isExpectedEventTarget = (
      eTarget: unknown
    ): eTarget is { textContent: string } =>
      !!eTarget && typeof eTarget === 'object' && 'textContent' in eTarget;

    if (!isExpectedEventTarget(eventTarget))
      throw new Error('Received unexpected event');

    const matchingSelectionItem = frequencySelectionItems.find(
      (el) => el.label === eventTarget.textContent
    );

    if (!matchingSelectionItem)
      throw new Error('Unexpected selection item label provided');

    const frequency = parseFrequency(matchingSelectionItem.value);

    if (frequency !== 'custom') return;

    const currentCronExp = testSelection[target.matId].columnTestConfigs.find(
      (el) => el.id === target.colId
    )?.cron;
    setSchedulerProps({ show: true, target, cronExp: currentCronExp });
  };

  const handleColumnFrequencyChange = (event: SelectChangeEvent<string>) => {
    const componentName = event.target.name;
    const nameElements = componentName.split('--');
    const target = { matId: nameElements[1], colId: nameElements[2] };

    const frequency = parseFrequency(event.target.value);
    const executionType = 'frequency';

    if (frequency === 'custom') {
      const currentCronExp = testSelection[target.matId].columnTestConfigs.find(
        (el) => el.id === target.colId
      )?.cron;
      setSchedulerProps({ show: true, target, cronExp: currentCronExp });
      return;
    }

    const cron = buildCronExpression(frequency);
    changeColumnFrequency(target, { cron, executionType });
  };

  const changeMatFrequency = (
    target: { matId: string },
    props: { cron: string; executionType: ExecutionType }
  ) => {
    const testSelectionLocal = testSelection;

    testSelectionLocal[target.matId].cron = props.cron;
    testSelectionLocal[target.matId].executionType = props.executionType;

    const isUpdateObject = (
      updateObject: UpdateTestSuiteObject | undefined
    ): updateObject is UpdateTestSuiteObject => !!updateObject;

    const updateObjects = testSelectionLocal[target.matId].columnTestConfigs
      .map((el, index) => {
        const existingTests = el.testConfigs.filter(
          (config) => config.testSuiteId
        );

        if (!existingTests.length) return undefined;

        const objects = existingTests.map((test): UpdateTestSuiteObject => {
          const testSuiteId = test.testSuiteId;

          if (!testSuiteId)
            throw new Error('Activated test without test suite id');

          return {
            id: testSuiteId,
            props,
          };
        });

        testSelectionLocal[target.matId].columnTestConfigs[index].cron =
          props.cron;
        testSelectionLocal[target.matId].columnTestConfigs[
          index
        ].executionType = props.executionType;

        return objects;
      })
      .flat()
      .filter(isUpdateObject);

    ObservabilityApiRepo.updateTestSuites(updateObjects, jwt);

    setTestSelection({ ...testSelectionLocal });
  };

  const handleMatFrequencyClick = (
    eventTarget: unknown,
    target: { matId: string }
  ) => {
    const isExpectedEventTarget = (
      eTarget: unknown
    ): eTarget is { textContent: string } =>
      !!eTarget && typeof eTarget === 'object' && 'textContent' in eTarget;

    if (!isExpectedEventTarget(eventTarget))
      throw new Error('Received unexpected event');

    const matchingSelectionItem = frequencySelectionItems.find(
      (el) => el.label === eventTarget.textContent
    );

    if (!matchingSelectionItem)
      throw new Error('Unexpected selection item label provided');

    const frequency = parseFrequency(matchingSelectionItem.value);

    if (frequency !== 'custom') return;

    const currentCronExp = testSelection[target.matId].cron;
    setSchedulerProps({ show: true, target, cronExp: currentCronExp });
  };

  const handleMatFrequencyChange = (event: SelectChangeEvent<string>) => {
    const componentName = event.target.name;
    const nameElements = componentName.split('--');
    const target = { matId: nameElements[1] };

    const frequency = parseFrequency(event.target.value);
    const executionType = 'frequency';

    if (frequency === 'custom') {
      const currentCronExp = testSelection[target.matId].cron;
      setSchedulerProps({ show: true, target, cronExp: currentCronExp });
    } else {
      const cron = buildCronExpression(frequency);
      changeMatFrequency(target, { cron, executionType });
    }
  };

  const handleSearchChange = (event: any) => {
    const testSelectionKeys = Object.keys(testSelection);
    if (!testSelectionKeys.length) return;

    const value: string = event.target.value;
    if (!value) {
      setSearchedTestSelection(testSelection);
      return;
    }

    const newTestSelectionElements: {
      [key: string]: MaterializationTestsConfig;
    } = {};

    testSelectionKeys.forEach((key) => {
      if (testSelection[key].label.toLowerCase().includes(value.toLowerCase()))
        newTestSelectionElements[key] = testSelection[key];
    });

    setSearchedTestSelection(newTestSelectionElements);
  };

  const getAllowedTestTypes = (columnType: string): TestType[] => {
    if (!Object.keys(snowflakeTypes).includes(columnType.toLowerCase()))
      throw new Error(`Invalid column type (${columnType}) provided`);
    return snowflakeTypes[columnType.toLowerCase()];
  };

  const handleTestSelectButtonClick = async (event: any) => {
    const id = event.target.id as string;
    const props = id.split('--');

    const type = parseTestType(props[0]);

    const testSelectionLocal = testSelection;

    const columnTestConfigIndex = testSelectionLocal[
      props[1]
    ].columnTestConfigs.findIndex((el) => el.id === props[2]);

    if (columnTestConfigIndex === -1)
      throw new Error('Column Test Config not found');

    const testConfigIndex = testSelectionLocal[props[1]].columnTestConfigs[
      columnTestConfigIndex
    ].testConfigs.findIndex((el) => el.type === type);

    if (testConfigIndex === -1) throw new Error('Test Config not found');

    const newActivatedValue =
      !testSelectionLocal[props[1]].columnTestConfigs[columnTestConfigIndex]
        .testConfigs[testConfigIndex].activated;

    testSelectionLocal[props[1]].columnTestConfigs[
      columnTestConfigIndex
    ].testConfigs[testConfigIndex].activated = newActivatedValue;

    const activated = testSelectionLocal[props[1]].columnTestConfigs[
      columnTestConfigIndex
    ].testConfigs.some((el) => el.activated);

    testSelectionLocal[props[1]].columnTestConfigs[
      columnTestConfigIndex
    ].testsActivated = activated;

    const matActivated: boolean = testSelectionLocal[
      props[1]
    ].testDefinitionSummary.some((el) => !!el.activationCount);

    testSelectionLocal[props[1]].testsActivated = matActivated;

    const totalCounter = testSelectionLocal[props[1]].columnTestConfigs.filter(
      (element) => !!element.testConfigs.filter((el) => el.type === type).length
    ).length;

    const summaryIndex = testSelectionLocal[
      props[1]
    ].testDefinitionSummary.findIndex((el) => el.type === type);

    if (summaryIndex === -1) throw new Error('Type summarynot found');

    testSelectionLocal[props[1]].testDefinitionSummary[
      summaryIndex
    ].totalCount = totalCounter;

    const activatedCounter = testSelectionLocal[
      props[1]
    ].columnTestConfigs.filter(
      (element) =>
        !!element.testConfigs.filter((el) => el.type === type && el.activated)
          .length
    ).length;

    testSelectionLocal[props[1]].testDefinitionSummary[
      summaryIndex
    ].activationCount = activatedCounter;

    // provides instant feedback to user about interaction
    setTestSelection({ ...testSelectionLocal });

    const columnTestConfigs =
      testSelectionLocal[props[1]].columnTestConfigs[columnTestConfigIndex];
    const testSuiteId =
      columnTestConfigs.testConfigs[testConfigIndex].testSuiteId;

    if (!testSuiteId) {
      const materalization = materializations.find((el) => el.id === props[1]);

      if (!materalization) throw new Error('Materialization not found');

      const column = columns.find((el) => el.id === props[2]);

      if (!column) throw new Error('Column not found');

      const testSuite = await ObservabilityApiRepo.postTestSuites(
        [
          {
            activated: newActivatedValue,
            columnName: column.name,
            databaseName: materalization.databaseName,
            schemaName: materalization.schemaName,
            materializationName: materalization.name,
            materializationType: parseMaterializationType(materalization.type),
            targetResourceId: column.id,
            type,
            executionType: columnTestConfigs.executionType,
            threshold: columnTestConfigs.threshold,
            cron: columnTestConfigs.cron,
            importanceThreshold: columnTestConfigs.importanceThreshold,
            boundsIntervalRelative: columnTestConfigs.boundsIntervalRelative,
          },
        ],
        jwt
      );

      testSelectionLocal[props[1]].columnTestConfigs[
        columnTestConfigIndex
      ].testConfigs[testConfigIndex].testSuiteId = testSuite[0].id;

      setTestSelection({ ...testSelectionLocal });
    } else
      ObservabilityApiRepo.updateTestSuites(
        [{ id: testSuiteId, props: { activated: newActivatedValue } }],
        jwt
      );
  };

  const handleMatTestButtonClick = async (event: any) => {
    const id = event.target.id as string;
    const props = id.split('--');

    const type = parseTestType(props[0]);

    const testSelectionLocal = testSelection;

    const testIndex = testSelectionLocal[
      props[1]
    ].materializationTestConfigs.findIndex((el) => el.type === type);

    if (testIndex === -1) throw new Error('Mat test config not found');

    const invertedValueActivated =
      !testSelectionLocal[props[1]].materializationTestConfigs[testIndex]
        .activated;

    testSelectionLocal[props[1]].materializationTestConfigs[
      testIndex
    ].activated = invertedValueActivated;

    // to give instant feedback to user that test was activated/deactivated
    setTestSelection({ ...testSelectionLocal });

    const testSuiteId =
      testSelectionLocal[props[1]].materializationTestConfigs[testIndex]
        .testSuiteId;
    if (testSuiteId) {
      if (type === 'MaterializationSchemaChange')
        ObservabilityApiRepo.updateQualTestSuites(
          [{ id: testSuiteId, props: { activated: invertedValueActivated } }],
          jwt
        );
      else
        ObservabilityApiRepo.updateTestSuites(
          [{ id: testSuiteId, props: { activated: invertedValueActivated } }],
          jwt
        );

      setTestSelection({ ...testSelectionLocal });
      return;
    }

    const materalization = materializations.find((el) => el.id === props[1]);

    if (!materalization) throw new Error('Materialization not found');

    let testSuite: TestSuiteDto | QualTestSuiteDto;
    if (type === 'MaterializationSchemaChange')
      testSuite = (
        await ObservabilityApiRepo.postQualTestSuites(
          [
            {
              activated: invertedValueActivated,
              databaseName: materalization.databaseName,
              schemaName: materalization.schemaName,
              materializationName: materalization.name,
              materializationType: parseMaterializationType(
                materalization.type
              ),
              targetResourceId: materalization.id,
              type,
              cron:
                testSelectionLocal[props[1]].cron || buildCronExpression('3h'),
              executionType:
                testSelectionLocal[props[1]].executionType || 'frequency',
            },
          ],
          jwt
        )
      )[0];
    else
      testSuite = (
        await ObservabilityApiRepo.postTestSuites(
          [
            {
              activated: invertedValueActivated,
              databaseName: materalization.databaseName,
              schemaName: materalization.schemaName,
              materializationName: materalization.name,
              materializationType: parseMaterializationType(
                materalization.type
              ),
              targetResourceId: materalization.id,
              type,
              cron:
                testSelectionLocal[props[1]].cron || buildCronExpression('3h'),
              threshold: testSelectionLocal[props[1]].threshold || 3,
              executionType:
                testSelectionLocal[props[1]].executionType || 'frequency',
              importanceThreshold: -1,
              boundsIntervalRelative: 0,
            },
          ],
          jwt
        )
      )[0];

    testSelectionLocal[props[1]].materializationTestConfigs[
      testIndex
    ].testSuiteId = testSuite.id;

    setTestSelection({ ...testSelectionLocal });
  };

  const handleMatLevelColumnTestButtonClick = async (event: any) => {
    const id = event.target.id as string;
    const props = id.split('--');

    const type = parseTestType(props[0]);

    const testSelectionLocal = testSelection;

    const summaryIndex = testSelectionLocal[
      props[1]
    ].testDefinitionSummary.findIndex((el) => el.type === type);

    if (summaryIndex === -1) throw new Error('Type summary not found');

    testSelectionLocal[props[1]].testDefinitionSummary[
      summaryIndex
    ].activationCount = testSelectionLocal[props[1]].testDefinitionSummary[
      summaryIndex
    ].activationCount
      ? 0
      : testSelectionLocal[props[1]].testDefinitionSummary[summaryIndex]
          .totalCount;

    const postObjects: {
      index: number;
      testConfigIndex: number;
    }[] = [];
    const testSuiteProps: TestSuiteProps[] = [];
    const updateObjects: UpdateTestSuiteObject[] = [];

    testSelectionLocal[props[1]].columnTestConfigs.forEach((config, index) => {
      const testConfigIndex = config.testConfigs.findIndex(
        (el) => el.type === type
      );

      if (testConfigIndex === -1) return;

      const newActivatedValue =
        !!testSelectionLocal[props[1]].testDefinitionSummary[summaryIndex]
          .activationCount;

      testSelectionLocal[props[1]].columnTestConfigs[index].testConfigs[
        testConfigIndex
      ].activated = newActivatedValue;

      const activated = config.testConfigs.some((el) => el.activated);

      testSelectionLocal[props[1]].columnTestConfigs[index].testsActivated =
        activated;

      const testSuiteId = config.testConfigs[testConfigIndex].testSuiteId;

      // to provide feedback to user about instant interaction
      setTestSelection({ ...testSelectionLocal });

      if (!testSuiteId) {
        const materalization = materializations.find(
          (el) => el.id === props[1]
        );

        if (!materalization) throw new Error('Materialization not found');

        const column = columns.find((el) => el.id === config.id);

        if (!column) throw new Error('Column not found');

        postObjects.push({
          index,
          testConfigIndex,
        });

        testSuiteProps.push({
          activated: newActivatedValue,
          columnName: column.name,
          databaseName: materalization.databaseName,
          schemaName: materalization.schemaName,
          materializationName: materalization.name,
          materializationType: parseMaterializationType(materalization.type),
          targetResourceId: column.id,
          type,
          cron: config.cron,
          threshold: config.threshold,
          executionType: config.executionType,
          importanceThreshold: config.importanceThreshold,
          boundsIntervalRelative: config.boundsIntervalRelative,
        });
      } else
        updateObjects.push({
          id: testSuiteId,
          props: { activated: newActivatedValue },
        });
    });

    if (testSuiteProps.length) {
      if (testSuiteProps.length !== postObjects.length)
        throw new Error('Test Suite creation misalignment');

      const suites = await ObservabilityApiRepo.postTestSuites(
        testSuiteProps,
        jwt
      );

      if (suites.length !== postObjects.length)
        throw new Error('Test Suite creation failed');

      testSuiteProps.forEach((el, index) => {
        const filterResult = suites.filter(
          (suite) => suite.target.targetResourceId === el.targetResourceId
        );
        if (filterResult.length !== 1)
          throw new Error('Ambiguous test suite filter');

        const postObject = postObjects[index];

        testSelectionLocal[props[1]].columnTestConfigs[
          postObject.index
        ].testConfigs[postObject.testConfigIndex].testSuiteId =
          filterResult[0].id;
      });

      setTestSelection({ ...testSelectionLocal });
    }
    if (updateObjects.length)
      await ObservabilityApiRepo.updateTestSuites(updateObjects, jwt);

    const activated = testSelectionLocal[props[1]].testDefinitionSummary.some(
      (el) => !!el.activationCount
    );

    testSelectionLocal[props[1]].testsActivated = activated;

    setTestSelection({ ...testSelectionLocal });
  };

  const getColumnTestConfig = (matId: string, columnId: string) => {
    const columnTestConfig = testSelection[matId].columnTestConfigs.find(
      (el) => el.id === columnId
    );

    if (!columnTestConfig) throw new Error('Column test config not found.');

    return columnTestConfig;
  };

  const getTestConfig = (
    columnTestConfig: ColumnTestConfig,
    type: TestType
  ) => {
    const testType = columnTestConfig.testConfigs.find(
      (el) => el.type === type
    );

    if (!testType) throw new Error('Test type is missing');

    return testType;
  };

  const buildColumnTests = (
    materializationId: string,
    columnId: string,
    columnType: string
  ): ReactElement => {
    const allowedTestTypes = getAllowedTestTypes(columnType);

    const columnFreshnessType: TestType = 'ColumnFreshness';
    const columnCardinalityType: TestType = 'ColumnCardinality';
    const columnUniquenessType: TestType = 'ColumnUniqueness';
    const columnDistributionType: TestType = 'ColumnDistribution';
    const columnNullnessType: TestType = 'ColumnNullness';

    return (
      <TableRow>
        <TableCell sx={tableCellSx} align="left">
          {getColumnTestConfig(materializationId, columnId).label}
        </TableCell>
        <TableCell sx={tableCellSx} align="center">
          <FormControl sx={{ m: 1, maxwidth: 100 }} size="small">
            <Select
              autoWidth={true}
              name={`frequency--${materializationId}--${columnId}`}
              disabled={
                !getColumnTestConfig(materializationId, columnId).testsActivated
              }
              displayEmpty={true}
              value={getFrequency(
                getColumnTestConfig(materializationId, columnId).cron
              )}
              onChange={handleColumnFrequencyChange}
              onClick={(e) => {
                handleColumnFrequencyClick(e.target, {
                  matId: materializationId,
                  colId: columnId,
                });
              }}
              sx={{ width: 100 }}
            >
              {frequencySelectionItems.map((el) => (
                <MenuItem value={el.value}>{el.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>

        <TableCell sx={tableCellSx} align="left">
          {allowedTestTypes.includes('ColumnFreshness') ? (
            <Button
              id={`${columnFreshnessType}--${materializationId}--${columnId}`}
              size="large"
              variant="contained"
              color={
                getTestConfig(
                  getColumnTestConfig(materializationId, columnId),
                  columnFreshnessType
                ).activated
                  ? 'primary'
                  : 'info'
              }
              onClick={handleTestSelectButtonClick}
            />
          ) : (
            <></>
          )}
        </TableCell>

        <TableCell sx={tableCellSx} align="left">
          {allowedTestTypes.includes('ColumnCardinality') ? (
            <Button
              id={`${columnCardinalityType}--${materializationId}--${columnId}`}
              size="large"
              variant="contained"
              color={
                getTestConfig(
                  getColumnTestConfig(materializationId, columnId),
                  columnCardinalityType
                ).activated
                  ? 'primary'
                  : 'info'
              }
              onClick={handleTestSelectButtonClick}
            />
          ) : (
            <></>
          )}
        </TableCell>

        <TableCell sx={tableCellSx} align="left">
          {allowedTestTypes.includes('ColumnNullness') ? (
            <Button
              id={`${columnNullnessType}--${materializationId}--${columnId}`}
              size="large"
              variant="contained"
              color={
                getTestConfig(
                  getColumnTestConfig(materializationId, columnId),
                  columnNullnessType
                ).activated
                  ? 'primary'
                  : 'info'
              }
              onClick={handleTestSelectButtonClick}
            />
          ) : (
            <></>
          )}
        </TableCell>

        <TableCell sx={tableCellSx} align="left">
          {allowedTestTypes.includes('ColumnUniqueness') ? (
            <Button
              id={`${columnUniquenessType}--${materializationId}--${columnId}`}
              size="large"
              variant="contained"
              color={
                getTestConfig(
                  getColumnTestConfig(materializationId, columnId),
                  columnUniquenessType
                ).activated
                  ? 'primary'
                  : 'info'
              }
              onClick={handleTestSelectButtonClick}
            />
          ) : (
            <></>
          )}
        </TableCell>

        <TableCell sx={tableCellSx} align="left">
          {allowedTestTypes.includes('ColumnDistribution') ? (
            <Button
              id={`${columnDistributionType}--${materializationId}--${columnId}`}
              size="large"
              variant="contained"
              color={
                getTestConfig(
                  getColumnTestConfig(materializationId, columnId),
                  columnDistributionType
                ).activated
                  ? 'primary'
                  : 'info'
              }
              onClick={handleTestSelectButtonClick}
            />
          ) : (
            <></>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const buildTestSelectionStructure = (): {
    [key: string]: MaterializationTestsConfig;
  } => {
    const testSelectionStructure: {
      [key: string]: MaterializationTestsConfig;
    } = {};

    materializations.forEach((materialization) => {
      const columnTestConfigs: ColumnTestConfig[] = [];

      const relevantColumns = columns.filter(
        (column) => column.materializationId === materialization.id
      );

      const materializationLabel = `${
        materialization.databaseName ? `${materialization.databaseName}.` : ''
      }${materialization.schemaName ? `${materialization.schemaName}.` : ''}${
        materialization.name
      }`;
      if (typeof materializationLabel !== 'string')
        throw new Error('Materialization label not of type string');

      relevantColumns.forEach((column) => {
        const columnLabel = column.name;
        if (typeof columnLabel !== 'string')
          throw new Error('Column label not of type string');

        const allowedTests = getAllowedTestTypes(column.dataType);

        const suites = testSuites.filter(
          (el) => el.target.targetResourceId === column.id
        );

        let testsActivated = false;

        columnTestConfigs.push({
          id: column.id,
          type: column.dataType,
          label: columnLabel,
          cron: suites.length ? suites[0].cron : buildCronExpression('3h'),
          executionType: suites.length ? suites[0].executionType : 'frequency',
          threshold: suites.length ? suites[0].threshold : 3,
          testConfigs: allowedTests.map((element) => {
            const typeSpecificSuite = suites.find((el) => el.type === element);

            if (
              !testsActivated &&
              typeSpecificSuite &&
              typeSpecificSuite.activated
            )
              testsActivated = true;

            return {
              type: element,
              activated: typeSpecificSuite
                ? typeSpecificSuite.activated
                : false,
              testSuiteId: typeSpecificSuite?.id,
            };
          }),
          testsActivated,
          importanceThreshold: suites.length
            ? suites[0].importanceThreshold
            : -1,
          boundsIntervalRelative: suites.length
            ? suites[0].boundsIntervalRelative
            : 0,
        });
      });

      const testDefinitionSummary: TestDefinitionSummary[] = [
        {
          type: 'ColumnCardinality',
          activationCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnCardinality' && el.activated
              ).length
          ).length,
          totalCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnCardinality'
              ).length
          ).length,
        },
        {
          type: 'ColumnDistribution',
          activationCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnDistribution' && el.activated
              ).length
          ).length,
          totalCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnDistribution'
              ).length
          ).length,
        },
        {
          type: 'ColumnFreshness',
          activationCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnFreshness' && el.activated
              ).length
          ).length,
          totalCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter((el) => el.type === 'ColumnFreshness')
                .length
          ).length,
        },
        {
          type: 'ColumnNullness',
          activationCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnNullness' && el.activated
              ).length
          ).length,
          totalCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter((el) => el.type === 'ColumnNullness')
                .length
          ).length,
        },
        {
          type: 'ColumnUniqueness',
          activationCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnUniqueness' && el.activated
              ).length
          ).length,
          totalCount: columnTestConfigs.filter(
            (config) =>
              !!config.testConfigs.filter(
                (el) => el.type === 'ColumnUniqueness'
              ).length
          ).length,
        },
      ];

      const uniqueCronValues = Array.from(
        new Set(
          columnTestConfigs
            .filter((el) => el.testsActivated)
            .map((el) => el.cron)
        )
      );
      const uniqueThresholdValues = Array.from(
        new Set(
          columnTestConfigs
            .filter((el) => el.testsActivated)
            .map((el) => el.threshold)
        )
      );

      const materializationSuites = testSuites.filter(
        (el) => el.target.targetResourceId === materialization.id
      );

      const matQualTestSuites = qualTestSuites.filter(
        (el) => el.target.targetResourceId === materialization.id
      );

      const matchCountError = (testType: TestType) => {
        throw new Error(
          `Multiple mat test suites for ${testType} test type in place`
        );
      };

      const matColumnCountMatches = materializationSuites.filter(
        (el) => el.type === 'MaterializationColumnCount'
      );
      if (matColumnCountMatches.length > 1)
        matchCountError('MaterializationColumnCount');

      const matRowCountMatches = materializationSuites.filter(
        (el) => el.type === 'MaterializationRowCount'
      );
      if (matRowCountMatches.length > 1)
        matchCountError('MaterializationRowCount');

      const matFreshnessMatches = materializationSuites.filter(
        (el) => el.type === 'MaterializationFreshness'
      );
      if (matFreshnessMatches.length > 1)
        matchCountError('MaterializationFreshness');

      const matSchemaChangeMatches = matQualTestSuites.filter(
        (el) => el.type === 'MaterializationSchemaChange'
      );
      if (matSchemaChangeMatches.length > 1)
        matchCountError('MaterializationSchemaChange');

      const tableTestSelectionStructure: MaterializationTestsConfig = {
        label: materializationLabel,
        navExpanded: false,
        columnTestConfigs: columnTestConfigs,
        cron: uniqueCronValues.length === 1 ? uniqueCronValues[0] : undefined,
        threshold:
          uniqueThresholdValues.length === 1
            ? uniqueThresholdValues[0]
            : undefined,
        testDefinitionSummary,
        testsActivated: false,
        materializationTestConfigs: [
          {
            type: 'MaterializationColumnCount',
            activated: matColumnCountMatches.length
              ? matColumnCountMatches[0].activated
              : false,
            testSuiteId: matColumnCountMatches.length
              ? matColumnCountMatches[0].id
              : undefined,
          },
          {
            type: 'MaterializationRowCount',
            activated: matRowCountMatches.length
              ? matRowCountMatches[0].activated
              : false,
            testSuiteId: matRowCountMatches.length
              ? matRowCountMatches[0].id
              : undefined,
          },
          {
            type: 'MaterializationFreshness',
            activated: matFreshnessMatches.length
              ? matFreshnessMatches[0].activated
              : false,
            testSuiteId: matFreshnessMatches.length
              ? matFreshnessMatches[0].id
              : undefined,
          },
          {
            type: 'MaterializationSchemaChange',
            activated: matSchemaChangeMatches.length
              ? matSchemaChangeMatches[0].activated
              : false,
            testSuiteId: matSchemaChangeMatches.length
              ? matSchemaChangeMatches[0].id
              : undefined,
          },
        ],
      };

      testSelectionStructure[materialization.id] = tableTestSelectionStructure;
    });

    return testSelectionStructure;
  };

  const getMatTestConfig = (matId: string, testType: TestType) => {
    const config = testSelection[matId].materializationTestConfigs.find(
      (el) => el.type === testType
    );

    if (!config) throw new Error('Mat test config not found.');

    return config;
  };

  const getSummaryConfig = (matId: string, testType: TestType) => {
    const summaryConfig = testSelection[matId].testDefinitionSummary.find(
      (el) => el.type === testType
    );

    if (!summaryConfig) throw new Error('Summary config not found.');

    return summaryConfig;
  };

  const Test = (props: { materializationId: string }): ReactElement => {
    const materializationTestSelection = testSelection[props.materializationId];

    const [open, setOpen] = React.useState(
      materializationTestSelection.navExpanded
    );

    const columnElements = materializationTestSelection.columnTestConfigs.map(
      (el, index) =>
        buildColumnTests(
          props.materializationId,
          el.id,
          materializationTestSelection.columnTestConfigs[index].type
        )
    );

    const columnFreshnessType: TestType = 'ColumnFreshness';
    const columnCardinalityType: TestType = 'ColumnCardinality';
    const columnUniquenessType: TestType = 'ColumnUniqueness';
    const columnDistributionType: TestType = 'ColumnDistribution';
    const columnNullnessType: TestType = 'ColumnNullness';

    const materializationColumnCountType: TestType =
      'MaterializationColumnCount';
    const materializationRowCountType: TestType = 'MaterializationRowCount';
    const materializationFreshnessType: TestType = 'MaterializationFreshness';
    const materializationSchemaChangeType: TestType =
      'MaterializationSchemaChange';

    const columnFreshnessSummary: TestDefinitionSummary = getSummaryConfig(
      props.materializationId,
      columnFreshnessType
    );
    const columnCardinalitySummary: TestDefinitionSummary = getSummaryConfig(
      props.materializationId,
      columnCardinalityType
    );
    const columnUniquenessSummary: TestDefinitionSummary = getSummaryConfig(
      props.materializationId,
      columnUniquenessType
    );
    const columnDistributionSummary: TestDefinitionSummary = getSummaryConfig(
      props.materializationId,
      columnDistributionType
    );
    const columnNullnessSummary: TestDefinitionSummary = getSummaryConfig(
      props.materializationId,
      columnNullnessType
    );
    const materializationColumnCountConfig: TestConfig = getMatTestConfig(
      props.materializationId,
      materializationColumnCountType
    );
    const materializationRowCountConfig: TestConfig = getMatTestConfig(
      props.materializationId,
      materializationRowCountType
    );
    const materializationFreshnessConfig: TestConfig = getMatTestConfig(
      props.materializationId,
      materializationFreshnessType
    );
    const materializationSchemaChangeConfig: TestConfig = getMatTestConfig(
      props.materializationId,
      materializationSchemaChangeType
    );

    const cron = testSelection[props.materializationId].cron;

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell sx={tableNameSx} component="th" scope="row">
            {testSelection[props.materializationId].label}
          </TableCell>
          <TableCell sx={tableCellSx} align="center">
            <FormControl sx={{ m: 1 }} size="small">
              <Select
                name={`frequency--${props.materializationId}`}
                disabled={
                  !testSelection[
                    props.materializationId
                  ].columnTestConfigs.some((el) => el.testsActivated)
                }
                displayEmpty={true}
                value={cron ? getFrequency(cron) : ''}
                onChange={handleMatFrequencyChange}
                onClick={(e) => {
                  handleMatFrequencyClick(e.target, {
                    matId: props.materializationId,
                  });
                }}
                sx={{ width: 100 }}
              >
                {frequencySelectionItems.map((el) => (
                  <MenuItem value={el.value}>{el.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </TableCell>

          <TableCell sx={tableCellSx} align="left">
            {columnFreshnessSummary.totalCount ? (
              <Button
                id={`${columnFreshnessType}--${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  columnFreshnessSummary.activationCount &&
                  columnFreshnessSummary.activationCount ===
                    columnFreshnessSummary.totalCount
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatLevelColumnTestButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                columnFreshnessSummary.activationCount ? 'primary' : 'secondary'
              }
              variant={
                columnFreshnessSummary.activationCount ? 'filled' : 'outlined'
              }
              label={`${columnFreshnessSummary.activationCount}/${columnFreshnessSummary.totalCount}`}
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {columnCardinalitySummary.totalCount ? (
              <Button
                id={`${columnCardinalityType}--${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  columnCardinalitySummary.activationCount &&
                  columnCardinalitySummary.activationCount ===
                    columnCardinalitySummary.totalCount
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatLevelColumnTestButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                columnCardinalitySummary.activationCount
                  ? 'primary'
                  : 'secondary'
              }
              variant={
                columnCardinalitySummary.activationCount ? 'filled' : 'outlined'
              }
              label={`${columnCardinalitySummary.activationCount}/${columnCardinalitySummary.totalCount}`}
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {columnNullnessSummary.totalCount ? (
              <Button
                id={`${columnNullnessType}--${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  columnNullnessSummary.activationCount &&
                  columnNullnessSummary.activationCount ===
                    columnNullnessSummary.totalCount
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatLevelColumnTestButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                columnNullnessSummary.activationCount ? 'primary' : 'secondary'
              }
              variant={
                columnNullnessSummary.activationCount ? 'filled' : 'outlined'
              }
              label={`${columnNullnessSummary.activationCount}/${columnNullnessSummary.totalCount}`}
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {columnUniquenessSummary.totalCount ? (
              <Button
                id={`${columnUniquenessType}--${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  columnUniquenessSummary.activationCount &&
                  columnUniquenessSummary.activationCount ===
                    columnUniquenessSummary.totalCount
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatLevelColumnTestButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                columnUniquenessSummary.activationCount
                  ? 'primary'
                  : 'secondary'
              }
              label={`${columnUniquenessSummary.activationCount}/${columnUniquenessSummary.totalCount}`}
              variant={
                columnUniquenessSummary.activationCount ? 'filled' : 'outlined'
              }
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {columnDistributionSummary.totalCount ? (
              <Button
                id={`${columnDistributionType}--${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  columnDistributionSummary.activationCount &&
                  columnDistributionSummary.activationCount ===
                    columnDistributionSummary.totalCount
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatLevelColumnTestButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                columnDistributionSummary.activationCount
                  ? 'primary'
                  : 'secondary'
              }
              label={`${columnDistributionSummary.activationCount}/${columnDistributionSummary.totalCount}`}
              variant={
                columnDistributionSummary.activationCount
                  ? 'filled'
                  : 'outlined'
              }
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            <Button
              id={`${materializationRowCountType}--${props.materializationId}`}
              size="large"
              variant="contained"
              color={
                materializationRowCountConfig.activated ? 'primary' : 'info'
              }
              onClick={handleMatTestButtonClick}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            <Button
              id={`${materializationColumnCountType}--${props.materializationId}`}
              size="large"
              variant="contained"
              color={
                materializationColumnCountConfig.activated ? 'primary' : 'info'
              }
              onClick={handleMatTestButtonClick}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            <Button
              id={`${materializationFreshnessType}--${props.materializationId}`}
              size="large"
              variant="contained"
              color={
                materializationFreshnessConfig.activated ? 'primary' : 'info'
              }
              onClick={handleMatTestButtonClick}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            <Button
              id={`${materializationSchemaChangeType}--${props.materializationId}`}
              size="large"
              variant="contained"
              color={
                materializationSchemaChangeConfig.activated ? 'primary' : 'info'
              }
              onClick={handleMatTestButtonClick}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open);
                const testSelectionLocal = testSelection;

                testSelectionLocal[props.materializationId].navExpanded = !open;
                setTestSelection({
                  ...testSelectionLocal,
                });
              }}
            >
              {open ? <MdExpandMore /> : <MdChevronRight />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            sx={tableCellSx}
            align="center"
            style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 30 }}
            colSpan={10}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={311}
                        align="left"
                      >
                        Column Name
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={90}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="center"
                      ></TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                      ></TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                      ></TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                      ></TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                      ></TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                      ></TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                      ></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{columnElements}</TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  const renderTests = () => {
    setUser(undefined);
    setJwt('');
    setAccount(undefined);

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.federatedSignIn();
      });
  };

  useEffect(renderTests, []);

  useEffect(() => {
    if (!user) return;

    Auth.currentSession()
      .then((session) => {
        const accessToken = session.getAccessToken();

        const token = accessToken.getJwtToken();
        setJwt(token);

        return AccountApiRepository.getBy(new URLSearchParams({}), token);
      })
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setAccount(accounts[0]);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.signOut();
      });
  }, [user]);

  useEffect(() => {
    if (!account || lineage) return;

    if (!jwt) throw new Error('No user authorization found');

    if (showRealData) {
      LineageApiRepository.getLatest(jwt, false)
        // LineageApiRepository.getOne('633c7c5be2f3d7a22896fb62', jwt)
        .then((lineageDto) => {
          if (!lineageDto)
            throw new TypeError('Queried lineage object not found');
          setLineage(lineageDto);
          return MaterializationsApiRepository.getBy(
            new URLSearchParams({}),
            jwt
          );
        })
        .then((materializationDtos) => {
          setMaterializations(materializationDtos);
          return ColumnsApiRepository.getBy(new URLSearchParams({}), jwt);
        })
        .then((columnDtos) => {
          setColumns(columnDtos);

          return ObservabilityApiRepo.getQualTestSuites(jwt);
        })
        .then((qualTestSuiteDtos) => {
          setQualTestSuites(qualTestSuiteDtos);
          return ObservabilityApiRepo.getTestSuites(jwt);
        })
        .then((testSuiteDtos) => {
          setInitialLoadCompleted(true);
          setTestSuites(testSuiteDtos);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(error);
        });
    } else {
      setLineage({
        id: 'todo',
        createdAt: '',
        completed: true,
        dbCoveredNames: [],
        diff: '',
      });
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    if (!initialLoadCompleted) return;

    setReadyToBuild(true);
  }, [testSuites]);

  useEffect(() => {
    if (!readyToBuild) return;

    if (!materializations.length) throw new Error('Materializations missing');
    if (!columns.length) throw new Error('Columns missing');

    setTestSelection(buildTestSelectionStructure());

    setReadyToBuild(false);
  }, [readyToBuild]);

  useEffect(() => {
    if (
      !Object.keys(testSelection).length ||
      Object.keys(searchedTestSelection).length
    )
      return;

    setSearchedTestSelection(testSelection);
  }, [testSelection]);

  useEffect(() => {
    if (
      schedulerProps.show ||
      !schedulerProps.target ||
      !schedulerProps.cronExp
    )
      return;

    const colId = schedulerProps.target.colId;
    if (colId) {
      changeColumnFrequency(
        { matId: schedulerProps.target.matId, colId },
        {
          cron: schedulerProps.cronExp,
          executionType: 'frequency',
        }
      );
    } else {
      changeMatFrequency(
        { matId: schedulerProps.target.matId },
        { cron: schedulerProps.cronExp, executionType: 'frequency' }
      );
    }

    setSchedulerProps({
      ...schedulerProps,
      target: undefined,
      cronExp: undefined,
    });
  }, [schedulerProps]);

  return (
    <ThemeProvider theme={theme}>
      <div id="lineageContainer">
        <Navbar current="tests" jwt={jwt} />
        <>
          <div className="items-top relative flex h-20 justify-center">
            <div className="relative mt-2 w-1/4">
              <SearchBox
                placeholder="Search..."
                label="testsearchbox"
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer
              sx={{ height: window.innerHeight - 50 - 67 - 52 - 20 }}
            >
              {isLoading ? (
                <LoadingScreen tailwindCss="flex w-full items-center justify-center" />
              ) : (
                <Table stickyHeader={true} aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={tableNameSx}
                        width={350}
                        style={{ verticalAlign: 'top' }}
                      >
                        Table Name
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={90}
                        align="center"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Frequency</p>
                        <p></p>
                      </TableCell>

                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Column</p>
                        <p>Freshness</p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Cardinality</p>
                        <p></p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Nullness</p>
                        <p></p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Uniqueness</p>
                        <p></p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Distribution</p>
                        <p></p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Row</p>
                        <p>Count</p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Column</p>
                        <p>Count</p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Table</p>
                        <p>Freshness</p>
                      </TableCell>
                      <TableCell
                        sx={tableHeaderCellSx}
                        width={135}
                        align="left"
                        style={{ verticalAlign: 'top' }}
                      >
                        <p>Schema</p>

                        <p>Change</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(searchedTestSelection).length ? (
                      Object.keys(searchedTestSelection)
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((materializationId) => {
                          return (
                            <Test materializationId={materializationId}></Test>
                          );
                        })
                    ) : (
                      <></>
                    )}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={10} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={Object.keys(searchedTestSelection).length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      </div>
      <Scheduler
        show={schedulerProps.show}
        closeCallback={closeSchedulerCallback}
        createdScheduleCallback={createdScheduleCallback}
        cronExpression={schedulerProps.cronExp}
      />
    </ThemeProvider>
  );
};
