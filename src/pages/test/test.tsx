import React, { ReactElement, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
import './test.scss';
import { MdTag, MdChevronRight, MdExpandMore } from 'react-icons/md';

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
} from '../lineage/test-data';

import TreeView from '@mui/lab/TreeView';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Auth } from 'aws-amplify';

import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';

const showRealData = false;
const lineageId = '627929bf08bead50ede9b472';

export const testSelectionTypes = [
  'distributionActivated',
  'freshnessActivated',
  'cardinalityActivated',
  'nullnessActivated',
  'uniquenessActivated',
  'sortednessActivated',
] as const;
export type SelectionType = typeof testSelectionTypes[number];

export const parseSelectionType = (selectionType: unknown): SelectionType => {
  const identifiedSelectionType = testSelectionTypes.find(
    (validSelectionType) => validSelectionType === selectionType
  );
  if (identifiedSelectionType) return identifiedSelectionType;
  throw new Error('Provision of invalid selection type');
};

interface ColumnTestSelection {
  label: string;
  frequency: string;
  sensitivity: number;
  distributionActivated: boolean;
  freshnessActivated: boolean;
  cardinalityActivated: boolean;
  nullnessActivated: boolean;
  uniquenessActivated: boolean;
  sortednessActivated: boolean;
  testsActivated: boolean;
}

interface MaterializationTestSelection {
  columnTestSelection: { [key: string]: ColumnTestSelection };
  navExpanded: boolean;
  label: string;
}

