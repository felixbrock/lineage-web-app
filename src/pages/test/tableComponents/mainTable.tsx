import { Disclosure } from '@headlessui/react';

import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Schema, TableData } from '../dataComponents/buildTableData';
import { OptionMenu } from './optionMenu';

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type SchemaComponent = {
  schemaData: Schema;
  textColor: string;
  bgColor: string;
  darkMode: boolean;
  buttonOnClick: () => void;
  buttonText: string;
  buttonIsDisclosure: boolean;
  buttonDisclosureContent?: JSX.Element;
  ids: any;
  setIds: any;
};

export function SchemaComponent({
  schemaData,
  textColor,
  bgColor,
  darkMode,
  buttonOnClick,
  buttonText,
  buttonIsDisclosure,
  buttonDisclosureContent,
  ids,
  setIds,
}: SchemaComponent) {
  let selectionBgColor = 'bg-gray-50';
  let selectionTextColor = 'text-cito';
  let buttonTextColor = 'text-cito';

  if (darkMode) selectionBgColor = 'bg-gray-700';
  if (darkMode) selectionTextColor = 'text-white';
  if (darkMode) buttonTextColor = 'text-white';


  let columns: any;
  if (schemaData.tables) {
      columns = Array.from(schemaData.tables)
  } else {
      columns = Array.from(schemaData.columns)
  }


  return (
    <>
      {columns.map(([tableId, tableData]) => (
        <Disclosure>
          {({ open }) => (
            <>
              <tr
                key={tableId}
                className={
                  ids.includes(tableId) ? selectionBgColor : undefined
                }
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
                    'max-w-[12rem] truncate py-4 pr-3 text-sm font-medium hover:absolute hover:z-10 hover:mt-4 hover:-ml-1.5 hover:max-w-[50rem] hover:p-2 hover:drop-shadow-xl',
                    ids.includes(tableId)
                      ? selectionTextColor
                      : textColor
                  )}
                >
                  {tableData.name}
                </td>
                {Array(8 + 1).fill(
                  <td
                    className={classNames(
                      'w-96 whitespace-nowrap px-3 text-sm',
                      textColor
                    )}
                  >
                    {<OptionMenu />}
                  </td>
                )}
                <td className="min-w-[6rem] whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-3">
                  {buttonIsDisclosure ? (
                    <Disclosure.Button className={buttonTextColor}>
                      {buttonText}
                    </Disclosure.Button>
                  ) : (
                    <button onClick={buttonOnClick} className={buttonTextColor}>
                      {buttonText}
                    </button>
                  )}
                </td>
              </tr>
              <Disclosure.Panel as="tr">
                <td colSpan={12}>
                {buttonIsDisclosure && (
            <MainTable
              tableData={{loading: false, tableData: tableData}}
              buttonOnClick={() => {}}
              buttonText={'Edit'}
              buttonIsDisclosure={false}
              darkMode={true}
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
  tableData: { loading: boolean; tableData: TableData };
  buttonOnClick: () => void;
  buttonText: string;
  buttonIsDisclosure: boolean;
  buttonDisclosureContent?: JSX.Element;
  tableTitle?: string;
  tableDescription?: string;
  darkMode: boolean;
};

export default function MainTable({
  tableData,
  buttonOnClick,
  buttonText,
  buttonIsDisclosure,
  buttonDisclosureContent,
  tableTitle,
  tableDescription,
  darkMode,
}: MainTableProps) {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [ids, setIds] = useState([]);

  function calculateMaxSelected(tableData: TableData) {
      // implement
      if (tableData.columns) return Array.from(tableData.columns.keys())

    let tableIds: string[] = [];


    tableData.forEach((database) => {
        database.schemas.forEach((schema) => {
            tableIds = [...tableIds, ...Array.from(schema.tables.keys())]
        })
    })
    return tableIds

  }

  const elementIds = useMemo(() => calculateMaxSelected(tableData.tableData), [tableData])
  const maxSelected = elementIds.length

  useLayoutEffect(() => {
    const isIndeterminate =
      ids.length > 0 && ids.length < maxSelected;
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
        <div className="pl-4 sm:flex sm:items-center">
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
                    <th
                      scope="col"
                      className="relative w-16 px-8 sm:w-12 sm:px-6"
                    >
                      <input
                        type="checkbox"
                        className="absolute left-6 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito sm:left-4"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    {tableHeadings.map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className={classNames(
                          'px-3 py-3.5 text-left text-sm font-semibold',
                          textColor
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
                <tbody className={classNames('divide-y divide-gray-200')}>
                {console.log(tableData.tableData.columns)}
                {tableData.tableData.columns ? (
                                        <SchemaComponent
                                          schemaData={tableData.tableData}
                                          textColor={textColor}
                                          bgColor={bgColor}
                                          darkMode={darkMode}
                                          ids={ids}
                                          setIds={setIds}
                                          buttonText={buttonText}
                                          buttonOnClick={buttonOnClick}
                                          buttonIsDisclosure={
                                            buttonIsDisclosure
                                          }
                                          buttonDisclosureContent={
                                            buttonDisclosureContent
                                          }
                                        />
                ) : (
                    <>
                      {Array.from(tableData.tableData).map(
                        ([databaseName, database]) => {
                          return (
                            <>
                              <h1>{databaseName}</h1>
                              <Fragment key={databaseName}>
                                {Array.from(database.schemas).map(
                                  ([schemaName, schema]) => {
                                    return (
                                      <>
                                        <div key={schemaName}>{schemaName}</div>
                                        <SchemaComponent
                                          schemaData={schema}
                                          textColor={textColor}
                                          bgColor={bgColor}
                                          darkMode={darkMode}
                                          ids={ids}
                                          setIds={setIds}
                                          buttonText={buttonText}
                                          buttonOnClick={buttonOnClick}
                                          buttonIsDisclosure={
                                            buttonIsDisclosure
                                          }
                                          buttonDisclosureContent={
                                            buttonDisclosureContent
                                          }
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
