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
  getDefaultYAxis,
  HistoryDataSet,
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
import Github from '../../components/integration/github/github';
import Slack from '../../components/integration/slack/slack';
import Snowflake from '../../components/integration/snowflake/snowflake';
import AccountDto from '../../infrastructure/account-api/account-dto';
import {
  deafultErrorDashboards,
  defaultErrorColumns,
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
  GraphSourceData,
  SelectedElement,
  SourceData,
} from './components/lineage-graph';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import IntegrationTabs from './components/integration-tabs';
import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import DependencyDto from '../../infrastructure/lineage-api/dependencies/dependency-dto';
import DependenciesApiRepository from '../../infrastructure/lineage-api/dependencies/dependencies-api-repository';
import ObservabilityApiRepo from '../../infrastructure/observability-api/observability-api-repo';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface BaseDependencyCapture {
  dependencies: DependencyDto[];
  mats: MaterializationDto[];
  cols: ColumnDto[];
}

type UpstreamDepencencyCapture = BaseDependencyCapture;

interface FullDependencyCapture extends BaseDependencyCapture {
  dashboards: DashboardDto[];
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

  const [sql, setSQL] = useState('');
  const [selectionTests, setSelectionTests] = useState<TestHistoryEntry[]>([]);
  const [selectionAlertHistory, setSelectionAlertHistory] = useState<
    AlertHistoryEntry[]
  >([]);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(true);
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

  const [mats, setMats] = useState<MaterializationDto[]>();
  const [cols, setCols] = useState<ColumnDto[]>();
  const [dependencies, setDependencies] = useState<DependencyDto[]>();
  const [dashboards, setDashboards] = useState<DashboardDto[]>();

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

  const showIntegrationPanelCallback = (show: boolean) =>
    setShowIntegrationSidePanel(show);

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

  const exploreDownstreamDependencies = (
    selectedMatId: string
  ): FullDependencyCapture => {
    if (!dependencies || !mats || !cols || !dashboards)
      throw new Error(
        'Cannot search for relevant resources. No data available'
      );

    const downstreamEdges = dependencies.filter(
      (d) => d.tailId === selectedMatId
    );

    const referencingMats = mats.filter((m) =>
      downstreamEdges.some((d) => m.id !== selectedMatId && d.headId === m.id)
    );

    const downstreamMatDependencies = referencingMats.reduce(
      (acc: FullDependencyCapture, el: MaterializationDto) => {
        const localAcc = acc;

        const downstreamDependencies = exploreDownstreamDependencies(el.id);

        const newMats = downstreamDependencies.mats.filter(
          (m) => !localAcc.mats.some((m2) => m2.id === m.id)
        );
        const newDashboards = downstreamDependencies.dashboards.filter(
          (d) => !localAcc.dashboards.some((d2) => d2.id === d.id)
        );
        const newCols = downstreamDependencies.cols.filter(
          (c) => !localAcc.cols.some((c2) => c2.id === c.id)
        );

        return {
          dependencies: localAcc.dependencies.concat(
            downstreamDependencies.dependencies
          ),
          mats: localAcc.mats.concat(newMats),
          cols: localAcc.cols.concat(newCols),
          dashboards: localAcc.dashboards.concat(newDashboards),
        };
      },
      { dependencies: [], mats: [], cols: [], dashboards: [] }
    );

    const referencingDashboards = dashboards.filter((dashboard) =>
      downstreamEdges.some(
        (d) => dashboard.id !== selectedMatId && d.headId === dashboard.id
      )
    );

    const downstreamCols = cols.filter((col) =>
      referencingMats.some((m) => m.id === col.materializationId)
    );

    return {
      dependencies: downstreamEdges.concat(
        downstreamMatDependencies.dependencies
      ),
      mats: referencingMats.concat(downstreamMatDependencies.mats),
      cols: downstreamCols.concat(downstreamMatDependencies.cols),
      dashboards: referencingDashboards,
    };
  };

  const exploreUpstreamDependencies = (
    selectedMatId: string
  ): UpstreamDepencencyCapture => {
    if (!dependencies || !mats || !cols || !dashboards)
      throw new Error(
        'Cannot search for relevant resources. No data available'
      );

    const upstreamEdges = dependencies.filter(
      (d) => d.headId === selectedMatId
    );

    const referencedMats = mats.filter((m) =>
      upstreamEdges.some((d) => m.id !== selectedMatId && d.tailId === m.id)
    );

    const upstreamMatDependencies = referencedMats.reduce(
      (acc: UpstreamDepencencyCapture, el: MaterializationDto) => {
        const localAcc = acc;

        const downstreamDependencies = exploreUpstreamDependencies(el.id);

        const newMats = downstreamDependencies.mats.filter(
          (m) => !localAcc.mats.some((m2) => m2.id === m.id)
        );
        const newCols = downstreamDependencies.cols.filter(
          (c) => !localAcc.cols.some((c2) => c2.id === c.id)
        );

        return {
          dependencies: localAcc.dependencies.concat(
            downstreamDependencies.dependencies
          ),
          mats: localAcc.mats.concat(newMats),
          cols: localAcc.cols.concat(newCols),
        };
      },
      { dependencies: [], mats: [], cols: [] }
    );

    const upstreamCols = cols.filter((col) =>
      referencedMats.some((m) => m.id === col.materializationId)
    );

    return {
      dependencies: upstreamEdges.concat(upstreamMatDependencies.dependencies),
      mats: referencedMats.concat(upstreamMatDependencies.mats),
      cols: upstreamCols.concat(upstreamMatDependencies.cols),
    };
  };

