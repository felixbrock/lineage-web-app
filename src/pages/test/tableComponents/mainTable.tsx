import { Dialog, Disclosure, Switch, Transition } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

import { Fragment, useContext, useLayoutEffect, useRef, useState } from 'react';
import {
  DEFAULT_FREQUENCY,
  HARDCODED_THRESHOLD,
  headingsOnlyForTables,
  Level,
  testsOnlyForTables,
  TEST_TYPES,
} from '../config';
import {
  Column,
  Columns,
  Table,
  TableData,
  Tables,
  Test,
  TestType,
} from '../dataComponents/buildTableData';
import { TableContext } from '../newtest';
import { getFrequency } from '../utils/cron';
import { classNames } from '../utils/tailwind';
import { BulkFrequencyDropdown } from './frequencyDropdown';
import { OptionMenu } from './optionMenu';
import {
  BulkToggle,
  buttonColorOff,
  buttonColorOffFrequencyRange,
  buttonColorOffNoFrequencyRange,
  buttonColorOn,
  buttonColorOnFrequencyRange,
} from './toggle';

// this object controls the order of table columns
// changes are respected by the test columns
const tableHeadings = [
  'Name',
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

function ButtonLegend() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function Button({ active, color }: { active: boolean; color: string }) {
    return (
      <Switch.Group as="div" className="flex items-center">
        <Switch
          checked={active}
          disabled={true}
          className={classNames(
            color,
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2'
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              active ? 'translate-x-5' : 'translate-x-0',
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
            )}
          />
        </Switch>
      </Switch.Group>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="relative inline-flex items-center rounded-xl bg-white px-2 py-2 text-cito ring-1 ring-inset ring-cito hover:bg-gray-50 focus:z-10"
      >
        <span className="sr-only">Open Info</span>
        <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <table className="border-separate border-spacing-2">
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
                          <Button color={buttonColorOn} active={true} />
                        </td>
                        <td>
                          <Button
                            color={buttonColorOffNoFrequencyRange}
                            active={false}
                          />
                        </td>
                        <td>
                          <Button color={buttonColorOff} active={false} />
                        </td>
                      </tr>
                      <tr>
                        <td>Frequency Different</td>
                        <td>
                          <Button
                            color={buttonColorOnFrequencyRange}
                            active={true}
                          />
                        </td>
                        <td>
                          <Button
                            color={buttonColorOffFrequencyRange}
                            active={false}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export interface NewTestState {
  newActivatedState: boolean | undefined;
  newFrequency: string | undefined;
}

function TestMenu({
  test,
  parentElementId,
  level,
}: {
  test: Test;
  parentElementId: string;
  level: Level;
}) {
  // render option Menu with 0 opacity to keep alignment
  // also easier for future design changes
  const hidden: boolean =
    level === 'column' && testsOnlyForTables.includes(test.type);

  return (
    <>
      <td className={classNames('w-96 whitespace-nowrap px-3 text-sm')}>
        <div className={hidden ? 'opacity-0' : ''}>
          <OptionMenu
            test={test}
            parentElementId={parentElementId}
            level={level}
          />
        </div>
      </td>
    </>
  );
}

function TestMenus({
  testData,
  level,
  parentElementId,
  totalChildren,
}: {
  testData: Test[];
  level: Level;
  parentElementId: string;
  totalChildren?: number;
}) {
  return (
    <>
      {tableHeadings.map((heading: string, index) => {
        // use tableHeadings so that order is persistent for changes
        const testType = testTypes[heading] as TestType;

        if (!testType) return;

        let test: Test | undefined = testData.find(
          (test) => test.type === testType
        );

        // create empty tests for correct display
        if (!test) {
          if (level === 'table') {
            totalChildren = totalChildren as number;
            let cron: string;
            let hasSummary: boolean;

            if (testsOnlyForTables.includes(testType)) {
              cron = DEFAULT_FREQUENCY;
              hasSummary = false;
            } else {
              cron = '';
              hasSummary = true;
            }

            test = {
              id: 'newTest',
              type: testType,
              active: false,
              cron: DEFAULT_FREQUENCY,
              threshold: HARDCODED_THRESHOLD,
              ...(hasSummary && {
                summary: {
                  activeChildren: 0,
                  totalChildren: totalChildren,
                  frequencyRange: [
                    getFrequency(DEFAULT_FREQUENCY),
                    getFrequency(DEFAULT_FREQUENCY),
                  ],
                },
              }),
            };
          }

          if (level === 'column') {
            test = {
              id: 'newTest',
              type: testType,
              active: false,
              cron: DEFAULT_FREQUENCY,
              threshold: HARDCODED_THRESHOLD,
            };
          }
        }

        if (test)
          return (
            <Fragment key={parentElementId + index}>
              <TestMenu
                level={level}
                test={test}
                parentElementId={parentElementId}
              />
            </Fragment>
          );
        return new Error('No test found or created');
      })}
    </>
  );
}

type ColumnComponent = {
  columns: Tables | Columns;
  ids: string[];
  setIds: React.Dispatch<React.SetStateAction<string[]>>;
  buttonText: string;
  level: Level;
};

export function ColumnComponent({
  columns,
  ids,
  setIds,
  buttonText,
  level,
}: ColumnComponent) {
  const tableContext = useContext(TableContext);
  const currentTheme = tableContext.theme.currentTheme;
  const tableColorConfig =
    tableContext.theme.colorConfig[currentTheme].table[level];
  const {
    textColor,
    buttonTextColor,
    selectionBgColor,
    selectionTextColor,
    bgColor,
  } = tableColorConfig;

  return (
    <>
      {Array.from(columns).map(
        ([columnId, columnData]: [string, Table | Column]) => {
          let totalChildren: number | undefined = undefined;
          if (level === 'table') {
            const cData = columnData as Table;
            totalChildren = cData.columns.size;
          }

          return (
            <Disclosure key={columnId}>
              {({ open }) => (
                <>
                  <tr
                    key={columnId}
                    className={classNames(
                      ids.includes(columnId) ? selectionBgColor : '',
                      'relative left-6 h-14 border border-gray-100'
                    )}
                  >
                    <td className="relative w-16 px-8 sm:w-12 sm:px-6">
                      {ids.includes(columnId) && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-cito" />
                      )}
                      <input
                        type="checkbox"
                        className="absolute left-6 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito sm:left-4"
                        value={columnData.name}
                        checked={ids.includes(columnId)}
                        onChange={(e) =>
                          setIds(
                            e.target.checked
                              ? [...ids, columnId]
                              : ids.filter((id: string) => id !== columnId)
                          )
                        }
                      />
                    </td>
                    <td
                      className={classNames(
                        'hover:' + bgColor,
                        'relative min-w-[8rem] max-w-[8rem] py-4 pr-3',
                        ids.includes(columnId) ? selectionTextColor : textColor
                      )}
                    >
                      <div
                        className={classNames(
                          'flex items-center justify-start hover:absolute hover:inset-y-0 hover:z-50',
                          'hover:' + bgColor
                        )}
                      >
                        <h1 className="truncate text-sm font-medium">
                          {columnData.name}
                        </h1>
                      </div>
                    </td>
                    <TestMenus
                      testData={columnData.tests}
                      parentElementId={columnId}
                      level={level}
                      totalChildren={totalChildren}
                    />
                    <td className="relative right-6 min-w-[6rem] whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-3">
                      {buttonText && (
                        <Disclosure.Button className={buttonTextColor}>
                          {buttonText}
                        </Disclosure.Button>
                      )}
                    </td>
                  </tr>
                  <Disclosure.Panel as="tr">
                    <td colSpan={12}>
                      {level === 'table' && (
                        <DataTable
                          tableData={columnData as Table}
                          buttonText={''}
                          level={'column'}
                        />
                      )}
                    </td>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        }
      )}
    </>
  );
}

type DataTableProps = {
  tableData: TableData | Table;
  buttonText: string;
  tableTitle?: string;
  tableDescription?: string;
  level: 'database' | 'schema' | 'table' | 'column';
};

export function DataTable({
  tableData,
  buttonText,
  tableTitle,
  tableDescription,
  level,
}: DataTableProps) {
  // columns are the ui columns, not the Snowflake columns
  // table is the ui table, not the Snowflake table/mat

  const [ids, setIds] = useState([]);
  const allIdsToSelect: string[] = [];
  let columnComponent = <></>;

  if (level === 'table') {
    tableData = tableData as TableData;

    tableData.forEach((database) => {
      database.schemas.forEach((schema) => {
        allIdsToSelect.push(...Array.from(schema.tables.keys()));
      });
    });

    columnComponent = (
      <>
        {Array.from(tableData).map(([databaseName, database], index) => {
          return (
            <Fragment key={databaseName + index}>
              <div className="relative h-6 w-full">
                <h1 className="absolute w-64">Database: {databaseName}</h1>
              </div>
              <>
                {Array.from(database.schemas).map(
                  ([schemaName, schema], index) => {
                    return (
                      <Fragment key={schemaName + index}>
                        <div className="relative ml-1">
                          <div className="absolute h-3 w-px bg-gray-800"></div>
                          <div className="absolute mt-3 h-px w-4 bg-gray-800"></div>
                        </div>
                        <div className="relative h-6 w-full">
                          <h1 className="absolute left-6 w-64">
                            Schema: {schemaName}
                          </h1>
                        </div>
                        <ColumnComponent
                          columns={schema.tables}
                          ids={ids}
                          // @ts-ignore tailwind
                          setIds={setIds}
                          buttonText={buttonText}
                          level={level}
                        />
                      </Fragment>
                    );
                  }
                )}
              </>
            </Fragment>
          );
        })}
      </>
    );
  }

  if (level === 'column') {
    tableData = tableData as Table;
    allIdsToSelect.push(...Array.from(tableData.columns.keys()));
    columnComponent = (
      <ColumnComponent
        columns={tableData.columns}
        ids={ids}
        // @ts-ignore tailwind
        setIds={setIds}
        buttonText={buttonText}
        level={level}
      />
    );
  }

  return (
    <>
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
        <TableComponent
          ids={ids}
          // @ts-ignore tailwind
          setIds={setIds}
          allIdsToSelect={allIdsToSelect}
          level={level}
        >
          {columnComponent}
        </TableComponent>
      </div>
    </>
  );
}

interface TableComponentProps {
  ids: string[];
  setIds: React.Dispatch<React.SetStateAction<string[]>>;
  allIdsToSelect: string[];
  level: Level;
  children: JSX.Element;
}

function TableComponent({
  ids,
  setIds,
  allIdsToSelect,
  level,
  children,
}: TableComponentProps) {
  const tableContext = useContext(TableContext);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  // for bulk changes
  const [newTestState, setNewTestState] = useState<NewTestState>({
    newActivatedState: false,
    newFrequency: DEFAULT_FREQUENCY,
  });

  useLayoutEffect(() => {
    const isIndeterminate =
      ids.length > 0 && ids.length < allIdsToSelect.length;
    setChecked(ids.length === allIdsToSelect.length);
    setIndeterminate(isIndeterminate);
    //@ts-ignore // from tailwind
    checkbox.current.indeterminate = isIndeterminate;
  }, [ids]);

  function toggleAll() {
    //@ts-ignore // from tailwind
    setIds(checked || indeterminate ? [] : allIdsToSelect);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const currentTheme = tableContext.theme.currentTheme;
  const themeColorConfig =
    tableContext.theme.colorConfig[currentTheme].table[level];

  return (
    <div className={classNames('flow-root', themeColorConfig.bgColor)}>
      <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {ids.length > 0 && (
              <div
                className={classNames(
                  'fixed top-20 left-4 z-50 flex items-center space-x-3 rounded-xl bg-gray-100 p-2'
                )}
              >
                <BulkToggle
                  newTestState={newTestState}
                  setNewTestState={setNewTestState}
                />
                <BulkFrequencyDropdown
                  newTestState={newTestState}
                  setNewTestState={setNewTestState}
                />
                <button
                  type="button"
                  onClick={() =>
                    tableContext.handleTestChange(
                      ids,
                      [...TEST_TYPES],
                      newTestState,
                      level
                    )
                  }
                  className={classNames(
                    'inline-flex items-center rounded border border-gray-300 bg-cito px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30'
                  )}
                >
                  Apply
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
                        level === 'column' ? 'left-10' : 'left-6'
                      )}
                      //@ts-ignore tailwind
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
                        themeColorConfig.textColor,
                        index === 0 ? 'pl-6' : 'relative left-6'
                      )}
                    >
                      {index === 0 ? (level.charAt(0).toUpperCase() + level.slice(1) + ' ' + heading) : (!headingsOnlyForTables.includes(heading) && heading)}
                      {headingsOnlyForTables.includes(heading) && level === 'table' && heading}
                    </th>
                  ))}
                  <th scope="col" className="relative py-3.5 pl-3 pr-6 sm:pr-3">
                    {level === 'table' && <ButtonLegend />}
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className={classNames('')}>{children}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
