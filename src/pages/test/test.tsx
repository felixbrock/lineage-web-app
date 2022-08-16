import React, { ReactElement, useEffect, useState } from 'react';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import LogoutIcon from '@mui/icons-material/Logout';
import AppsIcon from '@mui/icons-material/Apps';
import TableChartIcon from '@mui/icons-material/TableChart';
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

import Logo from '../../components/top-nav/cito-header.png';
import './test.scss';
import { MdChevronRight, MdExpandMore } from 'react-icons/md';

import LineageApiRepository from '../../infrastructure/lineage-api/lineage/lineage-api-repository';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import LineageDto from '../../infrastructure/lineage-api/lineage/lineage-dto';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import AccountApiRepository from '../../infrastructure/account-api/account-api-repo';

import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth } from 'aws-amplify';

import { useNavigate, useSearchParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';
import ObservabilityApiRepo from '../../infrastructure/observability-api/observability-api-repo';
import { Alert, Snackbar } from '@mui/material';

const showRealData = true;
const lineageId = '62f90bec34a8584bd1f6534a';

export const testTypes = [
  'ColumnFreshness',
  'ColumnCardinality',
  'ColumnUniqueness',
  'ColumnNullness',
  'ColumnDistribution',
  'MaterializationRowCount',
  'MaterializationColumnCount',
  'MaterializationFreshness',
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

interface TestConfig {
  type: TestType;
  activated: boolean;
}

interface ColumnTestConfig {
  id: string;
  label: string;
  type: string;
  frequency: string;
  sensitivity: string;
  testConfig: TestConfig[];
  testsActivated: boolean;
}

interface TestDefinitionSummary {
  type: TestType;
  activationCount: number;
  totalCount: number;
}

interface MaterializationTestsConfig {
  columnTestSelection: ColumnTestConfig[];
  navExpanded: boolean;
  label: string;
  frequency: string;
  sensitivity: string;
  testDefinitionSummary: TestDefinitionSummary[];
  testsActivated: boolean;
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
  const navigate = useNavigate();

  const [accountId, setAccountId] = useState('');
  const [user, setUser] = useState<any>();
  const [jwt, setJwt] = useState('');

  const [lineage, setLineage] = useState<LineageDto>();
  const [materializations, setMaterializations] = useState<
    MaterializationDto[]
  >([]);
  const [columns, setColumns] = useState<ColumnDto[]>([]);
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [testSelection, setTestSelection] = useState<{
    [key: string]: MaterializationTestsConfig;
  }>({});
  const [searchedTestSelection, setSearchedTestSelection] = useState<{
    [key: string]: MaterializationTestsConfig;
  }>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchParams] = useSearchParams();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
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

  const handleColumnFrequencyChange = (event: any) => {
    const name = event.target.name as string;
    const props = name.split('-');

    const testSelectionLocal = testSelection;

    testSelectionLocal[props[1]].frequency = '';

    const columnTestConfigIndex = testSelectionLocal[
      props[1]
    ].columnTestSelection.findIndex((el) => el.id === props[2]);

    if (columnTestConfigIndex === -1)
      throw new Error('Column Test Config not found');

    testSelectionLocal[props[1]].columnTestSelection[
      columnTestConfigIndex
    ].frequency = event.target.value;

    setTestSelection({ ...testSelectionLocal });
  };

  const handleMatFrequencyChange = (event: any) => {
    const name = event.target.name as string;
    const props = name.split('-');

    const testSelectionLocal = testSelection;

    testSelectionLocal[props[1]].frequency = event.target.value;

    Object.keys(testSelectionLocal[props[1]].columnTestSelection).forEach(
      (key, index) =>
        (testSelectionLocal[props[1]].columnTestSelection[index].frequency =
          event.target.value)
    );

    setTestSelection({ ...testSelectionLocal });
  };

  const handleColumnSensitivityChange = (event: any) => {
    const name = event.target.name as string;
    const props = name.split('-');

    const testSelectionLocal = testSelection;

    testSelectionLocal[props[1]].sensitivity = '';

    const columnTestConfigIndex = testSelectionLocal[
      props[1]
    ].columnTestSelection.findIndex((el) => el.id === props[2]);

    if (columnTestConfigIndex === -1)
      throw new Error('Column Test Config not found');

    testSelectionLocal[props[1]].columnTestSelection[
      columnTestConfigIndex
    ].sensitivity = event.target.value;

    setTestSelection({ ...testSelectionLocal });
  };

  const handleMatSensitivityChange = (event: any) => {
    const name = event.target.name as string;
    const props = name.split('-');

    const testSelectionLocal = testSelection;

    testSelectionLocal[props[1]].sensitivity = event.target.value;

    Object.keys(testSelectionLocal[props[1]].columnTestSelection).forEach(
      (key, index) =>
        (testSelectionLocal[props[1]].columnTestSelection[index].sensitivity =
          event.target.value)
    );

    setTestSelection({ ...testSelectionLocal });
  };

  const handleSearchChange = (event: any) => {
    const testSelectionKeys = Object.keys(testSelection);
    if (!testSelectionKeys.length) return;

    const value = event.target.value;
    if (!value) {
      setSearchedTestSelection(testSelection);
      return;
    }

    const newTestSelectionElements: {
      [key: string]: MaterializationTestsConfig;
    } = {};

    testSelectionKeys.forEach((key) => {
      if (testSelection[key].label.includes(value))
        newTestSelectionElements[key] = testSelection[key];
    });

    setSearchedTestSelection(newTestSelectionElements);
  };

  const getAllowedTestTypes = (columnType: string): TestType[] => {
    if (!Object.keys(snowflakeTypes).includes(columnType.toLowerCase()))
      throw new Error(`Invalid column type (${columnType}) provided`);
    return snowflakeTypes[columnType.toLowerCase()];
  };

  const handleTestSelectButtonClick = (event: any) => {
    const id = event.target.id as string;
    const props = id.split('-');

    const type = parseTestType(props[0]);

    const testSelectionLocal = testSelection;

    const columnTestConfigIndex = testSelectionLocal[
      props[1]
    ].columnTestSelection.findIndex((el) => el.id === props[2]);

    if (columnTestConfigIndex === -1)
      throw new Error('Column Test Config not found');

    const testConfigIndex = testSelectionLocal[props[1]].columnTestSelection[
      columnTestConfigIndex
    ].testConfig.findIndex((el) => el.type === type);

    if (testConfigIndex === -1) throw new Error('Test Config not found');

    testSelectionLocal[props[1]].columnTestSelection[
      columnTestConfigIndex
    ].testConfig[testConfigIndex].activated =
      !testSelectionLocal[props[1]].columnTestSelection[columnTestConfigIndex]
        .testConfig[testConfigIndex].activated;

    const activated = testSelectionLocal[props[1]].columnTestSelection[
      columnTestConfigIndex
    ].testConfig.some((el) => el.activated);

    testSelectionLocal[props[1]].columnTestSelection[
      columnTestConfigIndex
    ].testsActivated = activated;

    const matActivated: boolean = testSelectionLocal[
      props[1]
    ].testDefinitionSummary.some((el) => !!el.activationCount);

    testSelectionLocal[props[1]].testsActivated = matActivated;

    const totalCounter = testSelectionLocal[
      props[1]
    ].columnTestSelection.filter(
      (element) => !!element.testConfig.filter((el) => el.type === type).length
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
    ].columnTestSelection.filter(
      (element) =>
        !!element.testConfig.filter((el) => el.type === type && el.activated)
          .length
    ).length;

    testSelectionLocal[props[1]].testDefinitionSummary[
      summaryIndex
    ].activationCount = activatedCounter;

    setTestSelection({ ...testSelectionLocal });
  };

  const handleMatTestSelectButtonClick = (event: any) => {
    const id = event.target.id as string;
    const props = id.split('-');

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

    const totalCounter = testSelectionLocal[
      props[1]
    ].columnTestSelection.filter(
      (element) => !!element.testConfig.filter((el) => el.type === type).length
    ).length;

    testSelectionLocal[props[1]].testDefinitionSummary[
      summaryIndex
    ].totalCount = totalCounter;

    testSelectionLocal[props[1]].columnTestSelection.forEach(
      (config, index) => {
        const testConfigIndex = testSelectionLocal[
          props[1]
        ].columnTestSelection[index].testConfig.findIndex(
          (el) => el.type === type
        );

        if (testConfigIndex === -1) throw new Error('Type summary not found');

        testSelectionLocal[props[1]].columnTestSelection[index].testConfig[
          testConfigIndex
        ].activated =
          !!testSelectionLocal[props[1]].testDefinitionSummary[summaryIndex]
            .activationCount;

        const activated =
          testSelectionLocal[props[1]].columnTestSelection[key]
            .cardinalityActivated ||
          testSelectionLocal[props[1]].columnTestSelection[key]
            .distributionActivated ||
          testSelectionLocal[props[1]].columnTestSelection[key]
            .freshnessActivated ||
          testSelectionLocal[props[1]].columnTestSelection[key]
            .nullnessActivated ||
          testSelectionLocal[props[1]].columnTestSelection[key]
            .uniquenessActivated;

        testSelectionLocal[props[1]].columnTestSelection[key].testsActivated =
          activated;
      }
    );

    testSelectionLocal[props[1]][`${type}Count`] = testActivated ? total : 0;

    const activated =
      testSelectionLocal[props[1]].cardinalityActivated ||
      testSelectionLocal[props[1]].distributionActivated ||
      testSelectionLocal[props[1]].freshnessActivated ||
      testSelectionLocal[props[1]].nullnessActivated ||
      testSelectionLocal[props[1]].uniquenessActivated;

    testSelectionLocal[props[1]].testsActivated = activated;

    setTestSelection({ ...testSelectionLocal });
  };

  const buildColumnTests = (
    materializationId: string,
    columnId: string,
    columnType: string
  ): ReactElement => {
    const allowedTestTypes = getAllowedTestTypes(columnType);

    return (
      <TableRow>
        <TableCell sx={tableCellSx} align="left">
          {
            testSelection[materializationId].columnTestSelection.find(
              (el) => el.id === columnId
            ).label
          }
        </TableCell>
        <TableCell sx={tableCellSx} align="center">
          <FormControl sx={{ m: 1, maxwidth: 100 }} size="small">
            <Select
              name={`frequency-${materializationId}-${columnId}`}
              disabled={
                !testSelection[materializationId].columnTestSelection[columnId]
                  .testsActivated
              }
              displayEmpty={true}
              renderValue={(value) =>
                value ||
                testSelection[materializationId].columnTestSelection[columnId]
                  .frequency
              }
              value={
                testSelection[materializationId].columnTestSelection[columnId]
                  .frequency
              }
              onChange={handleColumnFrequencyChange}
            >
              <MenuItem value={'1h'}>1h</MenuItem>
              <MenuItem value={'3h'}>3h</MenuItem>
              <MenuItem value={'6h'}>6h</MenuItem>
              <MenuItem value={'12h'}>12h</MenuItem>
              <MenuItem value={'1d'}>1d</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell sx={tableCellSx} align="center">
          <FormControl sx={{ m: 1 }} size="small">
            <Select
              name={`sensitivity-${materializationId}-${columnId}`}
              disabled={
                !testSelection[materializationId].columnTestSelection[columnId]
                  .testsActivated
              }
              displayEmpty={true}
              renderValue={(value) =>
                value ||
                testSelection[materializationId].columnTestSelection[columnId]
                  .sensitivity
              }
              value={
                testSelection[materializationId].columnTestSelection[columnId]
                  .sensitivity
              }
              onChange={handleColumnSensitivityChange}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
        </TableCell>

        <TableCell sx={tableCellSx} align="left">
          {allowedTestTypes.includes('ColumnFreshness') ? (
            <Button
              id={`freshnessActivated-${materializationId}-${columnId}`}
              size="large"
              variant="contained"
              color={
                testSelection[materializationId].columnTestSelection[columnId]
                  .freshnessActivated
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
              id={`cardinalityActivated-${materializationId}-${columnId}`}
              size="large"
              variant="contained"
              color={
                testSelection[materializationId].columnTestSelection[columnId]
                  .cardinalityActivated
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
              id={`nullnessActivated-${materializationId}-${columnId}`}
              size="large"
              variant="contained"
              color={
                testSelection[materializationId].columnTestSelection[columnId]
                  .nullnessActivated
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
              id={`uniquenessActivated-${materializationId}-${columnId}`}
              size="large"
              variant="contained"
              color={
                testSelection[materializationId].columnTestSelection[columnId]
                  .uniquenessActivated
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
              id={`distributionActivated-${materializationId}-${columnId}`}
              size="large"
              variant="contained"
              color={
                testSelection[materializationId].columnTestSelection[columnId]
                  .distributionActivated
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

      const tableTestSelectionStructure: MaterializationTestsConfig = {
        label: materializationLabel,
        navExpanded: false,
        columnTestSelection: {},
        frequency: '1h',
        sensitivity: '0',
        distributionActivated: false,
        distributionActivatedCount: 0,
        freshnessActivated: false,
        freshnessActivatedCount: 0,
        cardinalityActivated: false,
        cardinalityActivatedCount: 0,
        nullnessActivated: false,
        nullnessActivatedCount: 0,
        uniquenessActivated: false,
        uniquenessActivatedCount: 0,
        columnCount: relevantColumns.length,
        testsActivated: false,
      };

      relevantColumns.forEach((column) => {
        const columnLabel = column.name;
        if (typeof columnLabel !== 'string')
          throw new Error('Column label not of type string');

        const allowedTests = getAllowedTestTypes(column.type);

        return (tableTestSelectionStructure.columnTestSelection[column.id] = {
          id: column.id,
          type: column.type,
          label: columnLabel,
          frequency: '1h',
          sensitivity: '0',
          testConfig: allowedTests.map((element) => ({
            type: element,
            activated: false,
          })),
        });
      });

      testSelectionStructure[materialization.id] = tableTestSelectionStructure;
    });

    return testSelectionStructure;
  };

  const Test = (props: { materializationId: string }): ReactElement => {
    const materializationTestSelection = testSelection[props.materializationId];

    const [open, setOpen] = React.useState(
      materializationTestSelection.navExpanded
    );

    const columnElements = Object.keys(
      materializationTestSelection.columnTestSelection
    ).map((key) =>
      buildColumnTests(
        props.materializationId,
        key,
        materializationTestSelection.columnTestSelection[key].type
      )
    );

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell sx={tableNameSx} component="th" scope="row">
            {testSelection[props.materializationId].label}
          </TableCell>
          <TableCell sx={tableCellSx} align="center">
            <FormControl sx={{ m: 1 }} size="small">
              <Select
                name={`frequency-${props.materializationId}`}
                disabled={
                  !testSelection[props.materializationId].testsActivated
                }
                displayEmpty={true}
                renderValue={(value) =>
                  value || testSelection[props.materializationId].frequency
                }
                value={testSelection[props.materializationId].frequency}
                onChange={handleMatFrequencyChange}
              >
                <MenuItem value={'1h'}>1h</MenuItem>
                <MenuItem value={'3h'}>3h</MenuItem>
                <MenuItem value={'6h'}>6h</MenuItem>
                <MenuItem value={'12h'}>12h</MenuItem>
                <MenuItem value={'1d'}>1d</MenuItem>
              </Select>
            </FormControl>
          </TableCell>
          <TableCell sx={tableCellSx} align="center">
            <FormControl sx={{ m: 1 }} size="small">
              <Select
                name={`sensitivity-${props.materializationId}`}
                disabled={
                  !testSelection[props.materializationId].testsActivated
                }
                displayEmpty={true}
                renderValue={(value) =>
                  value || testSelection[props.materializationId].sensitivity
                }
                value={testSelection[props.materializationId].sensitivity}
                onChange={handleMatSensitivityChange}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {matColumnFreshnessCount ? (
              <Button
                id={`freshnessActivated-${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  testSelection[props.materializationId].freshnessActivated
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatTestSelectButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                testSelection[props.materializationId].freshnessActivatedCount
                  ? 'primary'
                  : 'secondary'
              }
              variant={
                testSelection[props.materializationId].freshnessActivatedCount
                  ? 'filled'
                  : 'outlined'
              }
              label={`${
                testSelection[props.materializationId].freshnessActivatedCount
              }/${matColumnFreshnessCount}`}
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {matColumnCardinalityCount ? (
              <Button
                id={`cardinalityActivated-${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  testSelection[props.materializationId].cardinalityActivated
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatTestSelectButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                testSelection[props.materializationId].cardinalityActivatedCount
                  ? 'primary'
                  : 'secondary'
              }
              variant={
                testSelection[props.materializationId].cardinalityActivatedCount
                  ? 'filled'
                  : 'outlined'
              }
              label={`${
                testSelection[props.materializationId].cardinalityActivatedCount
              }/${matColumnCardinalityCount}`}
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {matColumnNullnessCount ? (
              <Button
                id={`nullnessActivated-${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  testSelection[props.materializationId].nullnessActivated
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatTestSelectButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                testSelection[props.materializationId].nullnessActivatedCount
                  ? 'primary'
                  : 'secondary'
              }
              variant={
                testSelection[props.materializationId].nullnessActivatedCount
                  ? 'filled'
                  : 'outlined'
              }
              label={`${
                testSelection[props.materializationId].nullnessActivatedCount
              }/${matColumnNullnessCount}`}
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {matColumnUniquenessCount ? (
              <Button
                id={`uniquenessActivated-${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  testSelection[props.materializationId].uniquenessActivated
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatTestSelectButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                testSelection[props.materializationId].uniquenessActivatedCount
                  ? 'primary'
                  : 'secondary'
              }
              label={`${
                testSelection[props.materializationId].uniquenessActivatedCount
              }/${matColumnUniquenessCount}`}
              variant={
                testSelection[props.materializationId].uniquenessActivatedCount
                  ? 'filled'
                  : 'outlined'
              }
              size="small"
              sx={{ m: 1 }}
            />
          </TableCell>
          <TableCell sx={tableCellSx} align="left">
            {matColumnDistributionCount ? (
              <Button
                id={`distributionActivated-${props.materializationId}`}
                size="large"
                variant="contained"
                color={
                  testSelection[props.materializationId].distributionActivated
                    ? 'primary'
                    : 'info'
                }
                onClick={handleMatTestSelectButtonClick}
              />
            ) : (
              <></>
            )}
            <Chip
              color={
                testSelection[props.materializationId]
                  .distributionActivatedCount
                  ? 'primary'
                  : 'secondary'
              }
              label={`${
                testSelection[props.materializationId]
                  .distributionActivatedCount
              }/${matColumnDistributionCount}`}
              variant={
                testSelection[props.materializationId]
                  .distributionActivatedCount
                  ? 'filled'
                  : 'outlined'
              }
              size="small"
              sx={{ m: 1 }}
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
    setAccountId('');

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

        setAccountId(accounts[0].id);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.signOut();
      });
  }, [user]);

  const handleUserFeedback = () => {
    if (!searchParams) return;

    const alertId = searchParams.get('alertId');
    if (!alertId) return;

    const userFeedbackIsAnomaly = searchParams.get('userFeedbackIsAnomaly');
    if (!userFeedbackIsAnomaly) return;
    ObservabilityApiRepo.updateTestHistoryEntry(
      { alertId, userFeedbackIsAnomaly },
      jwt
    )
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch(() => {
        console.trace(
          'Something went wrong saving user feedback to persistence'
        );
      });
  };

  useEffect(() => {
    if (!accountId || lineage) return;

    if (!jwt) throw new Error('No user authorization found');

    handleUserFeedback();

    if (showRealData) {
      LineageApiRepository.getOne(lineageId, jwt)
        .then((lineageDto) => {
          if (!lineageDto)
            throw new TypeError('Queried lineage object not found');
          setLineage(lineageDto);
          return MaterializationsApiRepository.getBy(
            new URLSearchParams({ lineageId: lineageId }),
            jwt
          );
        })
        .then((materializationDtos) => {
          setMaterializations(materializationDtos);
          return ColumnsApiRepository.getBy(
            new URLSearchParams({ lineageId: lineageId }),
            jwt
          );
        })
        .then((columnDtos) => {
          setColumns(columnDtos);
          setReadyToBuild(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setLineage({ id: 'todo', createdAt: 1 });
      setReadyToBuild(true);
    }
  }, [accountId]);

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

  return (
    <ThemeProvider theme={theme}>
      <div id="lineageContainer">
        <div className="navbar">
          <div id="menu-container">
            <img
              height="40"
              width="150"
              src={Logo}
              alt="logo"
              onClick={() =>
                navigate(`/lineage`, {
                  state: {},
                })
              }
            />
          </div>
          <div id="sign-out-container">
            <Box m={0.5}>
              <Button
                startIcon={<TableChartIcon />}
                onClick={() =>
                  navigate(`/lineage`, {
                    state: {},
                  })
                }
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#674BCE',
                  fontSize: '12px',
                }}
              >
                Lineage
              </Button>
            </Box>
            <Box m={0.5}>
              <Button
                startIcon={<AppsIcon />}
                onClick={() => navigate(`/test`)}
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#4EC4C4',
                  fontSize: '12px',
                }}
              >
                Tests
              </Button>
            </Box>
            <Box m={0.5}>
              <Button
                startIcon={<IntegrationInstructionsIcon />}
                onClick={() => console.log('todo-integration screen')}
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#674BCE',
                  fontSize: '12px',
                }}
              >
                Integrations
              </Button>
            </Box>
            <Box m={0.5}>
              <Button
                startIcon={<LogoutIcon />}
                onClick={() => Auth.signOut()}
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#A5A0A0',
                  fontSize: '12px',
                }}
              >
                Sign Out
              </Button>
            </Box>
          </div>
        </div>
        <>
          <div id="search-nav-container">
            <div id="search">
              <TextField
                label="Search"
                onChange={handleSearchChange}
                fullWidth={true}
                size="small"
              />
            </div>
          </div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ height: window.innerHeight - 50 - 67 - 52 }}>
              <Table stickyHeader={true} aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableNameSx} width={350}>
                      {' '}
                      Table Name
                    </TableCell>
                    <TableCell sx={tableHeaderCellSx} width={90} align="center">
                      Frequency
                    </TableCell>
                    <TableCell
                      sx={tableHeaderCellSx}
                      width={135}
                      align="center"
                    >
                      Sensitivity
                    </TableCell>
                    <TableCell sx={tableHeaderCellSx} width={135} align="left">
                      Freshness
                    </TableCell>
                    <TableCell sx={tableHeaderCellSx} width={135} align="left">
                      Cardinality
                    </TableCell>
                    <TableCell sx={tableHeaderCellSx} width={135} align="left">
                      Nullness
                    </TableCell>
                    <TableCell sx={tableHeaderCellSx} width={135} align="left">
                      Uniqueness
                    </TableCell>
                    <TableCell sx={tableHeaderCellSx} width={135} align="left">
                      Distribution
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
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={Object.keys(searchedTestSelection).length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {'We took your feedback into account :)'}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};
