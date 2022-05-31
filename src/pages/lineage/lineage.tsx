import React, { ReactElement, useEffect, useState } from 'react';
import Logo from '../../components/top-nav/hivedive180.svg';
import G6, {
  ComboConfig,
  EdgeConfig,
  Graph,
  GraphData,
  IEdge,
  INode,
  NodeConfig,
} from '@antv/g6';
import './lineage.scss';
import AceEditor from 'react-ace';
import { MdMenu, MdChevronRight, MdExpandMore, MdTag } from 'react-icons/md';
import MetricsGraph, {
  FreshnessDefaultOption,
  OutlierDefaultOption,
  PopulationDefaultOption,
} from '../../components/metrics-graph';

import 'ace-builds/src-noconflict/mode-pgsql';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';
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
import BasicCard from '../../components/card';
import BasicTable from '../../components/table';

const showRealData = false;
const lineageId = '627929bf08bead50ede9b472';

enum DataLoadNodeType {
  Self = 'SELF',
  Parent = 'PARENT',
  Child = 'CHILD',
}

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

const buildData = (
  materializations: MaterializationDto[],
  columns: ColumnDto[],
  dependencies: DependencyDto[]
): GraphData => {
  const combos = materializations
    .map(
      (materialization): ComboConfig => ({
        id: materialization.id,
        label: materialization.name.toLowerCase(),
      })
    )
    .sort(compare);
  const nodes = columns
    .map(
      (column): NodeConfig => ({
        id: column.id,
        label: column.name.toLowerCase(),
        comboId: column.materializationId,
      })
    )
    .sort(compare);
  const edges = dependencies.map(
    (dependency): EdgeConfig => ({
      source: dependency.tailId,
      target: dependency.headId,
    })
  );

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
  const [graph, setGraph] = useState<Graph>();
  const [sql, setSQL] = useState('');
  const [columnTest, setColumnTest] = useState('');
  const [info, setInfo] = useState('');
  const [lineage, setLineage] = useState<LineageDto>();
  const [materializations, setMaterializations] = useState<
    MaterializationDto[]
  >([]);
  const [columns, setColumns] = useState<ColumnDto[]>([]);
  const [dependencies, setDependencies] = useState<DependencyDto[]>([]);
  const [data, setData] = useState<GraphData>();
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [expandedTreeViewElementIds, setExpandedTreeViewElementIds] = useState<
    string[]
  >([]);
  const [allTreeViewElements, setAllTreeViewElements] = useState<
    ReactElement[]
  >([]);
  const [treeViewElements, setTreeViewElements] = useState<ReactElement[]>([]);
  const [tabIndex, setTabIndex] = React.useState(0);

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

  const handleInfo = () => {
    const snackbar = document.getElementById('snackbar');
    if (!snackbar) throw new ReferenceError('Snackbar element not found');
    snackbar.className = 'show';

    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '');
      setInfo('');
    }, 3000);
  };

  useEffect(() => {
    if (!info) return;

    handleInfo();
  }, [info]);

  useEffect(() => {
    if (!readyToBuild) return;

    if (showRealData)
      setData(buildData(materializations, columns, dependencies));
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

  const buildTreeViewColumns = (comboId: string): ReactElement[] => {
    if (!data) return [<></>];
    if (!data.nodes) return [<></>];

    const relevantColumns = data.nodes.filter(
      (node) => node.comboId === comboId
    );

    const columnElements = relevantColumns.map((column) => (
      <TreeItem nodeId={column.id} label={column.label} icon={<MdTag />} />
    ));

    return columnElements;
  };

  const buildTreeViewElements = (): ReactElement[] => {
    if (!data) return [<></>];
    if (!data.combos) return [<></>];

    const materializationElements = data.combos.map((combo) => (
      <TreeItem nodeId={combo.id} label={combo.label}>
        {buildTreeViewColumns(combo.id)}
      </TreeItem>
    ));

    return materializationElements;
  };

  useEffect(() => {
    if (!data) return;

    const elements = buildTreeViewElements();
    setAllTreeViewElements(elements);
    setTreeViewElements(elements);

    const hivediveBlue = '#2c25ff';

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

    graphObj.on('layout:finish', () => {
      const selectedElementId = graphObj.get('selectedElementId');

      const isString = (item: unknown): item is string => !!item;

      if (!isString(selectedElementId))
        throw new ReferenceError('Self node id is not of type string');

      const element = graphObj.findById(selectedElementId);

      const isNode = (object: any): object is INode =>
        object && 'getEdges' in object;

      if (isNode(element)) {
        const anomalyState = defaultAnomalyStates.find(
          (state) => state.id === selectedElementId
        );
        if (!anomalyState) throw new ReferenceError('Anomaly state not found');
        graphObj.setItemState(
          selectedElementId,
          anomalyState.hasNewAnomaly ? 'anomalyNodeSelected' : 'selected',
          true
        );

        getDependentEdges(element, true).forEach((edge) => {
          const sourceId = edge.getSource().getID();
          const sourceAnomalyState = defaultAnomalyStates.find(
            (state) => state.id === sourceId
          );
          if (!sourceAnomalyState)
            throw new ReferenceError('Anomaly state not found');

          graphObj.setItemState(
            edge.getID(),
            sourceAnomalyState.hasNewAnomaly
              ? 'anomalyNodeSelected'
              : 'nodeSelected',
            true
          );
        });

        getDependentEdges(element, false).forEach((edge) => {
          graphObj.setItemState(
            edge.getID(),
            anomalyState.hasNewAnomaly ? 'anomalyNodeSelected' : 'nodeSelected',
            true
          );
        });
      }

      graphObj.focusItem(element);

      graphObj.zoom(graphObj.get('latestZoom') || 1);
    });

    graphObj.on('nodeselectchange', (event) => {
      const clearStates = () => {
        closeMatSidePanel();
        closeColSidePanel();
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

        const selectedNodeId = event.target.getID();
        graphObj.data(
          loadData(selectedNodeId, DataLoadNodeType.Self, [], [], data)
        );

        setColumnTest(Date.now().toString());

        graphObj.set('latestZoom', graphObj.getZoom());
        graphObj.set('selectedElementId', selectedNodeId);

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

        const combo = materializationsToSearch.find(
          (materialization) => materialization.id === comboId
        );

        if (!combo)
          throw new ReferenceError(
            'Materialization object for selected combo not found'
          );

        if (showRealData) {
          LogicApiRepository.getOne(combo.logicId, 'todo-replace').then(
            (logicDto) => {
              console.log(logicDto?.sql);

              if (!logicDto)
                throw new ReferenceError('Not able to retrieve logic object');

              setSQL(logicDto.sql);
            }
          );
        } else {
          const checkedCombo = combo;

          const logic = defaultLogics.find(
            (element) => element.id === checkedCombo.logicId
          );

          if (!logic)
            throw new ReferenceError(
              'Logic object for selected combo not found'
            );

          setSQL(logic.sql);
        }

        graphObj.set('latestZoom', graphObj.getZoom());
        graphObj.set('selectedElementId', combo.id);

        graphObj.render();

        // const isCombo = (object: any): object is ICombo => 'getNodes' in object;

        // if (!isCombo(event.target))
        //   throw new ReferenceError('Event item is no combo');

        // const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        // selectedEdges.forEach((edge) => edge.clearStates());

        // // todo - attempt to fix edge highlighting bug when selected collapsed combo
        // if (event.target.get('model').collapsed) graphObj.refreshPositions();

        // event.target.getNodes().forEach((node) => {
        //   getDependentEdges(node, true).forEach((edge) => {
        //     graphObj.setItemState(edge.getID(), 'nodeSelected', true);
        //   });

        //   getDependentEdges(node, false).forEach((edge) => {
        //     graphObj.setItemState(edge.getID(), 'nodeSelected', true);
        //   });
        // });
      }
    });

    const defaultNodeId =
      showRealData && data.nodes
        ? data.nodes[0].id
        : '62715f907e3d8066494d409f';

    // const initialData = loadData(
    //   defaultNodeId,
    //   DataLoadNodeType.Self,
    //   [],
    //   [],
    //   data
    // );

    const initialData = data;

    graphObj.data(initialData);

    // if (!defaultData.nodes) throw new ReferenceError('Nodes do not exist');
    // const selfNode = defaultData.nodes.find(
    //   (node) => node.id === defaultNodeId
    // );
    // if (!selfNode) throw new ReferenceError('Self node not found');

    // const selfComboId = selfNode.comboId;
    // if (!selfComboId) throw new ReferenceError('Self combo id not found');

    // if (defaultData.combos)
    //   defaultData.combos.forEach((combo) => {
    //     if (combo.id !== selfComboId) graphObj.collapseCombo(combo.id);
    //   });

    graphObj.set('selectedElementId', defaultNodeId);

    graphObj.render();

    setGraph(graphObj);
  }, [data]);

  useEffect(() => {
    if (!graph) return;

    toggleShowSideNav();
  }, [graph]);

  useEffect(() => {
    if (lineage) return;

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
  }, []);

  const handleSearchChange = (event: any) => {
    if (!allTreeViewElements) return;

    const value = event.target.value;
    if (!value) setAllTreeViewElements(allTreeViewElements);

    const isReactElement = (element: any): element is ReactElement => !!element;

    const newTreeViewElements = allTreeViewElements
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
          <TreeItem nodeId={element.props.nodeId} label={element.props.label}>
            {relevantChildren}
          </TreeItem>
        );
      })
      .filter(isReactElement);

    setTreeViewElements(newTreeViewElements);
  };

  return (
    <div id="lineageContainer">
      <div className="navbar">
        <div id="menu-container">
          <button id="menu-button" onClick={toggleShowSideNav}>
            <MdMenu />
          </button>

          <img src={Logo} alt="logo" />
        </div>
      </div>
      <div id="lineage" />
      <div id="sidenav" className="sidenav">
        <div id="search">
          <TextField
            label="Search"
            onChange={handleSearchChange}
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
          <AceEditor
            name="sqlEditor"
            mode="pgsql"
            theme="xcode"
            height="100%"
            width="100%"
            fontSize={16}
            readOnly={true}
            value={sql}
            wrapEnabled={true}
            showPrintMargin={false}
          />
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
            <Tab label="Insights" />
            <Tab label="Alerts" />
          </Tabs>
          {tabIndex === 0 ? (
            <>
              {BasicCard()}
              <p>Outlier</p>
              <MetricsGraph option={OutlierDefaultOption}></MetricsGraph>
              <p>Freshness</p>
              <MetricsGraph option={FreshnessDefaultOption}></MetricsGraph>
              <p>Population</p>
              <MetricsGraph option={PopulationDefaultOption}></MetricsGraph>
            </>
          ) : (
            <>{BasicTable()}</>
          )}
        </div>
      </div>
      <div id="snackbar">{info}</div>
    </div>
  );
};
