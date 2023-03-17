import Navbar from '../../components/navbar';
import MainTable from './tableComponents/mainTable';
import SearchBox from '../lineage/components/search-box';
import { useAccount, useApiRepository } from './dataComponents/useData';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import ObservabilityApiRepo from '../../infrastructure/observability-api/observability-api-repo';
import { createContext, Fragment, useEffect, useState } from 'react';
import { buildTableData } from './dataComponents/buildTableData';
import { Dialog, Transition } from '@headlessui/react';

const tableContextData = {
  jwt: '',
  mats: [],
  setMats: () => {},
  cols: [],
  setCols: () => {},
  testSuite: [],
  setTestSuite: () => {},
  testQualSuite: [],
  setQualTestSuite: () => {},
};

export const TableContext = createContext(tableContextData);

export default function NewTest() {
  const [jwt, account] = useAccount();
  const [mats, setMats] = useApiRepository(
    jwt,
    MaterializationsApiRepository.getBy,
    {}
  );
  const [cols, setCols] = useApiRepository(jwt, ColumnsApiRepository.getBy, {});
  const [testSuite, setTestSuite] = useApiRepository(
    jwt,
    ObservabilityApiRepo.getTestSuites
  );
  const [testQualSuite, setTestQualSuite] = useApiRepository(
    jwt,
    ObservabilityApiRepo.getQualTestSuites
  );

  const [tableData, setTableData] = useState({
    loading: true,
    tableData: new Map(),
  });

  useEffect(() => {
    if (mats && cols && testSuite && testQualSuite) {
      const start = performance.now();
      setTableData({
        loading: false,
        tableData: buildTableData(mats, cols, testSuite, testQualSuite),
      });
      const end = performance.now();
      console.log(end - start);
    }
  }, [mats, cols, testSuite, testQualSuite]);

  return (
    <TableContext.Provider
      value={{
        ...tableContextData,
        jwt,
        mats,
        setMats,
        cols,
        setCols,
        testSuite,
        setTestSuite,
        testQualSuite,
        setTestQualSuite,
      }}
    >
      <div className="h-screen w-full overflow-y-auto">
        <Navbar current="tests" jwt={undefined} />
        <StatusOverlay />
        <div className="items-top relative flex h-20 justify-center">
          <div className="relative mt-2 w-1/4">
            <SearchBox
              placeholder="Search..."
              label="testsearchbox"
              onChange={() => {}}
            />
          </div>
        </div>
        {tableData.loading ? (
          <> </>
        ) : (
          <MainTable
            tableData={tableData}
            buttonText={'Columns'}
            tableTitle="Tables"
            tableDescription="This is a test description."
            darkMode={false}
            columnLevel={false}
          />
        )}
      </div>
    </TableContext.Provider>
  );
}

interface Status {
  status: 'loading' | 'error' | 'success';
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function StatusOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const statusObject: Status = {
    status: 'success',
  };
  const [status, setStatus] = useState(statusObject);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="fixed bottom-12 right-12 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className={classNames(
            status.status === 'loading' ? 'bg-gray-300' : '',
            status.status === 'success' ? 'bg-cito' : '',
            status.status === 'error' ? 'bg-red-300' : '',
            'h-12 w-12 rounded-xl hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
          )}
        ></button>
      </div>

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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Queue
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Change Tests on Schema test_S
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Change Tests on Column NAME
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Change Tests on Database TEST_DB
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Done
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
