import { Dialog, Switch, Transition } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import {
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  DEFAULT_FREQUENCY,
  headingsOnlyForTables,
  Level,
  testsOnlyForTables,
  TEST_TYPES,
  HARDCODED_THRESHOLD_MODE,
  HARDCODED_LOWER_THRESHOLD,
  HARDCODED_UPPER_THRESHOLD,
} from '../config';
import {
  Table,
  TableData,
  Test,
  TestType,
} from '../dataComponents/buildTableData';
import { TableContext } from '../test';
import { getFrequency } from '../utils/cron';
import { classNames } from '../utils/tailwind';
import { BulkFrequencyDropdown } from './frequencyDropdown';
import { OptionMenu } from './optionMenu';
import { TestTypeFrequencyDropdown } from './testTypeDropdown';
import {
  BulkToggle,
  buttonColorOff,
  buttonColorOffFrequencyRange,
  buttonColorOffNoFrequencyRange,
  buttonColorOn,
  buttonColorOnFrequencyRange,
} from './toggle';
import { ColumnComponent } from './columnComponent';

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

export const testTypes: { [name: string]: TestType } = {
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
  const [isOpen, setIsOpen] = useState(false);

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

export interface BulkNewTestState extends NewTestState {
  forTestTypes: TestType[];
}

function TestMenu({
  test,
  parentElementId,
  level,
  index,
  selected,
}: {
  test: Test;
  parentElementId: string;
  level: Level;
  index: number;
  selected: boolean;
}) {
  const tableContext = useContext(TableContext);
  const currentTheme = tableContext.theme.currentTheme;
  const tableColorConfig =
    tableContext.theme.colorConfig[currentTheme].table[level];

  // render option Menu with 0 opacity to keep alignment
  // also easier for future design changes
  const hidden: boolean =
    level === 'column' && testsOnlyForTables.includes(test.type);

  return (
    <>
      <td className={classNames('w-96 whitespace-nowrap px-3 text-sm')}>
        <div className={hidden ? 'relative opacity-50' : ''}>
          {/** Overlay hidden option menu to hide mouse hover **/}
          {hidden && (
            <div
              className={classNames(
                'absolute inset-0 z-50',
                selected
                  ? tableColorConfig.selectionBgColor
                  : tableColorConfig.bgColor
              )}
            ></div>
          )}
          <OptionMenu
            test={test}
            parentElementId={parentElementId}
            level={level}
            index={index}
          />
        </div>
      </td>
    </>
  );
}

export function TestMenus({
  testData,
  level,
  parentElementId,
  totalChildren,
  selected,
}: {
  testData: Test[];
  level: Level;
  parentElementId: string;
  totalChildren?: number;
  selected: boolean;
}) {
  return (
    <>
      {tableHeadings.map((heading: string, index) => {
        // use tableHeadings so that order is persistent for changes
        const testType = testTypes[heading] as TestType;

        if (!testType) return;

        let test: Test | undefined = testData.find(
          (t: Test) => t.type === testType
        );

        // create empty tests for correct display
        if (!test) {
          if (level === 'table') {
            totalChildren = totalChildren as number;
            let hasSummary: boolean;

            if (testsOnlyForTables.includes(testType)) {
              hasSummary = false;
            } else {
              hasSummary = true;
            }

            test = {
              id: 'newTest',
              type: testType,
              active: false,
              cron: DEFAULT_FREQUENCY,
              targetResourceId: '',
              customLowerThresholdMode: HARDCODED_THRESHOLD_MODE,
              customUpperThresholdMode: HARDCODED_THRESHOLD_MODE,
              customLowerThreshold: HARDCODED_LOWER_THRESHOLD,
              customUpperThreshold: HARDCODED_UPPER_THRESHOLD,
              feedbackLowerThreshold: HARDCODED_LOWER_THRESHOLD,
              feedbackUpperThreshold: HARDCODED_UPPER_THRESHOLD,
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
              targetResourceId: '',
              customLowerThresholdMode: HARDCODED_THRESHOLD_MODE,
              customUpperThresholdMode: HARDCODED_THRESHOLD_MODE,
              customLowerThreshold: HARDCODED_LOWER_THRESHOLD,
              customUpperThreshold: HARDCODED_UPPER_THRESHOLD,
              feedbackLowerThreshold: HARDCODED_LOWER_THRESHOLD,
              feedbackUpperThreshold: HARDCODED_UPPER_THRESHOLD,
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
                index={index}
                selected={selected}
              />
            </Fragment>
          );
        return new Error('No test found or created');
      })}
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
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  // for bulk changes
  const [newBulkTestState, setNewBulkTestState] = useState<BulkNewTestState>({
    newActivatedState: false,
    newFrequency: DEFAULT_FREQUENCY,
    forTestTypes: [...TEST_TYPES],
  });
  const [sendState, setSendState] = useState(false);
  const [sendFrequency, setSendFrequency] = useState(false);

  useLayoutEffect(() => {
    const isIndeterminate =
      ids.length > 0 && ids.length < allIdsToSelect.length;
    setChecked(ids.length === allIdsToSelect.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current !== null)
      checkbox.current.indeterminate = isIndeterminate;
  }, [ids]);

  function toggleAll() {
    setIds(checked || indeterminate ? [] : allIdsToSelect);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const currentTheme = tableContext.theme.currentTheme;
  const themeColorConfig =
    tableContext.theme.colorConfig[currentTheme].table[level];

  return (
    <div
      className={classNames(
        'flow-root',
        themeColorConfig.bgColor,
        level === 'table' ? 'overflow-x-hidden' : ''
      )}
    >
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {ids.length > 0 && (
              <div
                className={classNames(
                  'absolute left-20 z-50 flex items-center rounded-xl bg-gray-100 p-2 shadow-2xl'
                )}
              >
                <div className="mr-4 flex items-center justify-center space-x-2">
                  <input
                    type="checkbox"
                    className="row-span-1 h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito"
                    onChange={(e) => setSendState(e.target.checked)}
                  />

                  <BulkToggle
                    newTestState={newBulkTestState}
                    setNewTestState={setNewBulkTestState}
                    sendState={sendState}
                  />
                </div>
                <div className="mr-4 flex items-center justify-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito"
                    onChange={(e) => setSendFrequency(e.target.checked)}
                  />
                  <BulkFrequencyDropdown
                    newTestState={newBulkTestState}
                    setNewTestState={setNewBulkTestState}
                    sendFrequency={sendFrequency}
                  />
                </div>
                <div className="mr-6">
                  <TestTypeFrequencyDropdown
                    newTestState={newBulkTestState}
                    setNewTestState={setNewBulkTestState}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    tableContext.handleTestChange(
                      ids,
                      newBulkTestState.forTestTypes,
                      {
                        newActivatedState: sendState
                          ? newBulkTestState.newActivatedState
                          : undefined,
                        newFrequency: sendFrequency
                          ? newBulkTestState.newFrequency
                          : undefined,
                      },
                      level
                    )
                  }
                  className={classNames(
                    'rounded border border-gray-300 bg-cito px-5 py-2.5 text-xs font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30'
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
                        headingsOnlyForTables.includes(heading) &&
                          level === 'column'
                          ? 'opacity-0'
                          : 'opacity-100',

                        'px-3 py-3.5 text-left text-sm font-semibold',
                        themeColorConfig.textColor,
                        index === 0 ? 'pl-6' : 'relative left-6'
                      )}
                    >
                      {index === 0
                        ? level.charAt(0).toUpperCase() +
                          level.slice(1) +
                          ' ' +
                          heading
                        : heading}
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

export type DataTableProps = {
  tableData: TableData | Table;
  buttonText: string;
  tableTitle?: string;
  tableDescription?: string;
  level: 'database' | 'schema' | 'table' | 'column';
  page?: number;
};

export function DataTable({
  tableData,
  buttonText,
  tableTitle,
  tableDescription,
  level,
  page,
}: DataTableProps) {
  // columns are the ui columns, not the Snowflake columns
  // table is the ui table, not the Snowflake table/mat

  const [ids, setIds] = useState<string[]>([]);
  const allIdsToSelect: string[] = [];
  let columnComponent = <></>;

  useEffect(() => {
    setIds([]);
  }, [page]);

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
                <h1 className="absolute left-4 w-64">
                  Database: {databaseName}
                </h1>
              </div>
              <>
                {Array.from(database.schemas).map(
                  ([schemaName, schema], ind) => {
                    return (
                      <Fragment key={schemaName + ind}>
                        <div className="relative left-4 top-px ml-1">
                          <div className="absolute h-3 w-px bg-gray-800"></div>
                          <div className="absolute mt-3 h-px w-4 bg-gray-800"></div>
                        </div>
                        <div className="relative left-4 h-6 w-full">
                          <h1 className="absolute left-6 w-64">
                            Schema: {schemaName}
                          </h1>
                        </div>
                        <ColumnComponent
                          columns={schema.tables}
                          ids={ids}
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