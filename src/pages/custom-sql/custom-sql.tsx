import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAccount } from "../test/dataComponents/useData";
import Navbar from "../../components/navbar";
import { Alert, AlertInfo } from "../test/tableComponents/alert";
import { Fragment, useEffect, useState } from "react";
import SearchBox from "../lineage/components/search-box";
import ObservabilityApiRepo from "../../infrastructure/observability-api/observability-api-repo";
import { CustomTestSuiteDto } from "../../infrastructure/observability-api/test-suite-dto";
import Toggle from "./components/custom-toggle";
import { getFrequency } from "../test/utils/cron";
import { Transition } from "@headlessui/react";
import { MdClose, MdDelete, MdFiberManualRecord } from "react-icons/md";
import FrequencyDropdown from "./components/custom-frequency-dropdown";
import { DEFAULT_FREQUENCY, EXECUTION_TYPE } from "../test/config";
import ModelVisualiser from "../../components/model-visualiser";
import { format } from 'sql-formatter';

const TRANSITION_TIMEOUT = 500;

export default function CustomSql() {

    const jwt = useAccount();
    const [tests, setTests] = useState<CustomTestSuiteDto[]>([]);
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState<CustomTestSuiteDto[]>([]);
    const [visibleTests, setVisibleTests] = useState<boolean[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState<CustomTestSuiteDto>();
    const [showSelectedTest, setShowSelectedTest] = useState(false);

    const [newTestName, setNewTestName] = useState('');
    const [newTestDescription, setNewTestDescription] = useState('');
    const [newTestSql, setNewTestSql] = useState('');
    const [newTestFrequency, setNewTestFrequency] = useState('');
    
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
        setVisibleTests(Array(results.length).fill(true));
    };

    const searchTests = () => {
        const results: CustomTestSuiteDto[] = [];

        tests.forEach((test) => {
            if (test.name.toLowerCase().includes(searchString)) {
                results.push(test);
            }
        });

        setSearchResults(results);
        setVisibleTests(Array(results.length).fill(true));
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const clearStates = () => {
        setNewTestName('');
        setNewTestDescription('');
        setNewTestSql('');
        setNewTestFrequency('');
    };

    const handleCancelButton = () => {
        clearStates();
        
        toggleModal();
    };

    const buildCronExpression = (frequency: string) => {
        const currentDate = new Date();
        const currentMinutes = currentDate.getUTCMinutes();
        const currentHours = currentDate.getUTCHours();
      
        switch (frequency) {
          case '1h':
            return `${currentMinutes} * * * ? *`;
      
          case '3h':
            return `${currentMinutes} */3 * * ? *`;
      
          case '6h':
            return `${currentMinutes} */6 * * ? *`;
      
          case '12h':
            return `${currentMinutes} */12 * * ? *`;
      
          case '24h':
            return `${currentMinutes} ${currentHours} * * ? *`;
          default:
            return '';
        }
    };

    const handleSubmitButton = async () => {
        const existingTests = [...tests];
        const cronString = buildCronExpression(newTestFrequency);

        const acceptedCustomTestSuite 
            = await ObservabilityApiRepo.postCustomTestSuite({
                activated: true,
                name: newTestName,
                description: newTestDescription,
                executionType: EXECUTION_TYPE,
                cron: cronString ? cronString : DEFAULT_FREQUENCY,
                sqlLogic: newTestSql,
                targetResourceIds: [],
            });
        
        existingTests.push(acceptedCustomTestSuite);
        setTests(existingTests);
        setSearchResults(existingTests);
        setVisibleTests(Array(existingTests.length).fill(true));

        clearStates();
        toggleModal();
    };

    const handleSoftDeleteCustomTest = async (index: number, id: string) => {
        const updatedVisibleTests = [...visibleTests];
        updatedVisibleTests[index] = false;
        setVisibleTests(updatedVisibleTests);

        setTimeout(async () => {
            await ObservabilityApiRepo.deleteCustomTestSuite(id, 'soft');
            
            const existingTests = [...tests];
            const existingSearchResults = [...searchResults];
            const existingVisibleTests = [...visibleTests];

            const testIndex = existingTests.findIndex((el) => el.id === id);
            if (testIndex !== -1) {
                existingTests.splice(testIndex, 1);
            }

            existingSearchResults.splice(index, 1);
            existingVisibleTests.splice(index, 1);

            setTests(existingTests);
            setSearchResults(existingSearchResults);
            setVisibleTests(existingVisibleTests);
        }, TRANSITION_TIMEOUT);
    };

    const selectTest = (test: CustomTestSuiteDto) => {
        setSelectedTest(test);
        setShowSelectedTest(true);
    }

    const deselectTest = () => {
        setShowSelectedTest(false);

        setTimeout(() => {
            setSelectedTest(undefined);
        }, 200);
    }

    const formatSqlQuery = (query: string) => {
        return format(query, {
            language: 'sql',
            tabWidth: 2,
            keywordCase: 'upper'
        })
    }

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
                <div className="p-6 grid grid-cols-2 gap-4">
                    {searchResults.map((test, index) => (
                        <Transition
                            key={index}
                            show={visibleTests[index] ?? false}
                            enter="transition-opacity duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="p-4 shadow-2xl mb-4 border-2 hover:border-purple-600 transition-all duration-500 rounded-lg">
                                <div className="flex items-center">
                                    <h1 className="flex-grow font-bold text-2xl" onClick={() => selectTest(test)}>{test.name}</h1>
                                    <Toggle test={test} />
                                    <button type="button" onClick={() => handleSoftDeleteCustomTest(index, test.id)}>
                                        <MdDelete className="h-8 w-8 fill-gray-500 hover:fill-cito transition-all duration-500"/>
                                    </button>
                                </div>
                                <div onClick={() => selectTest(test)}>
                                    <div className="mb-2">
                                        {test.description ? (<p className="text-lg italic mb-2">{test.description}</p>) : (<br className="mb-2"/>)}
                                    </div>
                                    <p><span className="font-bold">Test ID: </span>{test.id}</p>
                                    <p><span className="font-bold">Frequency: </span>{getFrequency(test.cron)}h</p>
                                    <p className="truncate pr-10 mr-10"><span className="font-bold">SQL Query: </span>{test.sqlLogic}</p>
                                </div>
                            </div>
                        </Transition>
                        ))
                    }
                </div>
            </div>

            <Transition appear show={showSelectedTest} className="relative">
                <>
                    <div className="fixed inset-0 z-60 bg-black opacity-50" onClick={deselectTest}></div>
                    
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom='opacity-100 scale-100'
                        leaveTo='opacity-0 scale-95'
                    >
                        <div className="fixed inset-x-0 z-60 mx-auto w-3/4 max-w-3xl overflow-y-auto flex flex-col bg-white rounded-2xl p-6 transition-all" style={{top: "10%"}}>
                            <div className="flex justify-between mb-1">
                                <div className="flex items-center">
                                    <h3 className="text-3xl mt-2 ml-2 font-bold leading-6 text-gray-900">{selectedTest?.name}</h3>
                                    {selectedTest?.activated ? (
                                      <MdFiberManualRecord className="h-6 w-6 mt-2 ml-2 fill-green-500" />
                                    ) : (
                                      <MdFiberManualRecord className="h-6 w-6 mt-2 ml-2 fill-red-500" />
                                    )}
                                </div>
                                <button type="button" className="flex items-center justify-end px-4 py-2" onClick={deselectTest}>
                                    <MdClose className="h-6 w-6 fill-gray-500 hover:fill-cito" />
                                </button>
                            </div>
                            <div className="mt-2 ml-2 text-lg">
                                <div className="mb-6">
                                        {selectedTest?.description ? (<p className="text-lg italic">{selectedTest.description}</p>) : (<br />)}
                                </div>                                
                                <p><span className="font-bold">Test ID: </span>{selectedTest?.id}</p>
                                <p><span className="font-bold">Frequency: </span>{selectedTest ? `${getFrequency(selectedTest.cron)}h` : ''}</p>
                                <p><span className="font-bold">SQL Query:</span></p>
                                <div className="mt-2">
                                    <ModelVisualiser sql={selectedTest ? formatSqlQuery(selectedTest.sqlLogic) : ''} />
                                </div>
                            </div>
                        </div>

                    </Transition.Child>
                </>
            </Transition>

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
                                <h3 className="text-3xl mt-2 font-bold leading-6 text-gray-900">Create New Custom Test</h3>
                                <button type="button" className="flex items-center justify-end px-4 py-2" onClick={handleCancelButton}>
                                    <MdClose className="h-6 w-6 fill-gray-500 hover:fill-cito" />
                                </button>
                            </div>
                            <p className="text-right text-sm text-red-500 mt-2 mb-4">* Indicates required field</p>
                            
                            <div className="flex items-center mb-2">
                                <h2 className="mr-2">Name<span className="text-red-500"> *</span></h2>
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
                                <h2 className="mr-2">Frequency</h2>                                
                            </div>
                            <FrequencyDropdown newTestFrequency={newTestFrequency} setNewTestFrequency={setNewTestFrequency} />

                            <div className="mt-4 flex items-center mb-2">
                                <h2 className="mr-2">SQL Logic<span className="text-red-500"> *</span></h2>
                            </div>
                            <textarea
                                rows={3}
                                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 p-2 leading-tight text-gray-700 
                                            focus:border-gray-500 focus:bg-white focus:outline-none transition duration-300"
                                required
                                placeholder="Enter the SQL logic for your test..."
                                value={newTestSql}
                                onChange={(e) => setNewTestSql(e.target.value)}
                            />

                            <div className="flex flex-row mt-6 justify-end">
                                <button 
                                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all 
                                                duration-500 p-2 mb-2 mr-4 rounded"
                                    onClick={handleSubmitButton}
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