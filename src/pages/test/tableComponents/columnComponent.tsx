import { useContext, useState } from 'react';
import {
    StarIcon as StarIconSolid,
} from '@heroicons/react/20/solid';
import { StarIcon } from '@heroicons/react/24/outline';
import { Level } from '../config';
import {
    Column,
    Columns,
    Table,
    Tables,
  } from '../dataComponents/buildTableData';
import { TableContext } from '../test';
import { Disclosure } from '@headlessui/react';
import { DataTable, TestMenus } from './mainTable';
import { classNames } from '../utils/tailwind';

function Fav() {
    //////////////////////////////////////
    // only for demo
    const [fav, setFav] = useState(false);
    return (
      <div className="absolute inset-y-0 -left-4 flex items-center justify-center text-cito outline-cito">
        <button onClick={() => setFav(!fav)}>
          {fav ? (
            <StarIconSolid className="h-6 w-6" />
          ) : (
            <StarIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    );
  }

type ColumnComponentProps = {
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
}: ColumnComponentProps) {
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
              <>
                <tr
                  key={columnId}
                  className={classNames(
                    ids.includes(columnId) ? selectionBgColor : '',
                    'relative left-6 h-14 border border-gray-100'
                  )}
                >
                  <td className="relative w-16 px-8 sm:w-12 sm:px-6">
                    {ids.includes(columnId) ? (
                      <div className="absolute inset-y-0 left-0 w-0.5 bg-cito" />
                    ) : (
                      <Fav />
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
                    selected={ids.includes(columnId)}
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
            </Disclosure>
          );
        }
      )}
    </>
  );
}