enum DataLoadNodeType {
  Self = 'SELF',
  Parent = 'PARENT',
  Child = 'CHILD',
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#a487ff',
    },
    secondary: {
      main: '#000000',
    },
    success: {
      main: '#6f47ef',
    },
    info: {
      main: '#c8c8c8',
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
  const [filteredTreeViewElements] = useState<ReactElement[]>([]);
  const [searchedTreeViewElements, setSearchedTreeViewElements] = useState<
    ReactElement[]
  >([]);
  const [treeViewElements, setTreeViewElements] = useState<ReactElement[]>([]);
  const [anomalyFilterOn] = useState(false);
  const [testSelection, setTestSelection] = useState<{
    [key: string]: MaterializationTestSelection;
  }>({});

  const handleFrequencyChange = (event: any) => {
    const name = event.target.name as string;
    const props = name.split('-');

    const testSelectionLocal = testSelection;


    testSelectionLocal[props[1]].columnTestSelection[props[2]].frequency =
      event.target.value;



    setTestSelection({ ...testSelectionLocal });
  };

  const handleSensitivityChange = (event: any) => {
    const id = event.target.id as string;
    const props = id.split('-');

    const testSelectionLocal = testSelection;

    testSelectionLocal[props[1]].columnTestSelection[props[2]].sensitivity =
      event.target.value;
      
    setTestSelection({ ...testSelectionLocal });
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
    const hasNewAnomaly = defaultAnomalyStates.find(
      (element) => element.id === column.id
    );
    if (!hasNewAnomaly) throw new ReferenceError('Anomaly state not found');

    return (
      <TreeItem
        nodeId={column.id}
        label={column.label}
        icon={<MdTag />}
        sx={{
          color: hasNewAnomaly.hasNewAnomaly ? anomalyColor : defaultColor,
        }}
      />
    );
  };

  const handleTestSelectButtonClick = (event: any) => {
    const id = event.target.id as string;
    const props = id.split('-');

    const type = parseSelectionType(props[0]);

    const testSelectionLocal = testSelection;

    testSelectionLocal[props[1]].columnTestSelection[props[2]][type] =
      !testSelectionLocal[props[1]].columnTestSelection[props[2]][type];

    const activated =
      testSelectionLocal[props[1]].columnTestSelection[props[2]]
        .cardinalityActivated ||
      testSelectionLocal[props[1]].columnTestSelection[props[2]]
        .distributionActivated ||
      testSelectionLocal[props[1]].columnTestSelection[props[2]]
        .freshnessActivated ||
      testSelectionLocal[props[1]].columnTestSelection[props[2]]
        .nullnessActivated ||
      testSelectionLocal[props[1]].columnTestSelection[props[2]]
        .sortednessActivated ||
      testSelectionLocal[props[1]].columnTestSelection[props[2]]
        .uniquenessActivated;

    testSelectionLocal[props[1]].columnTestSelection[props[2]].testsActivated =
      activated;

    setTestSelection({ ...testSelectionLocal });
  };

  const buildColumnTests = (
    materializationId: string,
    columnId: string
  ): ReactElement => {
    return (
      <TableRow>
        <TableCell align="center">
          {testSelection[materializationId].columnTestSelection[columnId].label}
        </TableCell>
        <TableCell align="center">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              name = {`frequency-${materializationId}-${columnId}`}
              disabled={
                !testSelection[materializationId].columnTestSelection[columnId]
                  .testsActivated
              }
              displayEmpty={true}
          renderValue={(value) => value || testSelection[materializationId].columnTestSelection[columnId]
            .frequency}
              value={
                testSelection[materializationId].columnTestSelection[columnId]
                  .frequency
              }
              onChange={handleFrequencyChange}
            >
              <MenuItem value={'1h'}>1h</MenuItem>
              <MenuItem value={'3h'}>3h</MenuItem>
              <MenuItem value={'6h'}>6h</MenuItem>
              <MenuItem value={'12h'}>12h</MenuItem>
              <MenuItem value={'1d'}>1d</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="center">
          <Slider
            id={`sensitivity-${materializationId}-${columnId}`}
            disabled={
              !testSelection[materializationId].columnTestSelection[columnId]
                .testsActivated
            }
            aria-label="Sensitivity"
            // defaultValue={
            //   testSelection[materializationId].columnTestSelection[columnId]
            //     .sensitivity
            // }
            defaultValue={
              testSelection[materializationId].columnTestSelection[columnId]
                .sensitivity
            }
            getAriaValueText={(value: number) => `${value}`}
            valueLabelDisplay="auto"
            color="primary"
            step={1}
            marks={[
              {
                value: -5,
                label: 'l',
              },
              {
                value: 5,
                label: 'h',
              },
            ]}
            min={-5}
            max={5}
            onChange={handleSensitivityChange}
          />
        </TableCell>
        <TableCell align="center">
          <Button
            id={`freshnessActivated-${materializationId}-${columnId}`}
            size="large"
            variant="contained"
            color={
              testSelection[materializationId].columnTestSelection[columnId]
                .freshnessActivated
                ? 'primary'
                : 'info'
            }
            onClick={handleTestSelectButtonClick}
          />
        </TableCell>
        <TableCell align="center">
          <Button
            id={`cardinalityActivated-${materializationId}-${columnId}`}
            size="large"
            variant="contained"
            color={
              testSelection[materializationId].columnTestSelection[columnId]
                .cardinalityActivated
                ? 'primary'
                : 'info'
            }
            onClick={handleTestSelectButtonClick}
          />
        </TableCell>
        <TableCell align="center">
          <Button
            id={`nullnessActivated-${materializationId}-${columnId}`}
            size="large"
            variant="contained"
            color={
              testSelection[materializationId].columnTestSelection[columnId]
                .nullnessActivated
                ? 'primary'
                : 'info'
            }
            onClick={handleTestSelectButtonClick}
          />
        </TableCell>
        <TableCell align="center">
          <Button
            id={`uniquenessActivated-${materializationId}-${columnId}`}
            size="large"
            variant="contained"
            color={
              testSelection[materializationId].columnTestSelection[columnId]
                .uniquenessActivated
                ? 'primary'
                : 'info'
            }
            onClick={handleTestSelectButtonClick}
          />
        </TableCell>
        <TableCell align="center">
          <Button
            id={`sortednessActivated-${materializationId}-${columnId}`}
            size="large"
            variant="contained"
            color={
              testSelection[materializationId].columnTestSelection[columnId]
                .sortednessActivated
                ? 'primary'
                : 'info'
            }
            onClick={handleTestSelectButtonClick}
          />
        </TableCell>
        <TableCell align="center">
          <Button
            id={`distributionActivated-${materializationId}-${columnId}`}
            size="large"
            variant="contained"
            color={
              testSelection[materializationId].columnTestSelection[columnId]
                .distributionActivated
                ? 'primary'
                : 'info'
            }
            onClick={handleTestSelectButtonClick}
          />
        </TableCell>
      </TableRow>
    );

    // return (
    //   <TreeItem
    //     nodeId={column.id}
    //     label={column.label}
    //     icon={<MdTag />}
    //     sx={{
    //       color: hasNewAnomaly.hasNewAnomaly ? anomalyColor : defaultColor,
    //     }}
    //   />
    // );
  };

  const buildTestSelectionStructure = (): {
    [key: string]: MaterializationTestSelection;
  } => {
    if (!data) return {};
    if (!data.combos) return {};

    const nodes = data.nodes;
    if (!nodes) return {};

    const testSelectionStructure: {
      [key: string]: MaterializationTestSelection;
    } = {};

    data.combos.forEach((combo) => {
      const materializationLabel = combo.label;
      if (typeof materializationLabel !== 'string')
        throw new Error('Combo label not of type string');

      const tableTestSelectionStructure: MaterializationTestSelection = {
        label: materializationLabel,
        navExpanded: false,
        columnTestSelection: {},
      };

      const relevantColumns = nodes.filter((node) => node.comboId === combo.id);

      relevantColumns.forEach((column) => {
        const columnLabel = column.label;
        if (typeof columnLabel !== 'string')
          throw new Error('Column label not of type string');

        return (tableTestSelectionStructure.columnTestSelection[column.id] = {
          label: columnLabel,
          frequency: '1h',
          sensitivity: 0,
          distributionActivated: false,
          freshnessActivated: false,
          cardinalityActivated: false,
          nullnessActivated: false,
          uniquenessActivated: false,
          sortednessActivated: false,
          testsActivated: false,
        });
      });

      testSelectionStructure[combo.id] = tableTestSelectionStructure;
    });

    return testSelectionStructure;
  };

  const Test = (props: { materializationId: string }): ReactElement => {
    const materializationTestSelection = testSelection[props.materializationId];

    const [open, setOpen] = React.useState(
      materializationTestSelection.navExpanded
    );

    const columnElements = Object.keys(
      materializationTestSelection.columnTestSelection
    ).map((key) => buildColumnTests(props.materializationId, key));

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell component="th" scope="row">
            {testSelection[props.materializationId].label}
          </TableCell>
          <TableCell align="center">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open);
                setTestSelection({
                  ...testSelection,
                  [props.materializationId]: {
                    navExpanded: !open,
                    label: testSelection[props.materializationId].label,
                    columnTestSelection:
                      testSelection[props.materializationId]
                        .columnTestSelection,
                  },
                });
              }}
            >
              {open ? <MdExpandMore /> : <MdChevronRight />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            align="center"
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={6}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Column Name
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Frequency
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Sensitivity
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Freshness
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Cardinality
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Nullness
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Uniqueness
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Sortedness
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Distribution
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{columnElements}</TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
    // return (
    //   <TreeItem
    //     nodeId={combo.id}
    //     label={combo.label}
    //     sx={{ color: hasAnomalyChilds ? anomalyColor : defaultColor }}
    //     endIcon={<MdTag />}
    //   >
    //     {columnElements}
    //   </TreeItem>
    // );
  };

  // function createData(
  //   name: string,
  //   calories: number,
  //   fat: number,
  //   carbs: number,
  //   protein: number,
  //   price: number
  // ) {
  //   return {
  //     name,
  //     calories,
  //     fat,
  //     carbs,
  //     protein,
  //     price,
  //     history: [
  //       {
  //         date: '2020-01-05',
  //         customerId: '11091700',
  //         amount: 3,
  //       },
  //       {
  //         date: '2020-01-02',
  //         customerId: 'Anonymous',
  //         amount: 1,
  //       },
  //     ],
  //   };
  // }

  // function Row(props: { row: ReturnType<typeof createData> }) {
  //   const { row } = props;
  //   const [open, setOpen] = React.useState(false);

  //   return (
  //     <React.Fragment>
  //       <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
  //         <TableCell align='center' component="th" scope="row">
  //           {row.name}
  //         </TableCell>
  //         <TableCell align='center'>
  //           <IconButton
  //             aria-label="expand row"
  //             size="small"
  //             onClick={() => setOpen(!open)}
  //           >
  //             {open ? <MdExpandMore /> : <MdChevronRight />}
  //           </IconButton>
  //         </TableCell>
  //       </TableRow>
  //       <TableRow>
  //         <TableCell align='center' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
  //           <Collapse in={open} timeout="auto" unmountOnExit>
  //             <Box sx={{ margin: 1 }}>
  //               <Table>
  //                 <TableHead>
  //                   <TableRow>
  //                     <TableCell align='center' />
  //                     <TableCell align='center'>Frequency</TableCell>
  //                     <TableCell align='center'>Threshold</TableCell>
  //                     <TableCell align='center'>Freshness</TableCell>
  //                     <TableCell align='center'>Cardinality</TableCell>
  //                     <TableCell align='center'>Nullness</TableCell>
  //                     <TableCell align='center'>Uniqueness</TableCell>
  //                     <TableCell align='center'>Nullness</TableCell>
  //                     <TableCell align='center'>Sortedness</TableCell>
  //                     <TableCell align='center'>Distribution</TableCell>
  //                   </TableRow>
  //                 </TableHead>
  //                 <TableBody>
  //                   <TableRow>
  //                     <TableCell align='center'>
  //                       <>Column Name 1</>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <>A</>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <>B</>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <Button>Test1</Button>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <Button>Test2</Button>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <Button>Test3</Button>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <Button>Test4</Button>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <Button>Test5</Button>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <Button>Test6</Button>
  //                     </TableCell>
  //                     <TableCell align='center'>
  //                       <Button>Test7</Button>
  //                     </TableCell>
  //                   </TableRow>
  //                 </TableBody>
  //               </Table>
  //             </Box>
  //           </Collapse>
  //         </TableCell>
  //       </TableRow>
  //     </React.Fragment>
  //   );
  // }

  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  //   createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  //   createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
  // ];

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

  useEffect(() => {
    if (!data) return;

    setTestSelection(buildTestSelectionStructure());

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

      const isString = (item: unknown): item is string => !!item;

      if (!isString(selectedElementId))
        throw new ReferenceError('Self node id is not of type string');

      const element = graphObj.findById(selectedElementId);

      const isNode = (object: any): object is INode =>
        object && 'getType' in object && object.getType() === 'node';

      const isCombo = (object: any): object is ICombo =>
        object && 'getType' in object && object.getType() === 'combo';

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

  return (
    <ThemeProvider theme={theme}>
      <div id="lineageContainer">
        <div className="navbar">
          <div id="menu-container">
            <img height="40" width="150" src={Logo} alt="logo" />
          </div>
          <div id="sign-out-container">
            <Button
              onClick={() =>
                navigate(`/test`, {
                  state: {
                    foo: 'bar',
                    data,
                  },
                })
              }
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
        <div id="lineage" hidden={true} />
        <div id="search-nav-container">
          <div id="search">
            <TextField
              label="Search"
              onChange={handleSearchChange}
              fullWidth={true}
            />
          </div>
        </div>
        <div hidden={true}>
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

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: window.innerHeight - 40 - 50 }}>
            <Table stickyHeader={false} aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Table Name</TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(testSelection).length ? (
                  Object.keys(testSelection).map(
                    (materializationId): ReactElement => (
                      <Test materializationId={materializationId}></Test>
                    )
                  )
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </ThemeProvider>
  );
};
