import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';
import { Database, Schema, TableData } from '../dataComponents/buildTableData';
import { DataTable, DataTableProps } from './mainTable';
import { classNames } from '../utils/tailwind';
import { ENTRIES_PER_PAGE } from '../config';

export function paginateTableData(tableData: TableData, tablesPerPage: number) {
  const tableDataArray: TableData[] = [];
  let currentTableData: TableData = new Map();
  let tableCount = 0;

  tableData.forEach((database, databaseName) => {
    database.schemas.forEach((schema, schemaName) => {
      schema.tables.forEach((table, tableId) => {
        const currentDb = currentTableData.get(databaseName);
        if (currentDb) {
          const currentSchema = currentDb.schemas.get(schemaName);
          if (currentSchema) {
            currentSchema.tables.set(tableId, table);
          } else {
            const newSchema: Schema = { tables: new Map([[tableId, table]]) };
            currentDb.schemas.set(schemaName, newSchema);
          }
        } else {
          const newSchema: Schema = { tables: new Map([[tableId, table]]) };
          const newDatabase: Database = {
            schemas: new Map([[schemaName, newSchema]]),
          };
          currentTableData.set(databaseName, newDatabase);
        }

        tableCount++;
        if (tableCount === tablesPerPage) {
          tableDataArray.push(currentTableData);
          currentTableData = new Map();
          tableCount = 0;
        }
      });
    });
  });

  if (tableCount > 0) {
    tableDataArray.push(currentTableData);
  }

  return tableDataArray;
}

export function Paginator({
  tableData,
  buttonText,
  tableTitle,
  tableDescription,
  level,
}: DataTableProps) {
  const [page, setPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const paginatedData = paginateTableData(
    tableData as TableData,
    entriesPerPage
  );

  // set an available page, otherwise the search crashes if a page is selected that is not available
  function findAvailablePage(
    paginatedData: TableData[],
    page: number
  ): TableData {
    let pageTableData = paginatedData[page];
    if (pageTableData) return pageTableData;

    while (!pageTableData) {
      page--;
      pageTableData = paginatedData[page];
    }
    setPage(page);
    return pageTableData;
  }

  return (
    <>
      <DataTable
        tableData={findAvailablePage(paginatedData, page) as TableData}
        buttonText={buttonText}
        tableTitle={tableTitle}
        tableDescription={tableDescription}
        level={level}
        page={page}
      />

      <nav className="mb-12 flex items-start justify-between border-t border-gray-200 px-4">
        <div
          className={classNames(
            page === 0 ? 'opacity-0' : '',
            '-mt-px flex w-0 flex-1'
          )}
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex">
            {Array.from(Array(paginatedData.length + 1).keys()).map(
              (number) => {
                if (Math.abs(page - number) > 5) return;
                if (number === paginatedData.length) return;

                return (
                  <button
                    onClick={() => setPage(number)}
                    className={classNames(
                      page === number ? 'underline' : '',
                      'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    {number + 1}
                  </button>
                );
              }
            )}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <h1 className="mr-4 text-gray-500">Entries per page:</h1>
            <EntriesPerPageSelection
              entriesPerPage={entriesPerPage}
              setEntriesPerPage={setEntriesPerPage}
            />
          </div>
        </div>
        <div
          className={classNames(
            page === paginatedData.length - 1 ? 'opacity-0' : '',
            '-mt-px flex w-0 flex-1 justify-end'
          )}
        >
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === paginatedData.length - 1}
            className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>
    </>
  );
}

function EntriesPerPageSelection({
  entriesPerPage,
  setEntriesPerPage,
}: {
  entriesPerPage: number;
  setEntriesPerPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="w-20">
      <Listbox value={entriesPerPage} onChange={setEntriesPerPage}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{entriesPerPage}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {ENTRIES_PER_PAGE.map((number) => (
                <Listbox.Option
                  key={number}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-cito' : 'text-gray-500'
                    }`
                  }
                  value={number}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {number}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
