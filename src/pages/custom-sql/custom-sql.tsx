import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAccount } from "../test/dataComponents/useData";
import Navbar from "../../components/navbar";
import { Alert, AlertInfo } from "../test/tableComponents/alert";
import { Fragment, useEffect, useState } from "react";
import SearchBox from "../lineage/components/search-box";
import ObservabilityApiRepo from "../../infrastructure/observability-api/observability-api-repo";
import { CustomTestSuiteDto } from "../../infrastructure/observability-api/test-suite-dto";
import Toggle from "../custom-sql/components/toggle";
import { getFrequency } from "../test/utils/cron";
import { Transition } from "@headlessui/react";
import { MdClose } from "react-icons/md";
import FrequencyDropdown from "./components/frequency-dropdown";


export default function CustomSql() {

    const jwt = useAccount();
    const [tests, setTests] = useState<CustomTestSuiteDto[]>([]);
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState<CustomTestSuiteDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newTestName, setNewTestName] = useState('');
    const [newTestDescription, setNewTestDescription] = useState('');
    const [newTestSql, setNewTestSql] = useState('');
    const [newTestFrequency, setNewTestFrequency] = useState('');
    const [newTestLowerThreshold, setNewTestLowerThreshold] = useState('');
    const [newTestUpperThreshold, setNewTestUpperThreshold] = useState('');
    
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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCancelButton = () => {
        setNewTestName('');
        setNewTestDescription('');
        setNewTestSql('');
        setNewTestFrequency('');
        setNewTestLowerThreshold('');
        setNewTestUpperThreshold('');
        
        toggleModal();
    };

    const handleSubmitButton = () => {

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
                    <div className="relative flex items-center w-1/4">
                        <SearchBox
                        placeholder="Search..."
                        label="testsearchbox"
                        onChange={(e) => setSearchString(e.target.value)}
                        />
                    </div>
                    <div className="absolute right-0 p-6">
                            <button 
                                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-500 px-4 py-2 rounded"
                                onClick={toggleModal}>
                                Create New Test
                            </button>
                    </div>
                </div>
                <div className="p-6">
                    {searchResults.map((test, index) => (
                        <div key={index} className="p-4 shadow-2xl mb-6 border-2 hover:border-purple-600 transition-all duration-500 rounded-lg">
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
            <Transition appear show={isModalOpen} className="relative">
                <>
                    <div className="fixed inset-0 z-60 bg-black opacity-50"></div>

                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom='opacity-100 scale-100'
                        leaveTo='opacity-0 scale-95'
                    >

                        <div className="fixed inset-x-0 z-60 mx-auto w-3/4 max-w-3xl flex flex-col bg-white rounded-2xl p-6 transition-all" style={{top: "10%"}}>
                            <div className="flex justify-between mb-1">
                                <h3 className="text-2xl mt-2 font-bold leading-6 text-gray-900">Create New Custom Test</h3>
                                <button type="button" className="flex items-center justify-end px-4 py-2" onClick={handleCancelButton}>
                                    <MdClose className="h-6 w-6 fill-gray-500 hover:fill-cito" />
                                </button>
                            </div>
                            <p className="text-right text-sm text-red-500 mt-2 mb-4">* Indicates required field</p>
                            
                            <div className="flex items-center mb-2">
                                <h2 className="mr-2">Name<span className="text-red-500">*</span></h2>
                            </div>
                            <input
                                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 
                                            focus:border-gray-500 focus:bg-white focus:outline-none transition duration-300"
                                required
                                type="text"
                                placeholder="Enter the name for your test..."
                                value={newTestName}
                                onChange={(e) => setNewTestName(e.target.value)}
                            />
                            
                            <div className="mt-4 flex items-center mb-2">
                                <h2 className="mr-2">Description</h2>
                            </div>
                            <input
                                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 
                                            focus:border-gray-500 focus:bg-white focus:outline-none transition duration-300"
                                type="text"
                                placeholder="Enter the description for your test..."
                                value={newTestDescription}
                                onChange={(e) => setNewTestDescription(e.target.value)}
                            />
                            
                            <div className="mt-4 flex items-center mb-2">
                                <h2 className="mr-2">SQL Logic<span className="text-red-500">*</span></h2>
                            </div>
                            <textarea
                                rows={2}
                                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 
                                            focus:border-gray-500 focus:bg-white focus:outline-none transition duration-300"
                                required
                                placeholder="Enter the SQL logic for your test..."
                                value={newTestSql}
                                onChange={(e) => setNewTestSql(e.target.value)}
                            />

                            <div className="mt-4 flex items-center mb-2">
                                <h2 className="mr-2">Frequency<span className="text-red-500">*</span></h2>                                
                            </div>
                            <FrequencyDropdown newTestFrequency={newTestFrequency} setNewTestFrequency={setNewTestFrequency} />
                            <div className="mt-4 flex items-center mb-2">
                                <h2 className="mr-2">Lower Threshold</h2>
                            </div>
                            <input
                                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 
                                            focus:border-gray-500 focus:bg-white focus:outline-none transition duration-300"
                                type="number"
                                placeholder="Enter the lower threshold for your test..."
                                value={newTestLowerThreshold}
                                onChange={(e) => setNewTestLowerThreshold(e.target.value)}
                            />

                            <div className="mt-4 flex items-center mb-2">
                                <h2 className="mr-2">Upper Threshold</h2>
                            </div>
                            <input
                                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 
                                            focus:border-gray-500 focus:bg-white focus:outline-none transition duration-300"
                                type="number"
                                placeholder="Enter the upper threshold for your test..."
                                value={newTestUpperThreshold}
                                onChange={(e) => setNewTestUpperThreshold(e.target.value)}
                            />

                            <div className="flex flex-row mt-4 justify-end">
                                <button 
                                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all 
                                                duration-500 p-2 mb-2 mr-4 rounded"
                                    onClick={toggleModal}
                                >
                                    Submit
                                </button>
                                <button 
                                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all 
                                                duration-500 p-2 mb-2 rounded"
                                    onClick={handleCancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                    </Transition.Child>
                </>
            </Transition>
        </ThemeProvider>

    );
}