import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAccount } from "../test/dataComponents/useData";
import Navbar from "../../components/navbar";
import { Alert, AlertInfo } from "../test/tableComponents/alert";
import { useEffect, useState } from "react";
import SearchBox from "../lineage/components/search-box";
import ObservabilityApiRepo from "../../infrastructure/observability-api/observability-api-repo";
import { CustomTestSuiteDto } from "../../infrastructure/observability-api/test-suite-dto";
import Toggle from "../custom-sql/components/toggle";
import { getFrequency } from "../test/utils/cron";


export default function CustomSql() {

    const jwt = useAccount();
    const [tests, setTests] = useState<CustomTestSuiteDto[]>([]);
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState<CustomTestSuiteDto[]>([]);
    
    const alertInfoInit: AlertInfo = {
        show: false,
        title: '',
        description: '',
    };

    const [alertInfo, setAlertInfo] = useState(alertInfoInit);

    const theme = createTheme({
        palette: {
          primary: {
            main: '#6f47ef',
          },
          secondary: {
            main: '#000000',
          },
        },
    });

    const renderTests = async () => {
        const results = await ObservabilityApiRepo.getCustomTestSuites();
        setTests(results);
        setSearchResults(results);
    };

    const searchTests = () => {
        const results: CustomTestSuiteDto[] = [];

        tests.forEach((test) => {
            if (test.name.toLowerCase().includes(searchString)) {
                results.push(test);
            }
        });

        setSearchResults(results);
    };

    useEffect(() => {
        renderTests();
    }, []);

    useEffect(() => {
        searchTests();
    }, [searchString]);

    return (
        <ThemeProvider theme={theme}>
            <div className="mb-20 h-full w-full overflow-y-auto">
                <Navbar current="custom-sql" jwt={jwt} />
                <Alert alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
                <div className="items-center flex h-20 justify-center">
                    <div className="relative flex items-center mt-2 w-1/4">
                        <SearchBox
                        placeholder="Search..."
                        label="testsearchbox"
                        onChange={(e) => setSearchString(e.target.value)}
                        />
                    </div>
                    <div className="absolute right-0 p-6">
                            <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 rounded">Create New Test</button>
                    </div>
                </div>
                <div className="p-6">
                    {searchResults.map((test, index) => (
                        <div key={index} className="p-4 shadow-lg mb-6">
                            <div className="flex items-center">
                                <h1 className="flex-grow"><span className="font-bold">Test Name: </span>{test.name}</h1>
                                <Toggle test={test} />
                            </div>
                            {test.activated ? <p>Active</p> : <p>Deactive</p>}
                            {test.description ? <p><span className="font-bold">Test Description: </span>{test.description}</p> : <></>}
                            <p><span className="font-bold">Test ID: </span>{test.id}</p>
                            <p><span className="font-bold">SQL Query: </span>{test.sqlLogic}</p>
                            <p><span className="font-bold">Frequency: </span>{getFrequency(test.cron)}h</p>
                            {test.customLowerThreshold ? <p><span className="font-bold">Lower Threshold: </span>{test.customLowerThreshold}</p> : <></>}
                            {test.customUpperThreshold ? <p><span className="font-bold">Upper Threshold: </span>{test.customUpperThreshold}</p> : <></>}
                        </div>
                        ))
                    }
                </div>
            </div>
        </ThemeProvider>

    );
}