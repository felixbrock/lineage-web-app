import React, { ReactElement, useEffect, useState } from 'react';
import Logo from '../../components/top-nav/cito-header.png';
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
import { loadData } from './loadData';

const showRealData = false;
const lineageId = '627929bf08bead50ede9b472';

export enum DataLoadNodeType {
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

export function getNodeIdsToExplore(
    { edgesToExplore, coveredNodeIds }: { edgesToExplore: EdgeConfig[]; coveredNodeIds: string[]; }
): string[] {
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
}

/* Loads a specific combo when selected from navigation */
function loadCombo({ comboId, data }: { comboId: string; data: GraphData; }): GraphData {
  if (!data.nodes)
    return data;
  const dataNodes = data.nodes;

  if (!data.combos)
    return data;
  const dataCombos = data.combos;

  const selfCombo = dataCombos.find((element) => element.id === comboId);
  if (!selfCombo)
    throw new ReferenceError('Node not found');

  const selfNodes = dataNodes.filter((node) => node.comboId === comboId);

  return {
    nodes: selfNodes,
    edges: [],
    combos: [selfCombo],
  };
}

/* Compares two nodes based on label. Used for sorting functions */
export function compare(first: any, second: any): 1 | -1 | 0 {
  if (first.label < second.label) {
    return -1;
  }
  if (first.label > second.label) {
    return 1;
  }
  return 0;
}

function getDependentEdges({ node, isUpstream }: { node: INode; isUpstream: boolean; }): IEdge[] {
  const dependentEdges: IEdge[] = [];

  if (isUpstream) {
    node.getInEdges().forEach((edge) => {
      const source = edge.getSource();

      if (source) dependentEdges.push(...getDependentEdges({ node: source, isUpstream: true }));

      dependentEdges.push(edge);
    });

    return dependentEdges;
  } else {
    node.getOutEdges().forEach((edge) => {
      const target = edge.getTarget();

      if (target) dependentEdges.push(...getDependentEdges({ node: target, isUpstream: false }));

      dependentEdges.push(edge);
    });

    return dependentEdges;
  }
}

function buildData({ materializations, columns, dependencies }: { materializations: MaterializationDto[]; columns: ColumnDto[]; dependencies: DependencyDto[]; }): GraphData {
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
}

type TreeViewElementType = 'node' | 'combo';

function determineType({ id, data }: { id: string; data: GraphData; }): TreeViewElementType {
  if (!data.combos)
    throw new ReferenceError('Data object is empty. Type cannot be identified');
  const isCombo = data.combos.filter((element) => element.id === id).length > 0;

  if (isCombo) return 'combo';
  else return 'node';
}

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

    const handleTabIndexChange = (
      event: React.SyntheticEvent,
      newValue: number
    ) => {
      setTabIndex(newValue);
    };

    function handleSelect(event: React.SyntheticEvent, nodeIds: string) {
      if (!data) return;
      if (!graph) return;
      if (!nodeIds) return;

      const id = nodeIds;

      const selectedNodes = graph.findAllByState('node', 'selected');
      selectedNodes.forEach((node) => node.clearStates());

      const selectedCombos = graph.findAllByState('combo', 'selected');
      selectedCombos.forEach((combo) => combo.clearStates());

      const type = determineType({ id, data });

      if (type === 'combo') graph.data(loadCombo({ comboId: id, data }));
      else if (type === 'node')
        graph.data(loadData({ nodeId: id, nodeType: DataLoadNodeType.Self, coveredNodeIds: [], coveredComboIds: [], data }));

      graph.render();

      const target = graph.findById(id);

      graph.setItemState(target, 'selected', true);

      graph.emit('nodeselectchange', {
        select: true,
        target,
      });
    }

    const toggleSideNavTreeView = (event: React.SyntheticEvent, nodeIds: string[]): void => {
    return setExpandedTreeViewElementIds(nodeIds);
  };

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

        function isReactElement(element: any): element is ReactElement {
        return !!element;
      }