  const getConnectedResources = (
    selectedMatId: string
  ): FullDependencyCapture => {
    if (!dependencies || !mats || !cols || !dashboards)
      throw new Error(
        'Cannot search for relevant resources. No data available'
      );

    const downstreamResources = exploreDownstreamDependencies(selectedMatId);
    const upstreamResources = exploreUpstreamDependencies(selectedMatId);

    return {
      mats: downstreamResources.mats.concat(upstreamResources.mats),
      cols: downstreamResources.cols.concat(upstreamResources.cols),
      dependencies: downstreamResources.dependencies.concat(
        upstreamResources.dependencies
      ),
      dashboards: downstreamResources.dashboards,
    };
  };

  const defineSourceData = (selectedEl: SelectedElement): void => {
    if (!mats || !cols || !dashboards || !dependencies)
      throw new Error('No data available');

    const comboId =
      selectedEl.type === 'combo' ? selectedEl.id : selectedEl.comboId;

    const selectedCombo = [...dashboards, ...mats].find(
      (el) => el.id === comboId
    );

    if (!selectedCombo) throw new Error('No selected materialization');

    const localSelectedCombo = selectedCombo;
    const selectedMatCols = cols.filter(
      (c) => c.materializationId === localSelectedCombo.id
    );

    const relevantResources = getConnectedResources(selectedCombo.id);

    setSourceData({
      cols: selectedMatCols,
      dashboards,
      mats,
    });

    const isDashb = (obj: { id: string }): obj is DashboardDto =>
      'url' in obj && 'name' in obj && 'id' in obj;

    const graphDashbs = [...relevantResources.dashboards];
    if (isDashb(selectedCombo)) graphDashbs.push(selectedCombo);
    const isMat = (obj: { id: string }): obj is MaterializationDto =>
      'relationName' in obj &&
      'name' in obj &&
      'schemaName' in obj &&
      'databaseName' in obj &&
      'type' in obj;
    const graphMats = [...relevantResources.mats];
    if (isMat(selectedCombo)) graphMats.push(selectedCombo);

    setGraphSourceData({
      cols: selectedMatCols.concat(relevantResources.cols),
      dashboards: graphDashbs,
      mats: graphMats,
      dependencies: relevantResources.dependencies,
      selectedEl,
    });
  };

