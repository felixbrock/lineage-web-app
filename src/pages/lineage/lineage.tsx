import React, { ReactElement, useEffect, useState } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import TableChartIcon from '@mui/icons-material/TableChart';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../../components/top-nav/cito-header.png';
import { FaGithub, FaSlack } from 'react-icons/fa';
import { SiLooker, SiSnowflake } from 'react-icons/si';
import G6, {
  ComboConfig,
  EdgeConfig,
  Graph,
  GraphData,
  ICombo,
  IEdge,
  INode,
  NodeConfig,
} from '@antv/g6';
import './lineage.scss';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MdMenu, MdChevronRight, MdExpandMore, MdTag } from 'react-icons/md';
import MetricsGraph, {
  defaultDistributionData,
  defaultFreshnessData,
  defaultNullnessData,
  defaultOption,
  defaultYAxis,
  defaultYAxisTime,
  effectiveRateSampleDistributionData,
  effectiveRateSampleFreshnessData,
  effectiveRateSampleNullnessData,
} from '../../components/metrics-graph';

import Integration from '../../components/integration/integration';
import LineageApiRepository from '../../infrastructure/lineage-api/lineage/lineage-api-repository';
import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
import DependenciesApiRepository from '../../infrastructure/lineage-api/dependencies/dependencies-api-repository';
import LineageDto from '../../infrastructure/lineage-api/lineage/lineage-dto';
import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
import DependencyDto from '../../infrastructure/lineage-api/dependencies/dependency-dto';
import LogicApiRepository from '../../infrastructure/lineage-api/logics/logics-api-repository';
import {
  defaultData,
  defaultLogics,
  defaultMaterializations,
  defaultAnomalyStates,
} from './test-data';

import TreeView from '@mui/lab/TreeView';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import BasicCard from '../../components/card';
import BasicTable from '../../components/table';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import DashboardDto from '../../infrastructure/lineage-api/dashboards/dashboard-dto';
import DashboardsApiRepository from '../../infrastructure/lineage-api/dashboards/dashboards-api-repository';
import Box from '@mui/material/Box';

const showRealData = false;
const lineageId = '62e7b2bcaa9205236c323795';

// 62e79c2cd6fc4eb07b664eb5';

// 62e2a8e9aef38b28f49d9c8f
// '62e25e01b611c320fffbecc2';

