import Navbar from '../../components/navbar';
import MainTable from './tableComponents/mainTable';
import SearchBox from '../lineage/components/search-box';
import { useAccount, useApiRepository } from './dataComponents/useData';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import ObservabilityApiRepo from '../../infrastructure/observability-api/observability-api-repo';
import { useEffect, useState } from 'react';
import { buildTestSelectionStructure } from './dataComponents/buildTestData';

export default function NewTest() {
  const [jwt, account] = useAccount();
  const mats = useApiRepository(jwt, MaterializationsApiRepository.getBy, {});
  const cols = useApiRepository(jwt, ColumnsApiRepository.getBy, {});
  const testSuite = useApiRepository(jwt, ObservabilityApiRepo.getTestSuites);
  const testQualSuite = useApiRepository(
    jwt,
    ObservabilityApiRepo.getQualTestSuites
  );

  const [tableData, setTableData] = useState({ loading: true, tableData: {} });

  useEffect(() => {
    if (mats && cols && testSuite && testQualSuite) {
      setTableData(
        buildTestSelectionStructure(mats, cols, testSuite, testQualSuite)
      );
    }
  }, [mats, cols, testSuite, testQualSuite]);

  console.log(tableData);

  return (
    <div className="h-screen w-full">
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
      <MainTable
        buttonOnClick={() => {}}
        buttonText={'Columns'}
        buttonIsDisclosure={true}
        buttonDisclosureContent={
          <MainTable
            buttonOnClick={() => {}}
            buttonText={'Edit'}
            buttonIsDisclosure={false}
            darkMode={true}
          />
        }
        tableTitle="Tables"
        tableDescription="This is a test description."
      />
    </div>
  );
}
