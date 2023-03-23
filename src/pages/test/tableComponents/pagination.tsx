import { useEffect, useState } from 'react';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';
import { Database, Schema, TableData } from '../dataComponents/buildTableData';
import { DataTable, DataTableProps } from './mainTable';
import { classNames } from '../utils/tailwind';

export function paginateTableData(tableData: TableData) {
  const tableDataArray: TableData[] = [];
  let currentTableData: TableData = new Map();
  let tableCount = 0;
  let tablesPerPage = 25;

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
  const paginatedData = paginateTableData(tableData as TableData);

  // set an available page, otherwise the search crashes if a page is selected that is not available
  function findAvailablePage(paginatedData: TableData[], page: number): TableData {
      let pageTableData = paginatedData[page]
      if (pageTableData) return pageTableData

      while (!pageTableData) {
          page--;
          pageTableData = paginatedData[page]
      }
      setPage(page)
      return pageTableData
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

      <nav className="mb-12 flex items-center justify-between border-t border-gray-200 px-4">
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
        <div className="-mt-px flex">
          {Array.from(Array(paginatedData.length + 1).keys()).map((number) => {
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
          })}
        </div>
        <div
          className={classNames(
            page === paginatedData.length - 1? 'opacity-0' : '',
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
