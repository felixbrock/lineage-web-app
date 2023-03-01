import Navbar from "../../components/navbar";
import MainTable from "./tableComponents/mainTable";
import SearchBox from "../lineage/components/search-box";
import { useTestData } from "./dataComponents/useData";

export default function NewTest() {

    const testData = useTestData()

    console.log(testData)

    return (
            <div className="h-screen w-full">
                <Navbar current="tests" jwt={undefined} />
                <div className="items-top relative flex h-20 justify-center">
                    <div className="relative mt-2 w-1/4">
                        <SearchBox
                            placeholder="Search..."
                            label="testsearchbox"
                            onChange={() => { }}
                        />
                    </div>
                </div>
                <MainTable
                    buttonOnClick={() => { }}
                    buttonText={"Columns"}
                    buttonIsDisclosure={true}
                    buttonDisclosureContent={
                        <MainTable
                            buttonOnClick={() => { }}
                            buttonText={"Edit"}
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
