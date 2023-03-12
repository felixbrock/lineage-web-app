import Navbar from '../../components/navbar';
import MainTable from './tableComponents/mainTable';
import SearchBox from '../lineage/components/search-box';
import { useAccount, useApiRepository } from './dataComponents/useData';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import ObservabilityApiRepo from '../../infrastructure/observability-api/observability-api-repo';
import { useEffect, useState } from 'react';
import { buildTestSelectionStructure } from './dataComponents/buildTestData';
import { buildTableData } from './dataComponents/buildTableData';
import { tab } from '@testing-library/user-event/dist/tab';
import { table } from 'console';

export default function NewTest() {
  const [jwt, account] = useAccount();
  const mats = useApiRepository(jwt, MaterializationsApiRepository.getBy, {});
  const cols = useApiRepository(jwt, ColumnsApiRepository.getBy, {});
  const testSuite = useApiRepository(jwt, ObservabilityApiRepo.getTestSuites);
  const testQualSuite = useApiRepository(
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
    <div className="h-screen w-full overflow-y-auto">
      <Navbar current="tests" jwt={undefined} />
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
  );
}
