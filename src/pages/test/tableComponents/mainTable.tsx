import { Disclosure } from '@headlessui/react';

import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Schema,
  Table,
  TableData,
  Test,
} from '../dataComponents/buildTableData';
import { OptionMenu } from './optionMenu';
import Toggle from './toggle';

const tableHeadings = [
  'Table Name',
  'Column Freshness',
  'Cardinality',
  'Nullness',
  'Uniqueness',
  'Distribution',
  'Row Count',
  'Column Count',
  'Table Freshness',
  'Schema Change',
];

function ButtonLegend() {
  return (
    <div className="absolute -top-8 right-12 flex items-center justify-center">
      <table className="border-separate border-spacing-2 border border-slate-500">
        <thead>
          <tr>
            <th></th>
            <th>On</th>
            <th>Some On</th>
            <th>Off</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frequency Same</td>
            <td>
              <Toggle
                active={true}
                hasOnChildren={false}
                frequencyRange={[1, 1]}
              />
            </td>
            <td>
              <Toggle
                active={false}
                hasOnChildren={true}
                frequencyRange={[24, 24]}
              />
            </td>
            <td>
              <Toggle
                active={false}
                hasOnChildren={false}
                frequencyRange={[1, 24]}
              />
            </td>
          </tr>
          <tr>
            <td>Frequency Different</td>
            <td>
              <Toggle
                active={true}
                hasOnChildren={false}
                frequencyRange={[1, 12]}
              />
            </td>
            <td>
              <Toggle
                active={false}
                hasOnChildren={true}
                frequencyRange={[3, 6]}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export const testTypes: { [name: string]: string } = {
  'Column Freshness': 'ColumnFreshness',
  Cardinality: 'ColumnCardinality',
  Nullness: 'ColumnNullness',
  Uniqueness: 'ColumnUniqueness',
  Distribution: 'ColumnDistribution',
  'Row Count': 'MaterializationRowCount',
  'Column Count': 'MaterializationColumnCount',
  'Table Freshness': 'MaterializationFreshness',
  'Schema Change': 'MaterializationSchemaChange',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function TestMenu({
  testData,
  textColor,
  columnChildren,
  columnLevel,
  parentElementId,
  heading,
}: any) {
  const testsOnlyForTables = [
    'MaterializationRowCount',
    'MaterializationColumnCount',
    'MaterializationFreshness',
    'MaterializationSchemaChange',
  ];

  let test: Test = testData.find(
    (test: any) => test.name === testTypes[heading]
  );

  if (test && test?.active === false) {
    test.active = test?.activeChildren === columnChildren ? true : false;
  }

  const activeChildren = test?.active
    ? columnChildren
    : test?.activeChildren ?? 0;

  if (!test) {
    test = {
      id: 'newtest',
      name: testTypes[heading],
      active: false,
      threshold: '',
      cron: '',
      activeChildren: undefined,
    };
  }

  const [testState, setTestState] = useState(test)

  let newFrequency;
  if(!test.frequencyRange) {
      // default Frequency
      newFrequency = test.cron || '25 * * * ? *';

  }
  const [newTestState, setNewTestState] = useState({newActivatedState: test.active, newFrequency: newFrequency})

  const optionMenu = (
    <OptionMenu
      testState={testState}
      setTestState={setTestState}
      activeChildren={`${activeChildren}/${columnChildren}`}
      hasOnChildren={test?.activeChildren > 0 && !test?.active}
      optionsMenuColor={textColor}
      columnLevel={columnLevel}
      elementId={parentElementId}
      newTestState={newTestState}
      setNewTestState={setNewTestState}
    />
  );
  return (
    <>
      <td className={classNames('w-96 whitespace-nowrap px-3 text-sm')}>
        {columnLevel && testsOnlyForTables.includes(testTypes[heading]) ? (
          // render option Menu with 0 opacity to keey alignment
          // also easier for future design changes
          <div className="opacity-0">{optionMenu}</div>
        ) : (
          <>{optionMenu}</>
        )}
      </td>
    </>
  );
}

function TestMenus({
  testData,
  textColor,
  columnChildren,
  columnLevel,
  parentElementId,
}: any) {
  // use tableHeadings so that order is persistent for changes (one source of truth)

  return (
    <>
      {tableHeadings.map((heading: string) => {
        if (!testTypes[heading]) return;
        return (
          <TestMenu
            testData={testData}
            heading={heading}
            columnLevel={columnLevel}
            textColor={textColor}
            columnChildren={columnChildren}
            parentElementId={parentElementId}
          />
        );
      })}
    </>
  );
}

type SchemaComponent = {
  schemaData: Schema;
  textColor: string;
  bgColor: string;
  darkMode: boolean;
  buttonText: string;
  ids: any;
  setIds: any;
  columnLevel: boolean;
};

export function SchemaComponent({
  schemaData,
  textColor,
  bgColor,
  darkMode,
  buttonText,
  ids,
  setIds,
  columnLevel,
}: SchemaComponent) {
  let selectionBgColor = 'bg-gray-50';
  let selectionTextColor = 'text-cito';
  let buttonTextColor = 'text-cito';

  if (darkMode) selectionBgColor = 'bg-gray-700';
  if (darkMode) selectionTextColor = 'text-white';
  if (darkMode) buttonTextColor = 'text-white';

  let columns: any;
  if (schemaData.tables) {
    columns = Array.from(schemaData.tables);
  } else {
    columns = Array.from(schemaData.columns);
  }

  return (
    <>
      {columns.map(([tableId, tableData]: [string, any]) => (
        <Disclosure>
          {({ open }) => (
            <>
              <tr
                key={tableId}
                className={classNames(
                  ids.includes(tableId) ? selectionBgColor : '',
                  'relative left-6 h-14 border border-gray-100'
                )}
              >
                <td className="relative w-16 px-8 sm:w-12 sm:px-6">
                  {ids.includes(tableId) && (
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-cito" />
                  )}
                  <input
                    type="checkbox"
                    className="absolute left-6 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito sm:left-4"
                    value={tableData.name}
                    checked={ids.includes(tableId)}
                    onChange={(e) =>
                      setIds(
                        e.target.checked
                          ? [...ids, tableId]
                          : ids.filter((id: string) => id !== tableId)
                      )
                    }
                  />
                </td>
                <td
                  className={classNames(
                    'hover:' + bgColor,
                    'relative min-w-[8rem] max-w-[8rem] py-4 pr-3',
                    ids.includes(tableId) ? selectionTextColor : textColor
                  )}
                >
                  <div
                    className={classNames(
                      'flex items-center justify-start hover:absolute hover:inset-y-0 hover:z-50',
                      'hover:' + bgColor
                    )}
                  >
                    <h1 className="truncate text-sm font-medium">
                      {tableData.name}
                    </h1>
                  </div>
                </td>
                <TestMenus
                  testData={tableData.tests}
                  textColor={textColor}
                  columnChildren={tableData.columns?.size}
                  columnLevel={columnLevel}
                  parentElementId={tableId}
                />
                <td className="relative right-6 min-w-[6rem] whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-3">
                  {!columnLevel && (
                    <Disclosure.Button className={buttonTextColor}>
                      {buttonText}
                    </Disclosure.Button>
                  )}
                </td>
              </tr>
              <Disclosure.Panel as="tr">
                <td colSpan={12}>
                  {!columnLevel && (
                    <MainTable
                      tableData={{ loading: false, tableData: tableData }}
                      buttonText={'Edit'}
                      darkMode={true}
                      columnLevel={true}
                    />
                  )}
                </td>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </>
  );
}

type MainTableProps = {
  tableData: { loading: boolean; tableData: TableData | Table };
  buttonText: string;
  tableTitle?: string;
  tableDescription?: string;
  darkMode: boolean;
  columnLevel: boolean;
};

export default function MainTable({
  tableData,
  buttonText,
  tableTitle,
  tableDescription,
  darkMode,
  columnLevel,
}: MainTableProps) {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [ids, setIds] = useState([]);

  function calculateMaxSelected(tableData: TableData) {
    // implement
    if (columnLevel) return Array.from(tableData.columns.keys());

    let tableIds: string[] = [];

    tableData.forEach((database) => {
      database.schemas.forEach((schema) => {
        tableIds = [...tableIds, ...Array.from(schema.tables.keys())];
      });
    });
    return tableIds;
  }

  const elementIds = useMemo(
    () => calculateMaxSelected(tableData.tableData),
    [tableData]
  );
  const maxSelected = elementIds.length;

  useLayoutEffect(() => {
    const isIndeterminate = ids.length > 0 && ids.length < maxSelected;
    setChecked(ids.length === maxSelected);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [ids]);

  function toggleAll() {
    setIds(checked || indeterminate ? [] : elementIds);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  let textColor = 'text-gray-900';
  let bgColor = 'bg-white';

  if (darkMode) {
    textColor = 'text-white';
    bgColor = 'bg-cito';
  }

  return (
    <div className="w-full">
      {(tableTitle || tableDescription) && (
        <div className="relative pl-4 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              {tableTitle}
            </h1>
            <p className="mt-2 text-sm text-gray-700">{tableDescription}</p>
          </div>
        </div>
      )}
      <div className={classNames('mt-8 flow-root', bgColor)}>
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {ids.length > 0 && (
                <div
                  className={classNames(
                    'absolute top-0 left-16 flex h-12 items-center space-x-3 sm:left-12'
                  )}
                >
                  <button
                    type="button"
                    className={classNames(
                      'inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30'
                    )}
                  >
                    Enable All Tests
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300 break-normal">
                <thead>
                  <tr>
                    <th scope="col" className="relative w-12 px-8">
                      <input
                        type="checkbox"
                        className={classNames(
                          'absolute top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito',
                          columnLevel ? 'left-10' : 'left-6'
                        )}
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    {tableHeadings.map((heading, index) => (
                      <th
                        key={heading}
                        scope="col"
                        className={classNames(
                          'px-3 py-3.5 text-left text-sm font-semibold',
                          textColor,
                          index == 0 ? 'pl-6' : 'relative left-6'
                        )}
                      >
                        {heading}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-6 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className={classNames('')}>
                  {columnLevel ? (
                    <SchemaComponent
                      schemaData={tableData.tableData}
                      textColor={textColor}
                      bgColor={bgColor}
                      darkMode={darkMode}
                      ids={ids}
                      setIds={setIds}
                      buttonText={buttonText}
                      columnLevel={columnLevel}
                    />
                  ) : (
                    <>
                      {Array.from(tableData.tableData).map(
                        ([databaseName, database]) => {
                          return (
                            <>
                              <div
                                key={databaseName}
                                className="relative h-6 w-full"
                              >
                                <h1 className="absolute w-64">
                                  Database: {databaseName}
                                </h1>
                              </div>
                              <Fragment key={databaseName}>
                                {Array.from(database.schemas).map(
                                  ([schemaName, schema]) => {
                                    return (
                                      <>
                                        <div className="relative ml-1">
                                          <div className="absolute h-3 w-px bg-gray-800"></div>
                                          <div className="absolute mt-3 h-px w-4 bg-gray-800"></div>
                                        </div>
                                        <div
                                          key={schemaName}
                                          className="relative h-6 w-full"
                                        >
                                          <h1 className="absolute left-6 w-64">
                                            Schema: {schemaName}
                                          </h1>
                                        </div>
                                        {/**<div className="absolute left-8 h-[6.6rem] w-px bg-black"></div>**/}
                                        <SchemaComponent
                                          schemaData={schema}
                                          textColor={textColor}
                                          bgColor={bgColor}
                                          darkMode={darkMode}
                                          ids={ids}
                                          setIds={setIds}
                                          buttonText={buttonText}
                                          columnLevel={columnLevel}
                                        />
                                      </>
                                    );
                                  }
                                )}
                              </Fragment>
                            </>
                          );
                        }
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