  const comboSelectCallback = async (comboId: string, logicId?: string) => {
    setSelectedNodeId(comboId);

    if (!logicId) return;

    if (appConfig.react.showRealData) {
      const logicDto = await LogicApiRepository.getOne(logicId);

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

  const comboSelectChangeCallback = async (comboId: string) => {
    defineSourceData({ id: comboId, type: 'combo' });
  };

  const sideNavClickCallback = async (
    selectedEl: SelectedElement
  ): Promise<void> => {
    if (!sourceData) throw new Error('Source data not found');
    if (!sourceData) throw new Error('Graph source data not found');
    if (selectedEl.type === 'node' && !selectedEl.comboId)
      throw new Error('Error: Node selected but no combo id provided');

    defineSourceData(selectedEl);
  };

  const simulateSideNavClick = async (
    selectedEl: SelectedElement
  ): Promise<void> => {
    await sideNavClickCallback(selectedEl);
  };

  const renderLineage = () => {
    setUser(undefined);
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
    AccountApiRepository.getBy(new URLSearchParams({}))
      .then((accounts) => {
        if (!accounts.length) throw new Error(`No accounts found for user`);

        if (accounts.length > 1)
          throw new Error(`Multiple accounts found for user`);

        setAccount(accounts[0]);
      })
      .catch((error) => {
        console.trace(typeof error === 'string' ? error : error.message);
        caches.delete('lineage');
        sessionStorage.clear();

        Auth.signOut();
      });
  }, [user]);

  const handleRedirect = () => {
    const state = location.state;

    if (!state) return;
    if (typeof state !== 'object')
      throw new Error('Unexpected navigation state type');

    const { sidePanelTabIndex: localSidePanelTabIndexChange } = state as any;

    if (localSidePanelTabIndexChange !== undefined)
      openIntegrationSidePanel(localSidePanelTabIndexChange);

    window.history.replaceState({}, document.title);
  };

  const createIntegrationTabs = async () => {
    if (!account) throw new Error('No user authorization found');

    setIntegrations([
      ...[
        {
          name: 'Snowflake',
          icon: SiSnowflake,
          tabContentJsx: (
            <Snowflake
              parentHandleSaveClick={() => setSnackbarOpen(true)}
            ></Snowflake>
          ),
        },
        {
          name: 'GitHub',
          icon: FaGithub,
          tabContentJsx: (
            <Github organizationId={account.organizationId}></Github>
          ),
        },
        {
          name: 'Slack',
          icon: FaSlack,
          tabContentJsx: (
            <Slack organizationId={account.organizationId}></Slack>
          ),
        },
      ],
    ]);
  };

  useEffect(() => {
    if (!cols) return;

    if (cols.length) {
      if (!mats || !mats.length || !dashboards)
        throw new Error('No materializations found');
      defineSourceData({ id: mats[0].id, type: 'combo' });
    } else {
      setSourceData({
        cols: [],
        dashboards: dashboards || [],
        mats: mats || [],
      });

      setIsDataAvailable(false);
    }
  }, [cols]);

  const loadData = async () => {
    try {
      const matDtos = await MaterializationsApiRepository.getBy(
        new URLSearchParams({})
      );

      setMats(matDtos);
      const dependencyDtos = await DependenciesApiRepository.getBy(
        new URLSearchParams({})
      );

      setDependencies(dependencyDtos);

      const dashboardDtos = await DashboardsApiRepository.getBy(
        new URLSearchParams({})
      );

      setDashboards(dashboardDtos);

      const colDtos = matDtos.length
        ? await ColumnsApiRepository.getBy(new URLSearchParams({}))
        : [];
      setCols(colDtos);
    } catch (error) {
      console.log(error);

      setLineage(defaultErrorLineage);
      setSourceData({
        cols: defaultErrorColumns,
        dashboards: deafultErrorDashboards,
        mats: defaultErrorMaterializations,
      });
      setGraphSourceData({
        cols: [],
        dashboards: [],
        dependencies: [],
        mats: [],
      });

      setIsDataAvailable(false);
    }
    // }

    handleRedirect();
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [lineage]);

  const loadLineage = async () => {
    try {
      const latestLineage = await LineageApiRepository.getLatest(false);

      if (!latestLineage)
        throw new TypeError('Queried lineage object not found');

      const sessionStorageLineageStr = sessionStorage.getItem('lineage');
      const sessionStorageLineage: LineageDto | undefined =
        sessionStorageLineageStr
          ? JSON.parse(sessionStorageLineageStr)
          : undefined;

      if (
        sessionStorageLineage &&
        sessionStorageLineage.createdAt === latestLineage.createdAt
      )
        setLineage(sessionStorageLineage);
      else {
        setLineage(latestLineage);
        sessionStorage.clear();
        await caches.delete('lineage');
      }

      if (!sessionStorage.getItem('lineage'))
        sessionStorage.setItem('lineage', JSON.stringify(latestLineage));
    } catch (error) {
      console.log(error);
      sessionStorage.clear();
      caches.delete('lineage');

      setLineage(defaultErrorLineage);
      setSourceData({
        cols: defaultErrorColumns,
        dashboards: deafultErrorDashboards,
        mats: defaultErrorMaterializations,
      });

      setIsDataAvailable(false);
    }
  };

  useEffect(() => {
    if (!account || lineage) return;

    toggleShowSideNav();
    createIntegrationTabs().then(() => {});

    if (appConfig.react.showRealData) loadLineage();
    else {
      setLineage({
        id: 'todo',
        createdAt: '',
        creationState: 'completed',
        dbCoveredNames: [],
        diff: '',
      });
    }
  }, [account]);

  useEffect(() => {
    if (!showIntegrationSidePanel || !account) return;

    closeColSidePanel();
    closeMatSidePanel();
  }, [showIntegrationSidePanel]);

  useEffect(() => {
    if (!account) return;

    const testHistory: { [testSuiteId: string]: TestHistoryEntry } = {};
    ObservabilityApiRepo.getTestSuiteData(selectedNodeId, true)
      .then((results) => {
        const reps = results.map(
          (el: any): { id: string; type: string } => ({
            id: el.id,
            type: el.test_type,
          })
        );

        return ObservabilityApiRepo.getSelectionTestHistories(
          reps,
        );
      })
      .then((selectionTestHistories) => {
        setSelectionTests(selectionTestHistories);
        selectionTestHistories.forEach((el) => testHistory[el.testSuiteId] = el);
        const ids = Object.values(testHistory).map((el) => el.testSuiteId);

        return ObservabilityApiRepo.getAlertData(ids);
      })
      .then((alertHistoryResults) => {

        const testSuiteRepresentations = Object.values(testHistory);

        const alertHistoryEntries: AlertHistoryEntry[] = alertHistoryResults.map(
          (el: { [key: string]: unknown }): AlertHistoryEntry => {
            const {
              test_suite_id: testSuiteId,
              deviation,
              executed_on: executedOn,
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
      simulateSideNavClick({ id: targetResourceId, type: 'combo' });
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
          comboSelectChangeCallback={comboSelectChangeCallback}
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
                                getHistoryMinMax(entry.historyDataSet),
                                true,
                                true
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
                              getDefaultYAxis(
                                getHistoryMinMax(entry.historyDataSet),
                                true,
                                true
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
