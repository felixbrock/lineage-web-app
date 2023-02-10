import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { FaGithub, FaSlack } from 'react-icons/fa';
import { SiSnowflake } from 'react-icons/si';
import './lineage.scss';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MetricsGraph, {
  defaultOption,
  defaultYAxis,
  TestHistoryEntry,
} from '../../components/metrics-graph';

import LineageApiRepository from '../../infrastructure/lineage-api/lineage/lineage-api-repository';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import LineageDto from '../../infrastructure/lineage-api/lineage/lineage-dto';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
import LogicApiRepository from '../../infrastructure/lineage-api/logics/logics-api-repository';
import { defaultLogics } from './test-data';

import { Tab } from '@headlessui/react';
import BasicCard from '../../components/card';
import BasicTable from '../../components/table';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth } from 'aws-amplify';
import { useLocation, useSearchParams } from 'react-router-dom';
import DashboardDto from '../../infrastructure/lineage-api/dashboards/dashboard-dto';
import DashboardsApiRepository from '../../infrastructure/lineage-api/dashboards/dashboards-api-repository';
import AccountApiRepository from '../../infrastructure/account-api/account-api-repo';
import IntegrationApiRepo from '../../infrastructure/integration-api/integration-api-repo';
import Github from '../../components/integration/github/github';
import Slack from '../../components/integration/slack/slack';
import Snowflake from '../../components/integration/snowflake/snowflake';
import AccountDto from '../../infrastructure/account-api/account-dto';
import {
  deafultErrorDashboards,
  defaultErrorColumns,
  defaultErrorDependencies,
  defaultErrorLineage,
  defaultErrorMaterializations,
} from './error-handling-data';
import { EmptyStateIntegrations } from './components/empty-state';
import { SectionHeading } from './components/headings';
import AlertHistoryTable from './components/alert-history-table';
import Navbar from '../../components/navbar';
import { Snackbar, Alert } from '@mui/material';
import LoadingScreen from '../../components/loading-screen';
import appConfig from '../../config';
import SideNav from './components/side-nav';
import LineageGraph, {
  SelectedElement,
  SourceData,
} from './components/lineage-graph';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export interface AlertHistoryEntry {
  date: string;
  testType: string;
  deviation: number;
}

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

