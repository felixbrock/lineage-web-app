import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { FaGithub, FaSlack } from 'react-icons/fa';
import { SiSnowflake } from 'react-icons/si';
import './lineage.scss';
import MetricsGraph, {
  defaultOption,
  getDefaultYAxis,
  HistoryDataSet,
  TestHistoryEntry,
} from '../../components/metrics-graph';

import {
  defaultColumns,
  defaultDependencies,
  defaultLogics,
  defaultMaterializations,
  defaultTestHistory,
} from './test-data';

import { Tab } from '@headlessui/react';
import BasicCard from '../../components/card';
import BasicTable from '../../components/table';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth } from 'aws-amplify';
import Github from '../../components/integration/github/github';
import Slack from '../../components/integration/slack/slack';
import Snowflake from '../../components/integration/snowflake/snowflake';
import { EmptyStateIntegrations } from './components/empty-state';
import { SectionHeading } from './components/headings';
import AlertHistoryTable from './components/alert-history-table';
import Navbar from '../../components/navbar';
import { Snackbar, Alert } from '@mui/material';
import LoadingScreen from '../../components/loading-screen';
import appConfig from '../../config';
import SideNav from './components/side-nav';
import LineageGraph, {
  GraphSourceData,
  SelectedElement,
  SourceData,
} from './components/lineage-graph';
import IntegrationTabs from './components/integration-tabs';
import LineageDto from '../../infrastructure/lineage-api/lineage/lineage-dto';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
import DashboardDto from '../../infrastructure/lineage-api/dashboards/dashboard-dto';
import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import DependencyDto from '../../infrastructure/lineage-api/dependencies/dependency-dto';
import ModelVisualizer from '../../components/model-visualizer';

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
  const [user, setUser] = useState<any>();

  const [sql, setSQL] = useState('');
  const [selectionTests, setSelectionTests] = useState<TestHistoryEntry[]>([]);
  const [lineage, setLineage] = useState<LineageDto>();
  const [sourceData, setSourceData] = useState<SourceData>();
  const [graphSourceData, setGraphSourceData] = useState<GraphSourceData>();
  const [integrationSidePanelTabIndex, setIntegrationSidePanelTabIndex] =
    React.useState<number>(0);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [showIntegrationSidePanel, setShowIntegrationSidePanel] =
    useState<boolean>();
  const [isRightPanelShown, setIsRightPanelShown] = useState(false);
  const [integrations, setIntegrations] = useState<any>([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const selectionAlertHistory: AlertHistoryEntry[] = [];
  const isDataAvailable = true;

  const lastModifiedInfos = ['Oliver Morana, 12 Minutes ago'];

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
      throw new Error('Not implemented');
    } else {
      const logic = defaultLogics.find((element) => element.id === logicId);

      if (!logic)
        throw new ReferenceError('Logic object for selected combo not found');

      setSQL(logic.sql);
    }
  };

  const showIntegrationPanelCallback = (show: boolean) =>
    setShowIntegrationSidePanel(show);

  const getSessionStorageData = ():
    | {
        lineage: LineageDto;
        mats: MaterializationDto[];
        cols: ColumnDto[];
        dashboards: DashboardDto[];
        dependencies: DependencyDto[];
      }
    | undefined => {
    const sessionStorageLineage = sessionStorage.getItem('lineage');
    if (!sessionStorageLineage) return undefined;

    const sessionStorageMats = sessionStorage.getItem('mats');
    const sessionStorageDashboards = sessionStorage.getItem('dashboards');
    const sessionStorageCols = sessionStorage.getItem('cols');
    const sessionStorageDependencies = sessionStorage.getItem('dependencies');

    return {
      lineage: JSON.parse(sessionStorageLineage),
      mats: sessionStorageMats ? JSON.parse(sessionStorageMats) : [],
      dashboards: sessionStorageDashboards
        ? JSON.parse(sessionStorageDashboards)
        : [],
      cols: sessionStorageCols ? JSON.parse(sessionStorageCols) : [],
      dependencies: sessionStorageDependencies
        ? JSON.parse(sessionStorageDependencies)
        : [],
    };
  };

  const getRelevantResources = (
    selectedMatId: string,
    dependencies: DependencyDto[],
    mats: MaterializationDto[],
    cols: ColumnDto[],
    dashboards: DashboardDto[]
  ): {
    dependencies: DependencyDto[];
    mats: MaterializationDto[];
    cols: ColumnDto[];
    dashboards: DashboardDto[];
  } => {
    const relevantDependencies = dependencies.filter(
      (d) => d.headId === selectedMatId || d.tailId === selectedMatId
    );

    const dependentMats = mats.filter((m) =>
      relevantDependencies.some(
        (d) =>
          m.id !== selectedMatId && (d.headId === m.id || d.tailId === m.id)
      )
    );

    const dependentDashboards = dashboards.filter((dashboard) =>
      relevantDependencies.some(
        (d) =>
          (dashboard.id !== selectedMatId && d.headId === dashboard.id) ||
          d.tailId === dashboard.id
      )
    );

    const dependentCols = cols.filter((col) =>
      dependentMats.some((m) => m.id === col.materializationId)
    );

    return {
      dependencies: relevantDependencies,
      cols: dependentCols,
      mats: dependentMats,
      dashboards: dependentDashboards,
    };
  };

  const defineSourceData = (
    selectedMat: MaterializationDto,
    dependencies: DependencyDto[],
    mats: MaterializationDto[],
    cols: ColumnDto[],
    dashboards: DashboardDto[]
  ): void => {
    const selectedCols = cols.filter(
      (c) => c.materializationId === selectedMat.id
    );

    const relevantResources = getRelevantResources(
      selectedMat.id,
      dependencies,
      mats,
      cols,
      dashboards
    );

    setSourceData({
      cols: selectedCols,
      dashboards,
      mats,
    });

    setGraphSourceData({
      cols: selectedCols.concat(relevantResources.cols),
      dashboards: relevantResources.dashboards,
      mats: [selectedMat, ...relevantResources.mats],
      dependencies: relevantResources.dependencies,
      selectedEl: {
        id: selectedMat.id,
        type: 'combo',
      },
    });
  };

  const sideNavClickCallback = async (
    selectedEl: SelectedElement,
    comboId?: string
  ): Promise<void> => {
    if (!sourceData) throw new Error('Source data not found');
    if (!sourceData) throw new Error('Graph source data not found');
    if (selectedEl.type === 'node' && !comboId)
      throw new Error('Error: Node selected but no combo id provided');

    const sessionStorageData = getSessionStorageData();
    if (!sessionStorageData || !sessionStorageData.mats.length)
      throw new Error('Session storage data not found');

    if (selectedEl.type !== 'combo' && !comboId)
      throw new Error('Combo id for selecte column missing');

    const selectedMat = comboId
      ? sessionStorageData.mats.find((el) => el.id === comboId)
      : sessionStorageData.mats.find((el) => el.id === selectedEl.id);

    if (!selectedMat) throw new Error('Selected materialization not found');

    defineSourceData(
      selectedMat,
      sessionStorageData.dependencies,
      sessionStorageData.mats,
      sessionStorageData.cols,
      sessionStorageData.dashboards
    );
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
    setShowIntegrationSidePanel(false);

    const panel = document.getElementById('integrationsSidePanel');
    if (!panel) throw new ReferenceError('Integrations panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  };

  const openIntegrationSidePanel = (tabIndex: number) => {
    setIntegrationSidePanelTabIndex(tabIndex);
    setShowIntegrationSidePanel(true);

    const panel = document.getElementById('integrationsSidePanel');
    if (!panel) throw new ReferenceError('Integrations Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  };

  useEffect(() => {
    if (user) return;

    Auth.currentAuthenticatedUser()
      .then((cognitoUser) => setUser(cognitoUser))
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);

        Auth.federatedSignIn();
      });
  }, []);

  const createIntegrationTabs = () => {
    setIntegrations([
      ...[
        {
          name: 'Snowflake',
          icon: SiSnowflake,
          tabContentJsx: (
            <Snowflake
              jwt={''}
              parentHandleSaveClick={() => setSnackbarOpen(true)}
            ></Snowflake>
          ),
        },
        {
          name: 'GitHub',
          icon: FaGithub,
          tabContentJsx: <Github organizationId={''} jwt={''}></Github>,
        },
        {
          name: 'Slack',
          icon: FaSlack,
          tabContentJsx: <Slack organizationId={''} jwt={''}></Slack>,
        },
      ],
    ]);
  };

  useEffect(() => {
    const sessionStorageData = getSessionStorageData();

    if (!appConfig.react.showRealData) {
      const selectedMat: MaterializationDto = defaultMaterializations[0];

      defineSourceData(
        selectedMat,
        defaultDependencies,
        defaultMaterializations,
        defaultColumns,
        []
      );

      sessionStorage.setItem(
        'dependencies',
        JSON.stringify(defaultDependencies)
      );
      sessionStorage.setItem('mats', JSON.stringify(defaultMaterializations));
      sessionStorage.setItem('dashboards', JSON.stringify([]));
      sessionStorage.setItem('cols', JSON.stringify(defaultColumns));
    } else if (sessionStorageData && sessionStorageData.mats.length) {
      const selectedMat: MaterializationDto = sessionStorageData.mats[0];

      defineSourceData(
        selectedMat,
        sessionStorageData.dependencies,
        sessionStorageData.mats,
        sessionStorageData.cols,
        sessionStorageData.dashboards
      );
    }

    setIsLoading(false);
  }, [lineage]);

  useEffect(() => {
    if (lineage) return;

    toggleShowSideNav();
    createIntegrationTabs();

    const lineageDto = {
      id: 'todo',
      createdAt: '',
      completed: true,
      dbCoveredNames: [],
      diff: '',
    };

    sessionStorage.clear();
    sessionStorage.setItem('lineage', JSON.stringify(lineageDto));

    setLineage(lineageDto);
  }, [user]);

  useEffect(() => {
    if (!showIntegrationSidePanel) return;

    closeColSidePanel();
    closeMatSidePanel();
  }, [showIntegrationSidePanel]);

  useEffect(() => {
    const testHistoryEntries = defaultTestHistory(selectedNodeId);
    setSelectionTests(testHistoryEntries);
  }, [selectedNodeId]);

  useEffect(() => {
    if (!sql) return;

    const panel = document.getElementById('materializationSidePanel');
    if (!panel) throw new ReferenceError('SQL Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  }, [sql]);

  const graphBuiltCallback = () => {
    // const targetResourceId = searchParams.get('targetResourceId');
    // if (targetResourceId)
    //   simulateSideNavClick({ id: targetResourceId, type: 'node' });
  };

  const getHistoryMinMax = (
    historyDataSet: HistoryDataSet[]
  ): [number, number] =>
    historyDataSet.reduce<[number, number]>(
      (acc, curr) => {
        const localAcc = acc;

        if (curr.value < localAcc[0]) localAcc[0] = curr.value;
        if (curr.value > localAcc[1]) localAcc[1] = curr.value;

        return localAcc;
      },
      [historyDataSet[0].value, historyDataSet[0].value]
    );

  return (
    <ThemeProvider theme={theme}>
      <div id="lineageContainer">
        <Navbar
          current="lineage"
          toggleLeftPanel={toggleShowSideNav}
          toggleRightPanelFunctions={{
            open: () => openIntegrationSidePanel(0),
            close: closeIntegrationSidePanel,
          }}
          isRightPanelShown={isRightPanelShown}
          setIsRightPanelShown={setIsRightPanelShown}
          jwt={''}
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
          graphSourceData={graphSourceData}
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
              onClick={closeMatSidePanel}
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
                              getDefaultYAxis(
                                ...getHistoryMinMax(entry.historyDataSet)
                              ),
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
                      <i>
                        Last Modified:{' '}
                        {
                          lastModifiedInfos[
                            Math.floor(Math.random() * lastModifiedInfos.length)
                          ]
                        }
                      </i>
                      <ModelVisualizer sql={sql} />
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
                              getDefaultYAxis(
                                ...getHistoryMinMax(entry.historyDataSet)
                              ),
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
          <IntegrationTabs
            integrations={integrations}
            selectedTabIndex={integrationSidePanelTabIndex}
          />
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