        const newTreeViewElements = treeViewElements
          .map((element: ReactElement) => {
            if (element.props.sx.color !== 'black') return element;

            const relevantChildren = element.props.children
              .map((child: ReactElement) => {
                if (child.props.sx.color !== 'black') return child;
                return null;
              })
              .filter(isReactElement);

            return !relevantChildren.length ? null : <TreeItem
              nodeId={element.props.nodeId}
              label={element.props.label}
              sx={element.props.sx}
            >
              {relevantChildren}
            </TreeItem>;
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

    function handleTreeViewExpandClick(): void {
    if (!data)
      return;
    if (!data.combos)
      return;

    const comboIds = data.combos.map((combo) => combo.id);

    setExpandedTreeViewElementIds((oldExpanded) => oldExpanded.length === 0 ? comboIds : []
    );
  }

    function toggleShowSideNav() {
    const sidenav = document.getElementById('sidenav');
    if (!sidenav)
      throw new ReferenceError('Sidenav does not exist');

    const visible = sidenav.style.visibility === 'visible';
    sidenav.style.visibility = visible ? 'hidden' : 'visible';
    sidenav.style.opacity = visible ? '0' : '1';
  }

    function closeMatSidePanel() {
    setSQL('');

    const panel = document.getElementById('materializationSidePanel');
    if (!panel)
      throw new ReferenceError('Materialization Panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  }

    function closeColSidePanel(): void {
    setColumnTest('');

    const panel = document.getElementById('columnSidePanel');
    if (!panel)
      throw new ReferenceError('Column Panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  }

    // const handleInfo = () => {
    //   const snackbar = document.getElementById('snackbar');
    //   if (!snackbar) throw new ReferenceError('Snackbar element not found');
    //   snackbar.className = 'show';

    //   setTimeout(() => {
    //     snackbar.className = snackbar.className.replace('show', '');
    //     setInfo('');
    //   }, 3000);
    // };

    function buildTreeViewColumn(column: any, defaultColor: string, anomalyColor: string): ReactElement {
    const hasNewAnomaly = defaultAnomalyStates.find(
      (element) => element.id === column.id
    );
    if (!hasNewAnomaly)
      throw new ReferenceError('Anomaly state not found');

    return (
        <TreeItem
            nodeId={column.id}
            label={column.label}
            icon={<MdTag />}
            sx={{
              color: hasNewAnomaly.hasNewAnomaly ? anomalyColor : defaultColor,
            }} />
    );
  }

    function buildTreeViewElements(): ReactElement[] {
    if (!data)
      return [<></>];
    if (!data.combos)
      return [<></>];

    const defaultColor = 'black';
    const anomalyColor = '#db1d33';

    const materializationElements = data.combos.map((combo): ReactElement => {
      if (!data.nodes)
        return <></>;

      const relevantColumns = data.nodes.filter(
        (node) => node.comboId === combo.id
      );

      const columnElements = relevantColumns.map((column) => buildTreeViewColumn(column, defaultColor, anomalyColor)
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

    console.log(materializationElements);

    return materializationElements;
  }

    function renderAutomations() {
    setUser('todo');
  }

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
              `todo-replace`
            );
          })
          .then((materializationDtos): Promise<ColumnDto[]> => {
              setMaterializations(materializationDtos);
              return ColumnsApiRepository.getBy(
                new URLSearchParams({ lineageId: lineageId }),
                'todo-replace'
              );
            })
          .then((columnDtos): Promise<DependencyDto[]> => {
            setColumns(columnDtos);
            return DependenciesApiRepository.getBy(
              new URLSearchParams({ lineageId: lineageId }),
              'todo-replace'
            );
          })
          .then((dependencyDtos): void => {
            setDependencies(dependencyDtos);
            setReadyToBuild(true);
          })
          .catch((error): void => console.log(error));
      } else {
        setLineage({ id: 'todo', createdAt: 1 });
        setReadyToBuild(true);
      }
    }, [accountId, jwt, lineage]);

    useEffect((): void => {
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
        setData(buildData({ materializations, columns, dependencies }));
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
    }, [columns, dependencies, materializations, readyToBuild]);

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

      graphObj.on('layout:finish', () => {
          const selectedElementId = graphObj.get('selectedElementId');

          const isString = (item: unknown): item is string => {
          return !!item;
        };

          if (!isString(selectedElementId))
            throw new ReferenceError('Self node id is not of type string');

          const element = graphObj.findById(selectedElementId);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          function isNode(object: any): object is INode {
          return object && 'getType' in object && object.getType() === 'node';
        }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          function isCombo(object: any): object is ICombo {
          return object && 'getType' in object && object.getType() === 'combo';
        }

          if (isNode(element)) {
            const anomalyState = defaultAnomalyStates.find(
              (state): boolean => state.id === selectedElementId
            );
            if (!anomalyState) throw new ReferenceError('Anomaly state not found');
            graphObj.setItemState(
              selectedElementId,
              anomalyState.hasNewAnomaly ? 'anomalyNodeSelected' : 'selected',
              true
            );

            getDependentEdges({ node: element, isUpstream: true }).forEach((edge) => {
              const sourceId = edge.getSource().getID();
              const sourceAnomalyState = defaultAnomalyStates.find(
                (state): boolean => state.id === sourceId
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

            getDependentEdges({ node: element, isUpstream: false }).forEach((edge) => {
              graphObj.setItemState(
                edge.getID(),
                anomalyState.hasNewAnomaly ? 'anomalyNodeSelected' : 'nodeSelected',
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

      graphObj.on(`nodeselectchange`, (event) => {
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

          const id = event.target.getID();

          setSelectedNodeId(id);

          graphObj.data(loadData({ nodeId: id, nodeType: DataLoadNodeType.Self, coveredNodeIds: [], coveredComboIds: [], data }));

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

              <img height="40" width="150" src={Logo} alt="logo" />
            </div>
            <div id="sign-out-container">
            <Button
                onClick={() => navigate(`/test`,{state: {
                  foo: 'bar',
                  data,
                }})}
                color="secondary"
                size="large"
              >
                Test Definition
              </Button>
              <Button
                onClick={() => Auth.signOut()}
                color="secondary"
                size="large"
              >
                Sign Out
              </Button>
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
                <Tab label="Alert History" />
              </Tabs>
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
                </>
              ) : (
                <>{BasicTable()}</>
              )}
            </div>
          </div>
          {/* <div id="snackbar">{info}</div> */}
        </div>
      </ThemeProvider>
    );
};