export default (): ReactElement => {
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const [account, setAccount] = useState<AccountDto>();
  const [user, setUser] = useState<any>();
  const [jwt, setJwt] = useState('');

  const [sql, setSQL] = useState('');
  const [selectionTests, setSelectionTests] = useState<TestHistoryEntry[]>([]);
  const [selectionAlertHistory, setSelectionAlertHistory] = useState<
    AlertHistoryEntry[]
  >([]);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(true);
  const [lineage, setLineage] = useState<LineageDto>();
  const [sourceData, setSourceData] = useState<SourceData>();
  const [graphSourceData, setGraphSourceData] = useState<SourceData>();
  const [integrationSidePanelTabIndex, setIntegrationSidePanelTabIndex] =
    React.useState<number>(-1);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [showIntegrationSidePanel, setShowIntegrationSidePanel] =
    useState<boolean>();
  const [isRightPanelShown, setIsRightPanelShown] = useState(false);
  const [integrations, setIntegrations] = useState<any>([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleSidePanelTabIndexChange = (
    event: SyntheticEvent,
    newValue: number
  ) => {
    setIntegrationSidePanelTabIndex(newValue);
  };

  const setIsRightPanelShownCallback = (show: boolean) =>
    setIsRightPanelShown(show);

  const nodeSelectCallback = (nodeId: string) => {
    const panel = document.getElementById('columnSidePanel');
    if (!panel) throw new ReferenceError('Column Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';

    setSelectedNodeId(nodeId);
  };

  const comboSelectCallback = async (comboId: string, logicId?: string) => {
    setSelectedNodeId(comboId);

    if (!logicId) return;

    if (appConfig.react.showRealData) {
      const logicDto = await LogicApiRepository.getOne(logicId, jwt);

      if (!logicDto)
        throw new ReferenceError('Not able to retrieve logic object');

      setSQL(logicDto.sql);
    } else {
      const logic = defaultLogics.find((element) => element.id === logicId);

      if (!logic)
        throw new ReferenceError('Logic object for selected combo not found');

      setSQL(logic.sql);
    }
  };

  const showIntegrationPanelCallback = (show: boolean) =>
    setShowIntegrationSidePanel(show);

  const sideNavClickCallback = async (
    selectedEl: SelectedElement,
    comboId?: string
  ): Promise<void> => {
    if (!sourceData) throw new Error('Source data not found');
    if (selectedEl.type === 'node' && !comboId)
      throw new Error('Error: Node selected but no combo id provided');

    const localSourceData = sourceData;

    localSourceData.selectedEl = selectedEl;

    if (selectedEl.type === 'combo')
      localSourceData.cols = await ColumnsApiRepository.getBy(
        new URLSearchParams({ materializationIds: selectedEl.id }),
        jwt
      );

    /* 
  XXXXXXXXXXXXX 
  XXXXXXXXXXXXX 
    todo - implement get By tailIds  
  XXXXXXXXXXXXX 
  XXXXXXXXXXXXX 
  */
    // const dependencyDtos = DependenciesApiRepository.getBy(new URLSearchParams({}), jwt);
    // setDependencies(dependencyDtos);

    /* 
  XXXXXXXXXXXXX 
  XXXXXXXXXXXXX 
    load columns that are relevant based on dependencies  
  XXXXXXXXXXXXX 
  XXXXXXXXXXXXX 
  */

    setSourceData({ ...localSourceData });
    setGraphSourceData({
      ...localSourceData,
      mats:
        selectedEl.type === 'combo'
          ? localSourceData.mats.filter((el) => el.id === selectedEl.id)
          : localSourceData.mats.filter((el) => el.id === comboId),
    });
  };

  const simulateSideNavClick = async (
    selectedEl: SelectedElement
  ): Promise<void> => {
    await sideNavClickCallback(selectedEl);
  };

  const toggleShowSideNav = () => {
    const sidenav = document.getElementById('sidenav');
    if (!sidenav) throw new ReferenceError('Sidenav does not exist');

    const visible = sidenav.style.visibility === 'visible';
    sidenav.style.visibility = visible ? 'hidden' : 'visible';
    sidenav.style.opacity = visible ? '0' : '1';
  };

  const closeMatSidePanel = () => {
    setSQL('');

    const panel = document.getElementById('materializationSidePanel');
    if (!panel)
      throw new ReferenceError('Materialization Panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  };

  const closeColSidePanel = () => {
    const panel = document.getElementById('columnSidePanel');
    if (!panel) throw new ReferenceError('Column Panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  };

  const closeIntegrationSidePanel = () => {
    setIntegrationSidePanelTabIndex(-1);
    setShowIntegrationSidePanel(false);

    const panel = document.getElementById('integrationsSidePanel');
    if (!panel) throw new ReferenceError('Integrations panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  };

  const renderLineage = () => {
    setUser(undefined);
    setJwt('');
    setAccount(undefined);

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.federatedSignIn();
      });
  };

  useEffect(() => {
    if (!location || !searchParams) return;

    renderLineage();
  }, [location, searchParams]);

  useEffect(() => {
    if (!user) return;
    let token: string;
    Auth.currentSession()
      .then((session) => {
        const accessToken = session.getAccessToken();

        token = accessToken.getJwtToken();

        setJwt(token);

        return AccountApiRepository.getBy(new URLSearchParams({}), token);
      })
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setAccount(accounts[0]);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);
        sessionStorage.clear();

        Auth.signOut();
      });
  }, [user]);

  useEffect(() => {
    if (integrationSidePanelTabIndex === -1) return;
    setShowIntegrationSidePanel(true);
  }, [integrationSidePanelTabIndex]);

  const handleRedirect = () => {
    if (!integrations.length) return;

    const state = location.state;

    if (!state) return;
    if (typeof state !== 'object')
      throw new Error('Unexpected navigation state type');

    const { sidePanelTabIndex: localSidePanelTabIndexChange } = state as any;

    if (localSidePanelTabIndexChange !== undefined)
      setIntegrationSidePanelTabIndex(localSidePanelTabIndexChange);

    window.history.replaceState({}, document.title);
  };

  useEffect(() => {
    if (!account) return;

    if (!jwt) throw new Error('No user authorization found');

    if (lineage) return;

    toggleShowSideNav();

    const mats: MaterializationDto[] = [];
    const dashboards: DashboardDto[] = [];

    if (appConfig.react.showRealData) {
      LineageApiRepository.getLatest(jwt, false)
        // LineageApiRepository.getOne('633c7c5be2f3d7a22896fb62', jwt)
        .then((lineageDto) => {
          if (!lineageDto)
            throw new TypeError('Queried lineage object not found');
          setLineage(lineageDto);
          return MaterializationsApiRepository.getBy(
            new URLSearchParams({}),
            jwt
          );
        })
        .then((materializationDtos) => {
          mats.push(...materializationDtos);
          return DashboardsApiRepository.getBy(new URLSearchParams({}), jwt);
        })
        .then((dashboardDtos) => {
          dashboards.push(...dashboardDtos);

          if (mats.length)
            return ColumnsApiRepository.getBy(
              new URLSearchParams({ materializationIds: mats[0].id }),
              jwt
            );
        })
        .then((cols) => {
          if (cols) {
            setSourceData({
              cols,
              dashboards,
              mats,
              dependencies: [],
            });

            setGraphSourceData({
              cols,
              dashboards: [],
              mats: [mats[0]],
              dependencies: [],
              selectedEl: {
                id: mats[0].id,
                type: 'combo',
              },
            });
          } else {
            setSourceData({
              cols: [],
              dashboards,
              mats,
              dependencies: [],
            });

            setGraphSourceData({
              cols: [],
              dashboards: [],
              mats: [],
              dependencies: [],
            });
          }

          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);

          setLineage(defaultErrorLineage);
          setSourceData({
            cols: defaultErrorColumns,
            dashboards: deafultErrorDashboards,
            mats: defaultErrorMaterializations,
            dependencies: defaultErrorDependencies,
            selectedEl: defaultErrorColumns.length
              ? { id: defaultErrorColumns[0].id, type: 'node' }
              : undefined,
          });
          setGraphSourceData({
            cols: [],
            dashboards: [],
            dependencies: [],
            mats: [],
          });

          setIsDataAvailable(false);
          setIsLoading(false);
        });
    } else {
      setLineage({
        id: 'todo',
        createdAt: '',
        completed: true,
        dbCoveredNames: [],
        diff: '',
      });
      setIsLoading(false);
    }

    handleRedirect();
  }, [account]);

  useEffect(() => {
    if (!integrations.length) return;

    const panel = document.getElementById('integrationsSidePanel');
    if (!panel) throw new ReferenceError('Integrations Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  }, [integrations]);

  useEffect(() => {
    if (!showIntegrationSidePanel || !account) return;

    closeColSidePanel();
    closeMatSidePanel();

    setIntegrations([
      ...[
        {
          name: 'Snowflake',
          icon: SiSnowflake,
          tabContentJsx: (
            <Snowflake
              jwt={jwt}
              parentHandleSaveClick={() => setSnackbarOpen(true)}
            ></Snowflake>
          ),
        },
        {
          name: 'GitHub',
          icon: FaGithub,
          tabContentJsx: (
            <Github organizationId={account.organizationId} jwt={jwt}></Github>
          ),
        },
        {
          name: 'Slack',
          icon: FaSlack,
          tabContentJsx: (
            <Slack organizationId={account.organizationId} jwt={jwt}></Slack>
          ),
        },
      ],
    ]);
  }, [showIntegrationSidePanel]);

  useEffect(() => {
    if (!account) return;

    const binds: (string | number)[] = [selectedNodeId, 'true'];

    const testSuiteQuery = `select id, test_type from cito.observability.test_suites
     where target_resource_id = '${binds[0]}' and activated = ${binds[1]} and deleted_at is null`;

    let testHistory: { [testSuiteId: string]: TestHistoryEntry };
    IntegrationApiRepo.querySnowflake(testSuiteQuery, jwt)
      .then((results) => {
        testHistory = results[account.organizationId].reduce(
          (
            accumulation: { [testSuiteId: string]: TestHistoryEntry },
            el: { [key: string]: unknown }
          ): { [testSuiteId: string]: TestHistoryEntry } => {
            const localAcc = accumulation;

            const { ID: id, TEST_TYPE: testType } = el;

            if (typeof id !== 'string' || typeof testType !== 'string')
              throw new Error('Receive unexpected types');

            localAcc[id] = { testSuiteId: id, testType, historyDataSet: [] };

            return localAcc;
          },
          {}
        );

        const whereCondition = `array_contains(test_history.test_suite_id::variant, array_construct(${Object.values(
          testHistory
        )
          .map((el) => `'${el.testSuiteId}'`)
          .join(', ')}))`;

        const testHistoryQuery = `
        select 
          test_history.test_suite_id as test_suite_id,
          test_history.value as value,
          test_executions.executed_on as executed_on,
          test_results.expected_value_upper_bound as value_upper_bound,
          test_results.expected_value_lower_bound as value_lower_bound,
          test_history.is_anomaly as is_anomaly,
          test_history.user_feedback_is_anomaly as user_feedback_is_anomaly 
        from cito.observability.test_history as test_history
        inner join cito.observability.test_executions as test_executions
          on test_history.execution_id = test_executions.id
        left join cito.observability.test_results as test_results
          on test_history.execution_id = test_results.execution_id
        where ${whereCondition}
        order by test_executions.executed_on desc limit 200;`;

        return IntegrationApiRepo.querySnowflake(testHistoryQuery, jwt);
      })
      .then((testHistoryResults) => {
        const results: { [key: string]: unknown }[] =
          testHistoryResults[account.organizationId].reverse();

        results.forEach((el: { [key: string]: unknown }) => {
          const {
            VALUE: value,
            TEST_SUITE_ID: testSuiteId,
            EXECUTED_ON: executedOn,
            VALUE_UPPER_BOUND: valueUpperBound,
            VALUE_LOWER_BOUND: valueLowerBound,
            IS_ANOMALY: isAnomaly,
            USER_FEEDBACK_IS_ANOMALY: userFeedbackIsAnomaly,
          } = el;

          const isOptionalOfType = <T,>(
            val: unknown,
            targetType:
              | 'string'
              | 'number'
              | 'bigint'
              | 'boolean'
              | 'symbol'
              | 'undefined'
              | 'object'
              | 'function'
          ): val is T => val === null || typeof val === targetType;

          if (
            typeof value !== 'number' ||
            typeof testSuiteId !== 'string' ||
            typeof executedOn !== 'string' ||
            typeof isAnomaly !== 'boolean' ||
            typeof userFeedbackIsAnomaly !== 'number' ||
            !isOptionalOfType<number>(valueLowerBound, 'number') ||
            !isOptionalOfType<number>(valueUpperBound, 'number')
          )
            throw new Error('Received unexpected type');

          testHistory[testSuiteId].historyDataSet.push({
            isAnomaly,
            userFeedbackIsAnomaly,
            timestamp: executedOn,
            valueLowerBound,
            valueUpperBound,
            value,
          });
        });

        setSelectionTests(Object.values(testHistory));

        const whereCondition = `array_contains(test_alerts.test_suite_id::variant, array_construct(${Object.values(
          testHistory
        )
          .map((el) => `'${el.testSuiteId}'`)
          .join(', ')}))`;

        const alertQuery = `select test_alerts.test_suite_id as test_suite_id, test_results.deviation as deviation, test_executions.executed_on as executed_on
        from cito.observability.test_alerts as test_alerts
        join cito.observability.test_results as test_results
          on test_alerts.execution_id = test_results.execution_id
        join cito.observability.test_executions as test_executions
          on test_alerts.execution_id = test_executions.id
        where ${whereCondition}
        order by test_executions.executed_on desc
        limit 200;`;

        return IntegrationApiRepo.querySnowflake(alertQuery, jwt);
      })
      .then((alertHistoryResults) => {
        const results = alertHistoryResults[account.organizationId];

        const testSuiteRepresentations = Object.values(testHistory);

        const alertHistoryEntries: AlertHistoryEntry[] = results.map(
          (el: { [key: string]: unknown }): AlertHistoryEntry => {
            const {
              TEST_SUITE_ID: testSuiteId,
              DEVIATION: deviation,
              EXECUTED_ON: executedOn,
            } = el;

            if (
              typeof executedOn !== 'string' ||
              (typeof deviation !== 'string' &&
                typeof deviation !== 'number') ||
              typeof testSuiteId !== 'string'
            )
              throw new Error('Received unexpected type');

            const deviationValue =
              typeof deviation === 'number'
                ? +((Math.round(deviation * 100) / 100) * 100).toFixed(2)
                : +(
                    (Math.round(parseFloat(deviation) * 100) / 100) *
                    100
                  ).toFixed(2);

            const repIndex = testSuiteRepresentations.findIndex(
              (rep) => rep.testSuiteId === testSuiteId
            );

            if (repIndex === -1) throw new Error('Test-Type not not found');

            return {
              date: executedOn,
              testType: testSuiteRepresentations[repIndex].testType,
              deviation: deviationValue,
            };
          }
        );

        setSelectionAlertHistory(alertHistoryEntries);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);
      });
  }, [selectedNodeId]);

  useEffect(() => {
    if (!sql) return;

    const panel = document.getElementById('materializationSidePanel');
    if (!panel) throw new ReferenceError('SQL Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  }, [sql]);

  const graphBuiltCallback = () => {
    const targetResourceId = searchParams.get('targetResourceId');
    if (targetResourceId)
      simulateSideNavClick({ id: targetResourceId, type: 'node' });
  };

  return (
    <ThemeProvider theme={theme}>
      <div id="lineageContainer">
        <Navbar
          current="lineage"
          toggleLeftPanel={toggleShowSideNav}
          toggleRightPanelFunctions={{
            open: () => setIntegrationSidePanelTabIndex(0),
            close: closeIntegrationSidePanel,
          }}
          isRightPanelShown={isRightPanelShown}
          setIsRightPanelShown={setIsRightPanelShown}
          jwt={jwt}
        />
        {!isDataAvailable && (
          <EmptyStateIntegrations onClick={handleSidePanelTabIndexChange} />
        )}
        {isLoading ? (
          <LoadingScreen tailwindCss="fixed flex w-full h-full items-center justify-center" />
        ) : (
          <></>
        )}
        <LineageGraph
          sourceData={graphSourceData}
          dataAvailable={isDataAvailable}
          closeColSidePanelCallback={closeColSidePanel}
          closeIntegrationSidePanelCallback={closeIntegrationSidePanel}
          closeMatSidePanelCallback={closeMatSidePanel}
          comboSelectCallback={comboSelectCallback}
          nodeSelectCallback={nodeSelectCallback}
          setIsRightPanelShownCallback={setIsRightPanelShownCallback}
          graphBuiltCallback={graphBuiltCallback}
        />
        <SideNav
          sourceData={sourceData}
          dataAvailable={isDataAvailable}
          showIntegrationPanelCallback={showIntegrationPanelCallback}
          navClickCallback={sideNavClickCallback}
        />
        <div id="materializationSidePanel" className="sidepanel">
          <div className="header">
            <SectionHeading
              title="Table Insights"
              onClick={closeColSidePanel}
            />
          </div>
          <div className="content mt-10">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-cito p-1">
                <Tab
                  key="table-test-history"
                  className={({ selected }) =>
                    classNames(
                      'flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-cito shadow'
                        : 'text-white hover:bg-white/[0.12]'
                    )
                  }
                >
                  Test History
                </Tab>
                <Tab
                  key="table-alert-history"
                  className={({ selected }) =>
                    classNames(
                      'flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-cito shadow'
                        : 'text-white hover:bg-white/[0.12]'
                    )
                  }
                >
                  Alert History
                </Tab>
                <Tab
                  key="table-sql-model"
                  className={({ selected }) =>
                    classNames(
                      'flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-cito shadow'
                        : 'text-white hover:bg-white/[0.12]'
                    )
                  }
                >
                  SQL Model
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel
                  key={0}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <>
                    {selectionTests.map((entry) => (
                      <div className={entry.testType}>
                        <h4>{entry.testType}</h4>
                        {entry.historyDataSet.length ? (
                          <MetricsGraph
                            option={defaultOption(
                              defaultYAxis,
                              entry.historyDataSet
                            )}
                          ></MetricsGraph>
                        ) : (
                          <div className="flex h-96 w-full items-center justify-center bg-gradient-to-r from-white via-purple-50 to-white">
                            <h4>
                              Test execution has not been triggered yet 📈
                            </h4>
                          </div>
                        )}
                      </div>
                    ))}
                    <br></br>
                  </>
                </Tab.Panel>
                <Tab.Panel
                  key={1}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <>
                    <AlertHistoryTable alertHistory={selectionAlertHistory} />
                  </>
                </Tab.Panel>
                <Tab.Panel
                  key={2}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <>
                    <div id="editor" className="content mt-10">
                      <SyntaxHighlighter
                        language="sql"
                        style={dracula}
                        showLineNumbers={true}
                        wrapLongLines={false}
                      >
                        {sql}
                      </SyntaxHighlighter>
                    </div>
                  </>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        <div id="columnSidePanel" className="sidepanel">
          <div className="header">
            <SectionHeading
              title="Column Insights"
              onClick={closeColSidePanel}
            />
          </div>
          <div className="content mt-10">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-cito p-1">
                <Tab
                  key="column-test-history"
                  className={({ selected }) =>
                    classNames(
                      'flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-cito shadow'
                        : 'text-white hover:bg-white/[0.12]'
                    )
                  }
                >
                  Test History
                </Tab>
                <Tab
                  key="column-alert-history"
                  className={({ selected }) =>
                    classNames(
                      'flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-cito shadow'
                        : 'text-white hover:bg-white/[0.12]'
                    )
                  }
                >
                  Alert History
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel
                  key={0}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <>
                    <div className="card">
                      {selectedNodeId === '627160717e3d8066494d41ff' ? (
                        BasicCard(20.6, 448, 3.4, 5.6)
                      ) : (
                        // : BasicCard(47011, 448, 4129, 17521)}
                        <></>
                      )}
                    </div>
                    {selectionTests.map((entry) => (
                      <div className={entry.testType}>
                        <h4>{entry.testType}</h4>
                        {entry.historyDataSet.length ? (
                          <MetricsGraph
                            option={defaultOption(
                              defaultYAxis,
                              entry.historyDataSet
                            )}
                          ></MetricsGraph>
                        ) : (
                          <div className="flex h-96 w-full items-center justify-center bg-gradient-to-r from-white via-purple-50 to-white">
                            <h4>
                              Test execution has not been triggered yet 📈
                            </h4>
                          </div>
                        )}
                      </div>
                    ))}
                    <br></br>
                  </>
                </Tab.Panel>
                <Tab.Panel
                  key={1}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <>
                    <div className="hidden">
                      {BasicTable(selectionAlertHistory)}
                    </div>
                    <AlertHistoryTable alertHistory={selectionAlertHistory} />
                  </>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        <div id="integrationsSidePanel" className="sidepanel">
          <div className="header">
            <SectionHeading
              title="Integrations"
              onClick={closeIntegrationSidePanel}
            />
          </div>
          <Tab.Group
            selectedIndex={integrationSidePanelTabIndex}
            onChange={setIntegrationSidePanelTabIndex}
          >
            <Tab.List className="mx-6 mt-10 flex space-x-1 rounded-xl bg-cito p-1">
              {Object.values(integrations).map((integration: any) => (
                <Tab
                  key={integration.name}
                  className={({ selected }) =>
                    classNames(
                      'flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-cito shadow'
                        : 'text-white hover:bg-white/[0.12]'
                    )
                  }
                >
                  <integration.icon className="h-6 w-6" />
                  {integration.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {Object.values(integrations).map((integration: any, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  {integration.tabContentJsx}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message="Saved"
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Saved
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};