enum DataLoadNodeType {
  Self = 'SELF',
  Parent = 'PARENT',
  Child = 'CHILD',
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

const getNodeIdsToExplore = (
  edgesToExplore: EdgeConfig[],
  coveredNodeIds: string[]
) => {
  const isString = (item: string | undefined): item is string => !!item;

  let nodeIdsToExplore: string[] = edgesToExplore
    .map((edge) => [edge.source, edge.target])
    .flat()
    .filter(isString);
  nodeIdsToExplore = [...Array.from(new Set(nodeIdsToExplore))];
  nodeIdsToExplore = nodeIdsToExplore.filter(
    (id) => !coveredNodeIds.includes(id)
  );

  return nodeIdsToExplore;
};

/* Loads a specific combo when selected from navigation */
const loadCombo = (comboId: string, data: GraphData): GraphData => {
  if (!data.nodes) return data;
  const dataNodes = data.nodes;

  if (!data.combos) return data;
  const dataCombos = data.combos;

  const selfCombo = dataCombos.find((element) => element.id === comboId);
  if (!selfCombo) throw new ReferenceError('Node not found');

  const selfNodes = dataNodes.filter((node) => node.comboId === comboId);

  return {
    nodes: selfNodes,
    edges: [],
    combos: [selfCombo],
  };
};

/* Compares two nodes based on label. Used for sorting functions */
const compare = (first: any, second: any) => {
  if (first.label < second.label) {
    return -1;
  }
  if (first.label > second.label) {
    return 1;
  }
  return 0;
};

/* Returns a  subset of existing data for a selected node */
const loadData = (
  nodeId: string,
  nodeType: DataLoadNodeType,
  coveredNodeIds: string[],
  coveredComboIds: string[],
  data: GraphData
): GraphData => {
  const localCoveredNodeIds = coveredNodeIds;
  const localCoveredComboIds = coveredComboIds;

  if (!data.nodes) return data;
  const dataNodes = data.nodes;

  if (!data.edges) return data;
  const dataEdges = data.edges;

  if (!data.combos) return data;
  const dataCombos = data.combos;

  const selfNode = dataNodes.find((element) => element.id === nodeId);
  if (!selfNode) throw new ReferenceError('Node not found');

  const graphData: GraphData = { nodes: [], edges: [], combos: [] };

  if (!graphData.nodes) throw new ReferenceError('Nodes not available');
  graphData.nodes.push(selfNode);

  localCoveredNodeIds.push(nodeId);

  if (selfNode.comboId && !localCoveredComboIds.includes(selfNode.comboId)) {
    const selfCombo = dataCombos.find(
      (element) => element.id === selfNode.comboId
    );
    if (!selfCombo) return data;

    if (!graphData.combos) throw new ReferenceError('Combos not available');
    graphData.combos.push(selfCombo);

    localCoveredComboIds.push(selfNode.comboId);
  }

  if (!graphData.edges) throw new ReferenceError('Edges not available');

  const isGraphData = (item: GraphData | undefined): item is GraphData =>
    !!item;

  if (
    nodeType === DataLoadNodeType.Parent ||
    nodeType === DataLoadNodeType.Self
  ) {
    const selfParentEdges = dataEdges.filter((edge) => edge.target === nodeId);

    graphData.edges.push(...selfParentEdges);

    const nodeIdsToExplore = getNodeIdsToExplore(
      selfParentEdges,
      localCoveredNodeIds
    );

    const dataSubsets = nodeIdsToExplore
      .map((id) =>
        loadData(
          id,
          DataLoadNodeType.Parent,
          localCoveredNodeIds,
          localCoveredComboIds,
          data
        )
      )
      .filter(isGraphData);

    dataSubsets.forEach((subset) => {
      if (subset.nodes && graphData.nodes)
        graphData.nodes.push(...subset.nodes);
      if (subset.edges && graphData.edges)
        graphData.edges.push(...subset.edges);
      if (subset.combos && graphData.combos)
        graphData.combos.push(...subset.combos);
    });
  }

  if (
    nodeType === DataLoadNodeType.Child ||
    nodeType === DataLoadNodeType.Self
  ) {
    const selfChildEdges = dataEdges.filter((edge) => edge.source === nodeId);

    graphData.edges.push(...selfChildEdges);

    const nodeIdsToExplore = getNodeIdsToExplore(
      selfChildEdges,
      localCoveredNodeIds
    );

    const dataSubsets = nodeIdsToExplore
      .map((id) =>
        loadData(
          id,
          DataLoadNodeType.Child,
          localCoveredNodeIds,
          localCoveredComboIds,
          data
        )
      )
      .filter(isGraphData);

    dataSubsets.forEach((subset) => {
      if (subset.nodes && graphData.nodes)
        graphData.nodes.push(...subset.nodes);
      if (subset.edges && graphData.edges)
        graphData.edges.push(...subset.edges);
      if (subset.combos && graphData.combos)
        graphData.combos.push(...subset.combos);
    });
  }

  const selfNodes = dataNodes.filter(
    (node) => node.comboId === selfNode.comboId
  );

  graphData.nodes.push(...selfNodes);

  const cleanedNodes = graphData.nodes.filter(
    (node, index, self) =>
      index === self.findIndex((element) => element.id === node.id)
  );

  graphData.nodes = cleanedNodes;

  graphData.nodes.sort(compare);
  if (graphData.combos) graphData.combos.sort(compare);

  /* For rendering column level lineage only */
  graphData.nodes = graphData.nodes.filter((node) =>
    coveredNodeIds.includes(node.id)
  );

  return graphData;
};

const getDependentEdges = (node: INode, isUpstream: boolean): IEdge[] => {
  const dependentEdges: IEdge[] = [];

  if (isUpstream) {
    node.getInEdges().forEach((edge) => {
      const source = edge.getSource();

      if (source) dependentEdges.push(...getDependentEdges(source, true));

      dependentEdges.push(edge);
    });
  } else {
    node.getOutEdges().forEach((edge) => {
      const target = edge.getTarget();

      if (target) dependentEdges.push(...getDependentEdges(target, false));

      dependentEdges.push(edge);
    });
  }

  return dependentEdges;
};

/**
 * format the string
 * @param {string} string The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (
  string: string | undefined,
  maxWidth: number,
  fontSize: number
): string => {
  if (!string) return '';
  let currentWidth = 0;
  let result = string;
  string.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) return '';

    currentWidth += G6.Util.getLetterWidth(letter, fontSize);

    if (currentWidth > maxWidth) {
      result = `${string.substring(0, i)}\n${fittingString(
        string.substring(i),
        maxWidth,
        fontSize
      )}`;
    }
  });
  return result;
};

const buildData = (
  materializations: MaterializationDto[],
  columns: ColumnDto[],
  dependencies: DependencyDto[],
  dashboards: DashboardDto[]
): GraphData => {
  const matCombo = materializations.map(
    (materialization): ComboConfig => ({
      id: materialization.id,
      label: materialization.name.toLowerCase(),
    })
  );
  const colNodes = columns.map(
    (column): NodeConfig => ({
      id: column.id,
      label: column.name.toLowerCase(),
      comboId: column.materializationId,
    })
  );
  const edges = dependencies.map(
    (dependency): EdgeConfig => ({
      source: dependency.tailId,
      target: dependency.headId,
    })
  );

  const dashCombo = dashboards.map(
    (dashboard): ComboConfig => ({
      id: dashboard.url ? dashboard.url : '',
      label: dashboard.name
        ? dashboard.name
        : fittingString(dashboard.url, 385, 18),
    })
  );
  const dashNodes = dashboards.map(
    (dashboard): NodeConfig => ({
      id: dashboard.id,
      label: dashboard.column.toLowerCase(),
      comboId: dashboard.url,
    })
  );
  const combos = matCombo.concat(dashCombo).sort(compare);
  const nodes = colNodes.concat(dashNodes).sort(compare);

  return { combos, nodes, edges };
};

type TreeViewElementType = 'node' | 'combo';

const determineType = (id: string, data: GraphData): TreeViewElementType => {
  if (!data.combos)
    throw new ReferenceError('Data object is empty. Type cannot be identified');
  const isCombo = data.combos.filter((element) => element.id === id).length > 0;

  if (isCombo) return 'combo';
  else return 'node';
};

export default (): ReactElement => {
  const navigate = useNavigate();

  const [accountId, setAccountId] = useState('');
  const [user, setUser] = useState<any>();
  const [jwt, setJwt] = useState('');

  const [graph, setGraph] = useState<Graph>();
  const [sql, setSQL] = useState('');
  const [columnTest, setColumnTest] = useState('');
  // const [info, setInfo] = useState('');
  const [lineage, setLineage] = useState<LineageDto>();
  const [materializations, setMaterializations] = useState<
    MaterializationDto[]
  >([]);
  const [columns, setColumns] = useState<ColumnDto[]>([]);
  const [dependencies, setDependencies] = useState<DependencyDto[]>([]);
  const [dashboards, setDashboards] = useState<DashboardDto[]>([]);
  const [data, setData] = useState<GraphData>();
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [expandedTreeViewElementIds, setExpandedTreeViewElementIds] = useState<
    string[]
  >([]);
  const [allTreeViewElements, setAllTreeViewElements] = useState<
    ReactElement[]
  >([]);
  const [filteredTreeViewElements, setFilteredTreeViewElements] = useState<
    ReactElement[]
  >([]);
  const [searchedTreeViewElements, setSearchedTreeViewElements] = useState<
    ReactElement[]
  >([]);
  const [treeViewElements, setTreeViewElements] = useState<ReactElement[]>([]);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [anomalyFilterOn, setAnomalyFilterOn] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [showIntegrationSidePanel, setShowIntegrationSidePanel] =
    useState<boolean>();

  const handleTabIndexChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabIndex(newValue);
  };

  const handleSelect = (event: React.SyntheticEvent, nodeIds: string) => {
    if (!data) return;
    if (!graph) return;
    if (!nodeIds) return;

    const id = nodeIds;

    const selectedNodes = graph.findAllByState('node', 'selected');
    selectedNodes.forEach((node) => node.clearStates());

    const selectedCombos = graph.findAllByState('combo', 'selected');
    selectedCombos.forEach((combo) => combo.clearStates());

    const type = determineType(id, data);

    if (type === 'combo') graph.data(loadCombo(id, data));
    else if (type === 'node')
      graph.data(loadData(id, DataLoadNodeType.Self, [], [], data));

    graph.render();

    const target = graph.findById(id);

    graph.setItemState(target, 'selected', true);

    graph.emit('nodeselectchange', {
      select: true,
      target,
    });
  };

  const toggleSideNavTreeView = (
    event: React.SyntheticEvent,
    nodeIds: string[]
  ) => setExpandedTreeViewElementIds(nodeIds);

  const handleShowAll = () => {
    if (!data) return;
    if (!graph) return;

    graph.data(data);

    graph.render();
  };

  const handleFilterAnomalies = () => {
    if (!allTreeViewElements) return;

    if (anomalyFilterOn) {
      setFilteredTreeViewElements([]);
      setTreeViewElements(
        searchedTreeViewElements.length
          ? searchedTreeViewElements
          : allTreeViewElements
      );
      setAnomalyFilterOn(!anomalyFilterOn);
      return;
    }

    const isReactElement = (element: any): element is ReactElement => !!element;

    const newTreeViewElements = treeViewElements
      .map((element: ReactElement) => {
        if (element.props.sx.color !== 'black') return element;

        const relevantChildren = element.props.children
          .map((child: ReactElement) => {
            if (child.props.sx.color !== 'black') return child;
            return null;
          })
          .filter(isReactElement);

        if (!relevantChildren.length) return null;

        return (
          <TreeItem
            nodeId={element.props.nodeId}
            label={element.props.label}
            sx={element.props.sx}
          >
            {relevantChildren}
          </TreeItem>
        );
      })
      .filter(isReactElement);

    setFilteredTreeViewElements(newTreeViewElements);

    setAnomalyFilterOn(!anomalyFilterOn);
  };

  const handleSearchChange = (event: any) => {
    if (!allTreeViewElements) return;

    const value = event.target.value;
    if (!value) {
      setSearchedTreeViewElements([]);
      setTreeViewElements(allTreeViewElements);
      return;
    }

    const isReactElement = (element: any): element is ReactElement => !!element;

    const populationToSearch = anomalyFilterOn
      ? filteredTreeViewElements
      : allTreeViewElements;

    const newTreeViewElements = populationToSearch
      .map((element: ReactElement) => {
        if (element.props.label.includes(value)) return element;

        const relevantChildren = element.props.children
          .map((child: ReactElement) => {
            if (child.props.label.includes(value)) return child;
            return null;
          })
          .filter(isReactElement);

        if (!relevantChildren.length) return null;

        return (
          <TreeItem
            nodeId={element.props.nodeId}
            label={element.props.label}
            sx={element.props.sx}
          >
            {relevantChildren}
          </TreeItem>
        );
      })
      .filter(isReactElement);

    setSearchedTreeViewElements(newTreeViewElements);
  };

  const handleTreeViewExpandClick = () => {
    if (!data) return;
    if (!data.combos) return;

    const comboIds = data.combos.map((combo) => combo.id);

    setExpandedTreeViewElementIds((oldExpanded) =>
      oldExpanded.length === 0 ? comboIds : []
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
    setColumnTest('');

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

  // const handleInfo = () => {
  //   const snackbar = document.getElementById('snackbar');
  //   if (!snackbar) throw new ReferenceError('Snackbar element not found');
  //   snackbar.className = 'show';

  //   setTimeout(() => {
  //     snackbar.className = snackbar.className.replace('show', '');
  //     setInfo('');
  //   }, 3000);
  // };

  const buildTreeViewColumn = (
    column: any,
    defaultColor: string,
    anomalyColor: string
  ): ReactElement => {
    let hasNewAnomaly: { id: string; hasNewAnomaly: boolean } | undefined;
    if (!showRealData) {
      hasNewAnomaly = defaultAnomalyStates.find(
        (element) => element.id === column.id
      );
      if (!hasNewAnomaly) throw new ReferenceError('Anomaly state not found');
    }

    return (
      <TreeItem
        nodeId={column.id}
        label={column.label}
        icon={<CircleTwoToneIcon fontSize="small" sx={{ color: '#674BCE' }} />}
        sx={{
          color: hasNewAnomaly?.hasNewAnomaly ? anomalyColor : defaultColor,
        }}
      />
    );
  };

  const buildTreeViewElements = (): ReactElement[] => {
    if (!data) return [<></>];
    if (!data.combos) return [<></>];

    const defaultColor = 'black';
    const anomalyColor = '#db1d33';

    const materializationElements = data.combos.map((combo): ReactElement => {
      if (!data.nodes) return <></>;

      const relevantColumns = data.nodes.filter(
        (node) => node.comboId === combo.id
      );

      const columnElements = relevantColumns.map((column) =>
        buildTreeViewColumn(column, defaultColor, anomalyColor)
      );

      const hasAnomalyChilds = columnElements.some(
        (element) => element.props.sx.color !== defaultColor
      );

      return (
        <TreeItem
          nodeId={combo.id}
          label={combo.label}
          sx={{ color: hasAnomalyChilds ? anomalyColor : defaultColor }}
          endIcon={<MdTag />}
        >
          {columnElements}
        </TreeItem>
      );
    });

    return materializationElements;
  };

  const renderAutomations = () => {
    setUser('todo');
  };

  useEffect(renderAutomations, []);

  useEffect(() => {
    setAccountId('todo');
    setJwt('todo');
  }, [user]);

  useEffect(() => {
    if (!accountId || lineage) return;

    if (!jwt) throw new Error('No user authorization found');

    if (showRealData) {
      LineageApiRepository.getOne(lineageId, 'todo-replace')
        .then((lineageDto) => {
          if (!lineageDto)
            throw new TypeError('Queried lineage object not found');
          setLineage(lineageDto);
          return MaterializationsApiRepository.getBy(
            new URLSearchParams({ lineageId: lineageId }),
            'todo-replace'
          );
        })
        .then((materializationDtos) => {
          setMaterializations(materializationDtos);
          return DashboardsApiRepository.getBy(
            new URLSearchParams({ lineageId: lineageId }),
            'todo-replace'
          );
        })
        .then((dashboardDtos) => {
          setDashboards(dashboardDtos);
          return ColumnsApiRepository.getBy(
            new URLSearchParams({ lineageId: lineageId }),
            'todo-replace'
          );
        })
        .then((columnDtos) => {
          setColumns(columnDtos);
          return DependenciesApiRepository.getBy(
            new URLSearchParams({ lineageId: lineageId }),
            'todo-replace'
          );
        })
        .then((dependencyDtos) => {
          setDependencies(dependencyDtos);
          setReadyToBuild(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setLineage({ id: 'todo', createdAt: 1 });
      setReadyToBuild(true);
    }
  }, [accountId]);

  useEffect(() => {
    if (!showIntegrationSidePanel) return;
    
    closeColSidePanel();
    closeMatSidePanel();

    const panel = document.getElementById('integrationsSidePanel');
    if (!panel) throw new ReferenceError('Integrations Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  }, [showIntegrationSidePanel]);

  useEffect(() => {
    if (!filteredTreeViewElements.length) return;

    setTreeViewElements(filteredTreeViewElements);
  }, [filteredTreeViewElements]);

  useEffect(() => {
    if (!searchedTreeViewElements.length) return;

    setTreeViewElements(searchedTreeViewElements);
  }, [searchedTreeViewElements]);

  // useEffect(() => {
  //   if (!info) return;

  //   handleInfo();
  // }, [info]);

  useEffect(() => {
    if (!readyToBuild) return;

    if (showRealData)
      setData(buildData(materializations, columns, dependencies, dashboards));
    else {
      defaultData.nodes.sort(compare);
      defaultData.nodes.forEach(
        (element) => (element.label = element.label.toLowerCase())
      );

      defaultData.combos.sort(compare);
      defaultData.combos.forEach(
        (element) => (element.label = element.label.toLowerCase())
      );

      setData(defaultData);
    }

    setReadyToBuild(false);
  }, [readyToBuild]);

  useEffect(() => {
    if (!sql) return;

    const panel = document.getElementById('materializationSidePanel');
    if (!panel) throw new ReferenceError('SQL Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  }, [sql]);

  useEffect(() => {
    if (!columnTest) return;

    const panel = document.getElementById('columnSidePanel');
    if (!panel) throw new ReferenceError('Column Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  }, [columnTest]);

  useEffect(() => {
    if (!data) return;

    const elements = buildTreeViewElements();
    setAllTreeViewElements(elements);
    setTreeViewElements(elements);

    const hivediveBlue = '#6f47ef';

    const container = document.getElementById('lineageContainer');
    if (!container) throw new ReferenceError(`Container for graph not found`);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const grid = new G6.Grid();

    const graphObj = new G6.Graph({
      container,
      width,
      height,
      groupByTypes: false,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'click-select'],
      },
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'DL',
        sortByCombo: true,
        controlPoints: true,
        nodesep: 1,
        ranksep: 120,
      },
      defaultNode: {
        // size: [30, 20],
        type: 'rect',
        style: {
          width: 350,
          lineWidth: 1,
          stroke: '#ababab',
          fill: '#fafaff',
          radius: 5,
        },
        labelCfg: {
          style: {
            fontSize: 18,
          },
        },
      },
      nodeStateStyles: {
        selected: {
          stroke: hivediveBlue,
          lineWidth: 1,
          shadowBlur: 5,
        },
        anomalyNodeSelected: {
          stroke: '#db1d33',
          lineWidth: 1,
          shadowBlur: 5,
        },
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        color: '#808080',
        style: {
          endArrow: {
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#ffffff',
          },
          lineWidth: 1,
          radius: 20,
        },
      },
      edgeStateStyles: {
        nodeSelected: {
          stroke: hivediveBlue,
          shadowColor: hivediveBlue,
          shadowBlur: 2,
        },
        anomalyNodeSelected: {
          stroke: '#db1d33',
          shadowColor: '#db1d33',
          shadowBlur: 2,
        },
      },
      defaultCombo: {
        // type: 'cRect',
        type: 'rect',
        padding: [30, 20, 10, 20],
        fixCollapseSize: [80, 10],
        labelCfg: {
          style: {
            fontSize: 18,
          },
        },
      },
      comboStateStyles: {
        selected: {
          stroke: hivediveBlue,
          lineWidth: 1,
          shadowBlur: 5,
        },
      },
      plugins: [grid],
    });

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graphObj.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        graphObj.changeSize(container.scrollWidth, container.scrollHeight);
      };

    graphObj.on('afterlayout', () => {
      graphObj.emit('layout:finish');
    });

    const edgeHasAnomalousAncestor = (
      source: INode | ICombo,
      hasAnomalousAncestor: boolean
    ): boolean => {
      const parentEdges = source.getInEdges();

      parentEdges.forEach((parent) => {
        const parentSource = parent.getSource();

        const parentAnomalyState = defaultAnomalyStates.find(
          (state) => state.id === parentSource.getID()
        );
        if (!parentAnomalyState)
          throw new ReferenceError('Anomaly state not found');

        if (parentAnomalyState.hasNewAnomaly) {
          hasAnomalousAncestor = true;
          return hasAnomalousAncestor;
        }
        return edgeHasAnomalousAncestor(parentSource, hasAnomalousAncestor);
      });

      return hasAnomalousAncestor;
    };

    graphObj.on('layout:finish', () => {
      const selectedElementId = graphObj.get('selectedElementId');

      const isString = (item: unknown): item is string => !!item;

      if (!isString(selectedElementId))
        throw new ReferenceError('Self node id is not of type string');

      const element = graphObj.findById(selectedElementId);

      const isNode = (object: any): object is INode =>
        object && 'getType' in object && object.getType() === 'node';

      const isCombo = (object: any): object is ICombo =>
        object && 'getType' in object && object.getType() === 'combo';

      if (isNode(element)) {
        let anomalyState:
          | {
              id: string;
              hasNewAnomaly: boolean;
            }
          | undefined;
        if (!showRealData) {
          anomalyState = defaultAnomalyStates.find(
            (state) => state.id === selectedElementId
          );
          if (!anomalyState)
            throw new ReferenceError('Anomaly state not found');
        }
        graphObj.setItemState(
          selectedElementId,
          anomalyState?.hasNewAnomaly ? 'anomalyNodeSelected' : 'selected',
          true
        );

        getDependentEdges(element, true).forEach((edge) => {
          let isAnomalous = false;
          const source = edge.getSource();
          const sourceId = source.getID();
          let sourceAnomalyState:
            | {
                id: string;
                hasNewAnomaly: boolean;
              }
            | undefined;
          if (!showRealData) {
            sourceAnomalyState = defaultAnomalyStates.find(
              (state) => state.id === sourceId
            );
            if (!sourceAnomalyState)
              throw new ReferenceError('Anomaly state not found');

            isAnomalous = edgeHasAnomalousAncestor(source, false);
          }

          graphObj.setItemState(
            edge.getID(),
            sourceAnomalyState?.hasNewAnomaly || isAnomalous
              ? 'anomalyNodeSelected'
              : 'nodeSelected',
            true
          );
        });

        getDependentEdges(element, false).forEach((edge) => {
          const isAnomalous = edgeHasAnomalousAncestor(edge.getSource(), false);
          graphObj.setItemState(
            edge.getID(),
            anomalyState?.hasNewAnomaly || isAnomalous
              ? 'anomalyNodeSelected'
              : 'nodeSelected',
            true
          );
        });
      } else if (isCombo(element)) {
        graphObj.setItemState(selectedElementId, 'selected', true);
      }

      const zoom = graphObj.get('latestZoom') || 1;

      graphObj.zoom(zoom);

      graphObj.focusItem(element);
    });

    graphObj.on('nodeselectchange', (event) => {
      const clearStates = () => {
        closeMatSidePanel();
        closeColSidePanel();
        closeIntegrationSidePanel();
        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        const selectedAnomalyEdges = graphObj.findAllByState(
          'edge',
          'anomalyNodeSelected'
        );
        const edges = selectedEdges.concat(selectedAnomalyEdges);
        edges.forEach((edge) => edge.clearStates());
      };

      if (!event.target) clearStates();
      else if (!event.select) clearStates();
      else if (event.target.get('type') === 'node') {
        closeMatSidePanel();
        closeIntegrationSidePanel();
        const isNode = (object: any): object is INode => 'getEdges' in object;

        if (!isNode(event.target))
          throw new ReferenceError('Event item is no node');

        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        const selectedAnomalyEdges = graphObj.findAllByState(
          'edge',
          'anomalyNodeSelected'
        );
        const edges = selectedEdges.concat(selectedAnomalyEdges);
        edges.forEach((edge) => edge.clearStates());
        const id = event.target.getID();

        setSelectedNodeId(id);
        graphObj.data(loadData(id, DataLoadNodeType.Self, [], [], data));

        setColumnTest(Date.now().toString());

        graphObj.set('latestZoom', graphObj.getZoom());
        graphObj.set('selectedElementId', id);

        graphObj.render();
      } else if (event.target.get('type') === 'combo') {
        closeColSidePanel();

        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        const selectedAnomalyEdges = graphObj.findAllByState(
          'edge',
          'anomalyNodeSelected'
        );
        const edges = selectedEdges.concat(selectedAnomalyEdges);
        edges.forEach((edge) => edge.clearStates());

        const comboId = event.target.get('id');

        const materializationsToSearch = showRealData
          ? materializations
          : defaultMaterializations;

        const matCombo = materializationsToSearch.find(
          (materialization) => materialization.id === comboId
        );

        const dashCombo = dashboards.find(
          (dashboard) => dashboard.url === comboId
        );

        const combo = matCombo ? matCombo : dashCombo;

        if (!combo)
          throw new ReferenceError(
            'Materialization object for selected combo not found'
          );

        if (showRealData) {
          if ('logicId' in combo) {
            LogicApiRepository.getOne(combo.logicId, 'todo-replace').then(
              (logicDto) => {
                console.log(logicDto?.sql);

                if (!logicDto)
                  throw new ReferenceError('Not able to retrieve logic object');

                setSQL(logicDto.sql);
              }
            );
          }
        } else {
          const checkedCombo = combo;

          if ('logicId' in checkedCombo && checkedCombo.logicId.length !== 0) {
            const logic = defaultLogics.find(
              (element) => element.id === checkedCombo.logicId
            );

            if (!logic)
              throw new ReferenceError(
                'Logic object for selected combo not found'
              );

            setSQL(logic.sql);
          }
        }

        graphObj.data(loadCombo(comboId, data));
        graphObj.set('latestZoom', graphObj.getZoom());
        graphObj.set('selectedElementId', comboId);

        graphObj.render();
      }
    });

    const defaultNodeId =
      showRealData && data.nodes
        ? data.nodes[0].id
        : '62715f907e3d8066494d409f';

    const initialData = data;

    graphObj.data(initialData);

    graphObj.set('selectedElementId', defaultNodeId);

    graphObj.render();

    setGraph(graphObj);
  }, [data]);

  useEffect(() => {
    if (!graph) return;

    toggleShowSideNav();
  }, [graph]);

  return (
    <ThemeProvider theme={theme}>
      <div id="lineageContainer">
        <div className="navbar">
          <div id="menu-container">
            <button id="menu-button" onClick={toggleShowSideNav}>
              <MdMenu />
            </button>

            <img
              height="40"
              width="150"
              src={Logo}
              alt="logo"
              onClick={() =>
                navigate(`/lineage`, {
                  state: {},
                })
              }
            />
          </div>
          <div id="sign-out-container">
            <Box m={0.5}>
              <Button
                startIcon={<TableChartIcon />}
                onClick={() =>
                  navigate(`/lineage`, {
                    state: {},
                  })
                }
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#4EC4C4',
                  fontSize: '12px',
                }}
              >
                Lineage
              </Button>
            </Box>
            <Box m={0.5}>
              <Button
                startIcon={<AppsIcon />}
                onClick={() =>
                  navigate(`/test`, {
                    state: {
                      foo: 'bar',
                      data,
                    },
                  })
                }
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#674BCE',
                  fontSize: '12px',
                }}
              >
                Tests
              </Button>
            </Box>
            <Box m={0.5}>
              <Button
                startIcon={<IntegrationInstructionsIcon />}
                onClick={() =>
                  setShowIntegrationSidePanel(true)
                }
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#674BCE',
                  fontSize: '12px',
                }}
              >
                Integrations
              </Button>
            </Box>
            <Box m={0.5}>
              <Button
                startIcon={<LogoutIcon />}
                onClick={() => Auth.signOut()}
                color="secondary"
                size="medium"
                variant="contained"
                style={{
                  borderRadius: 30,
                  backgroundColor: '#A5A0A0',
                  fontSize: '12px',
                }}
              >
                Sign Out
              </Button>
            </Box>
          </div>
        </div>
        <div id="lineage" />
        <div id="sidenav" className="sidenav">
          <div id="search">
            <TextField
              label="Search"
              onChange={handleSearchChange}
              size="small"
              fullWidth={true}
            />
          </div>
          <div id="control">
            <button
              className="control-button"
              onClick={handleTreeViewExpandClick}
            >
              {expandedTreeViewElementIds.length === 0
                ? 'Expand all'
                : 'Collapse all'}
            </button>
            <button className="control-button" onClick={handleShowAll}>
              Show all
            </button>
            <button
              className={anomalyFilterOn ? 'filter-button' : 'control-button'}
              onClick={handleFilterAnomalies}
            >
              Filter Anomalies
            </button>
          </div>
          <div id="content">
            <TreeView
              aria-label="controlled"
              defaultCollapseIcon={<MdExpandMore />}
              defaultExpandIcon={<MdChevronRight />}
              expanded={expandedTreeViewElementIds}
              onNodeToggle={toggleSideNavTreeView}
              onNodeSelect={handleSelect}
            >
              {data ? treeViewElements : <></>}
            </TreeView>
          </div>
        </div>
        <div id="materializationSidePanel" className="sidepanel">
          <div className="header">
            <p className="title">SQL Model Logic</p>
            <button className="closebtn" onClick={closeMatSidePanel}>
              &times;
            </button>
          </div>
          <div id="editor" className="content">
            <SyntaxHighlighter
              language="sql"
              style={dracula}
              showLineNumbers={true}
              wrapLongLines={false}
            >
              {sql}
            </SyntaxHighlighter>
          </div>
        </div>
        <div id="columnSidePanel" className="sidepanel">
          <div className="header">
            <p className="title">Insights</p>
            <button className="closebtn" onClick={closeColSidePanel}>
              &times;
            </button>
          </div>
          <div className="content">
            <Tabs value={tabIndex} onChange={handleTabIndexChange} centered>
              <Tab label="Overview" />
              <Tab />
              <Tab label="Alert History" />
            </Tabs>
            <br></br>
            {tabIndex === 0 ? (
              <>
                <div className="card">
                  {selectedNodeId === '627160717e3d8066494d41ff' ? (
                    BasicCard(20.6, 448, 3.4, 5.6)
                  ) : (
                    // : BasicCard(47011, 448, 4129, 17521)}
                    <></>
                  )}
                </div>
                <div className="Distribution">
                  <h4>Distribution</h4>
                  <MetricsGraph
                    option={
                      selectedNodeId === '627160717e3d8066494d41ff'
                        ? defaultOption(
                            defaultYAxis,
                            effectiveRateSampleDistributionData,
                            7,
                            8
                          )
                        : defaultOption(
                            defaultYAxis,
                            defaultDistributionData,
                            7,
                            8
                          )
                    }
                  ></MetricsGraph>
                </div>
                <div className="Freshness">
                  <h4>Freshness</h4>
                  <MetricsGraph
                    option={
                      selectedNodeId === '627160717e3d8066494d41ff'
                        ? defaultOption(
                            defaultYAxis,
                            effectiveRateSampleFreshnessData,
                            5,
                            7
                          )
                        : defaultOption(
                            defaultYAxisTime,
                            defaultFreshnessData,
                            3,
                            5
                          )
                    }
                  ></MetricsGraph>
                </div>
                <div className="Nullness">
                  <h4>Nullness</h4>
                  <MetricsGraph
                    option={
                      selectedNodeId === '627160717e3d8066494d41ff'
                        ? defaultOption(
                            defaultYAxis,
                            effectiveRateSampleNullnessData,
                            1,
                            3
                          )
                        : defaultOption(defaultYAxis, defaultNullnessData, 4, 6)
                    }
                  ></MetricsGraph>
                </div>
                <br></br>
              </>
            ) : (
              <>{BasicTable()}</>
            )}
          </div>
        </div>

        <div id="integrationsSidePanel" className="sidepanel">
          <div className="header">
            <p className="title">Integrations</p>
            <button className="closebtn" onClick={closeIntegrationSidePanel}>
              &times;
            </button>
          </div>
          <div className="content">
            <Tabs value={tabIndex} onChange={handleTabIndexChange} centered>
              <Tab icon={<FaGithub />} label="GitHub" />
              <Tab icon={<SiSnowflake />} label="Snowflake" />
              <Tab icon={<FaSlack />} label="Slack" />
              <Tab icon={<SiLooker />} label="Looker" />
            </Tabs>
            {Integration(tabIndex)}
          </div>
        </div>
        {/* <div id="snackbar">{info}</div> */}
      </div>
    </ThemeProvider>
  );
};
