import React, { ReactElement, useEffect, useState } from 'react';
import Logo from '../../components/top-nav/hivedive180.svg';
import G6, { EdgeConfig, Graph, GraphData, IEdge, INode } from '@antv/g6';
import './lineage.scss';
// import { FaSearch } from 'react-icons/fa';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-pgsql';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';

// aka columns
const nodes = [
  { id: '0', label: 'sales_order_id', comboId: 'a' },
  { id: '1', label: 'country_of_sales', comboId: 'a' },
  { id: '2', label: 'product_category', comboId: 'a' },
  { id: '3', label: 'order_id', comboId: 'b' },
  { id: '4', label: 'ordered_pieces', comboId: 'b' },
  { id: '5', label: 'label', comboId: 'b' },
  { id: '6', label: 'country_of_sales', comboId: 'b' },
  { id: '7', label: 'region', comboId: 'c' },
  { id: '8', label: 'type', comboId: 'c' },
  { id: '9', label: 'name', comboId: 'c' },
  { id: '10', label: 'label', comboId: 'd' },
  { id: '11', label: 'id', comboId: 'd' },
  { id: '12', label: 'storage_location', comboId: 'd' },
  { id: '13', label: 'distributor', comboId: 'd' },
  { id: '14', label: 'en_country', comboId: 'e' },
  { id: '15', label: 'region', comboId: 'e' },
  { id: '16', label: 'de_country', comboId: 'e' },
  { id: '17', label: 'region', comboId: 'f' },
  { id: '18', label: 'department', comboId: 'f' },
  { id: '19', label: 'role', comboId: 'f' },
  { id: '20', label: 'type', comboId: 'f' },
  { id: '21', label: 'name', comboId: 'f' },
  { id: '22', label: 'storage_location', comboId: 'g' },
  { id: '23', label: 'label', comboId: 'g' },
  { id: '24', label: 'distributor', comboId: 'g' },
  { id: '25', label: 'region', comboId: 'g' },
  { id: '26', label: 'id', comboId: 'g' },
  { id: '27', label: 'model', comboId: 'g' },
  { id: '28', label: 'amount', comboId: 'g' },
  { id: '29', label: 'department', comboId: 'g' },
  { id: '30', label: 'name', comboId: 'h' },
  { id: '31', label: 'type', comboId: 'h' },
  { id: '32', label: 'type', comboId: 'h' },
  { id: '33', label: 'is_active', comboId: 'h' },
  { id: '34', label: 'region', comboId: 'h' },
  { id: '35', label: 'storage_location', comboId: 'i' },
  { id: '36', label: 'distributor', comboId: 'i' },
  { id: '37', label: 'status', comboId: 'i' },
  { id: '38', label: 'amount_orders', comboId: 'i' },
  { id: '39', label: 'responsibility', comboId: 'i' },
  { id: '40', label: 'model', comboId: 'i' },
];

const edges = [
  {
    source: '0',
    target: '3',
  },
  {
    source: '0',
    target: '4',
  },
  {
    source: '1',
    target: '6',
  },
  {
    source: '2',
    target: '5',
  },
  {
    source: '3',
    target: '11',
  },
  {
    source: '3',
    target: '12',
  },
  {
    source: '4',
    target: '28',
  },
  {
    source: '5',
    target: '10',
  },
  {
    source: '6',
    target: '14',
  },
  {
    source: '7',
    target: '15',
  },
  {
    source: '7',
    target: '17',
  },
  {
    source: '8',
    target: '20',
  },
  {
    source: '8',
    target: '32',
  },
  {
    source: '9',
    target: '21',
  },
  {
    source: '10',
    target: '23',
  },
  {
    source: '11',
    target: '26',
  },
  {
    source: '12',
    target: '22',
  },
  {
    source: '13',
    target: '24',
  },
  {
    source: '14',
    target: '24',
  },
  {
    source: '15',
    target: '25',
  },
  {
    source: '18',
    target: '29',
  },
  {
    source: '17',
    target: '34',
  },
  {
    source: '20',
    target: '31',
  },
  {
    source: '21',
    target: '30',
  },
  {
    source: '22',
    target: '35',
  },
  {
    source: '24',
    target: '36',
  },
  {
    source: '27',
    target: '40',
  },
  {
    source: '27',
    target: '37',
  },
  {
    source: '28',
    target: '38',
  },
  {
    source: '29',
    target: '39',
  },
  {
    source: '30',
    target: '39',
  },
  {
    source: '33',
    target: '37',
  },
];

// aka tables
const combos = [
  {
    id: 'a',
    label: 'source_salesforce',
  },
  {
    id: 'b',
    label: 'dim_sales',
  },
  {
    id: 'c',
    label: 'source_HR',
  },
  {
    id: 'd',
    label: 'dim_sales_9x5k',
  },
  {
    id: 'e',
    label: 'dim_region',
  },
  {
    id: 'f',
    label: 'dim_employee',
  },
  {
    id: 'g',
    label: 'fact_sales',
  },
  {
    id: 'h',
    label: 'dim_employee_sales',
  },
  {
    id: 'i',
    label: 'report_regional_sales',
  },
];

const data: GraphData = { nodes, edges, combos };

const sqlLogic = [
  {
    comboId: 'a',
    sql: "with table as (\n  select 1 as sales_order_id, 'string' as country_of_sales,\n    'category' as product_category\n    \n)\n\nselect *\nfrom table",
  },
  {
    comboId: 'b',
    sql: 'select sales_order_id as order_id, sales_order_id as ordered_pieces,\n  product_category as label, country_of_sales from source_salesforce\n',
  },
  {
    comboId: 'c',
    sql: "with table as (\n  select 'region' as region, 'type' as type,\n    'name' as name\n    \n)\n\nselect *\nfrom table",
  },
  {
    comboId: 'd',
    sql: "with table as (\n  select label, order_id as id, order_id as storage_location, 'distributor' as distributor from dim_sales\n    \n)\n\nselect *\nfrom table",
  },
  {
    comboId: 'e',
    sql: "with table as (\n  select country_of_sales as en_country, region, 'de_country' as de_country from dim_sales JOIN source_HR \n WHERE dim_sales.label = source_HR.type \n)\n\nselect *\nfrom table",
  },
  {
    comboId: 'f',
    sql: "with table as (\n  select region, 'department' as department, 'role' as role, type, name from source_HR\n    \n)\n\nselect *\nfrom table",
  },
  {
    comboId: 'g',
    sql: "with table as (\n  select storage_location, label, CONCAT(distributor, en_country) as distributor \n region, id, 'model' as model,\n ordered_pieces as amount, department\n FROM ((dim_sales_9x5k JOIN dim_region WHERE dim_sales_9x5k.storage_location = dim_region.region)\n JOIN dim_sales WHERE dim_region.region = dim_sales.country_of_sales)\n JOIN dim_employee WHERE dim_region.region = dim_employee.region \n)\n\nselect *\nfrom table",
  },
  {
    comboId: 'h',
    sql: "with table as (\n  select name, type, 'is_active' as is_active, region from dim_employee \n)\n\nselect *\nfrom table",
  },
  {
    comboId: 'i',
    sql: 'select storage_location, distributor, CONCAT(model, is_active) as status,\n amount as amount_orders, CONCAT(department, name) as responsibility, model\n from fact_sales join dim_employee_sales\n WHERE fact_sales.region = dim_employee_sales.region\n',
  },
];

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

const loadCombo = (comboId: string): GraphData => {
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

/* Returns a  subset of existing data for a selected node */
const loadData = (
  nodeId: string,
  nodeType: DataLoadNodeType,
  coveredNodeIds: string[],
  coveredComboIds: string[]
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
          localCoveredComboIds
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
          localCoveredComboIds
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

declare type Index = {
  id: string;
  label: string;
  type: string;
  comboId?: string;
};

const searchData = () => {
  const searchIndex: Index[] = [];

  if (data.nodes)
    data.nodes.forEach((node) => {
      if (!node.label) throw new ReferenceError('Node without label found');
      searchIndex.push({
        id: node.id,
        label: typeof node.label === 'string' ? node.label : '',
        type: 'node',
        comboId: node.comboId,
      });
    });

  if (data.combos)
    data.combos.forEach((combo) => {
      if (!combo.label) throw new ReferenceError('Combo without label found');
      searchIndex.push({
        id: combo.id,
        label: typeof combo.label === 'string' ? combo.label : '',
        type: 'combo',
      });
    });

  return searchIndex;
};

const editDistance = (s1: string, s2: string) => {
  const lowerS1 = s1.toLowerCase();
  const lowerS2 = s2.toLowerCase();

  const costs = [];
  for (let i = 0; i <= lowerS1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= lowerS2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (lowerS1.charAt(i - 1) !== lowerS2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

const similarity = (s1: string, s2: string) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) /
    parseFloat(longerLength.toString())
  );
};

export default (): ReactElement => {
  const [graph, setGraph] = useState<Graph>();
  const [sql, setSQL] = useState('');
  const [inputText, setInputText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [info, setInfo] = useState('');

  const closeSidePanel = () => {
    setSQL('');

    const panel = document.getElementById('sqlSidepanel');
    if (!panel) throw new ReferenceError('SQL Panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  };

  const handleSearch = () => {
    if (!graph || !inputText) return;
    const selectedNodes = graph.findAllByState('node', 'selected');
    selectedNodes.forEach((node) => node.clearStates());

    const inputContent = inputText.includes('.')
      ? inputText.split('.')
      : [inputText];

    if (!data.combos) throw new ReferenceError('No combos found');
    const comboConfig = data.combos.find(
      (combo) => combo.label === inputContent[0]
    );
    if (!comboConfig) {
      setInfo('Queried table not found');
      return;
    }

    let id = comboConfig.id;
    let isOnlyCombo = true;
    if (inputContent.length > 1) {
      if (!data.nodes) throw new ReferenceError('No nodes found');
      const nodeConfig = data.nodes.find(
        (node) => node.label === inputContent[1] && node.comboId === id
      );
      if (!nodeConfig) {
        setInfo('Queried node not found');
        return;
      }
      id = nodeConfig.id;
      isOnlyCombo = false;
    }

    if (isOnlyCombo) graph.data(loadCombo(id));
    else graph.data(loadData(id, DataLoadNodeType.Self, [], []));

    graph.render();

    const target = graph.findById(id);
    graph.setItemState(target, 'selected', true);

    // Trigger the node click event
    graph.emit('nodeselectchange', {
      select: true,
      target, // the 'clicked' shape on the node. It uses the keyShape of the node here, you could assign any shapes in the graphics group (node.getContainer()) of the node
    });
  };

  const handleInput = (event: any) => {
    //convert input text to lower case
    const lowerCase = event.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 39) {
      setInputText(suggestion);
    } else if (event.keyCode === 9) {
      event.preventDefault();
    } else if (event.keyCode === 13) {
      handleSearch();
    }
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
    if (!inputText) {
      setSuggestion('');
      return;
    }

    let index: Index[] = [];
    let combo = '';
    let node = '';
    if (inputText.includes('.')) {
      const input = inputText.split('.');
      combo = input[0];
      node = input[1];

      const comboIndex = searchData().find(
        (element) => element.type === 'combo' && element.label === combo
      );
      if (!comboIndex) throw new ReferenceError('Typed combo not found');

      index = searchData().filter(
        (element) =>
          element.type === 'node' && element.comboId === comboIndex.id
      );
    } else {
      index = searchData().filter((element) => element.type === 'combo');
      combo = inputText;
    }

    const searchMatches = index.filter((element) =>
      element.label.toLowerCase().startsWith(node ? node : combo)
    );

    const closestMatch = { text: '', similarity: 0 };

    searchMatches.forEach((element) => {
      const similarityResult = similarity(element.label, inputText);
      if (similarityResult > closestMatch.similarity) {
        closestMatch.text = element.label.toLowerCase();
        closestMatch.similarity = similarityResult;
      }
    });

    setSuggestion(node ? combo + '.' + closestMatch.text : closestMatch.text);
  }, [inputText]);

  useEffect(() => {
    if (graph) return;

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
      },
      defaultNode: {
        // size: [30, 20],
        type: 'rect',
        style: {
          width: 130,
          lineWidth: 1,
          stroke: '#ababab',
          fill: '#fafaff',
          radius: 5,
        },
      },
      nodeStateStyles: {
        selected: {
          stroke: hivediveBlue,
          lineWidth: 1,
          shadowBlur: 5,
        },
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        color: '#e2e2e2',
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
      },
      defaultCombo: {
        // type: 'cRect',
        type: 'rect',
        size: 150,
        fixCollapseSize: [80, 10],
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

    graphObj.on('layout:finish', (event) => {
      const selfNodeId = event.selfNodeId;

      const isString = (item: unknown): item is string => !!item;

      if (!isString(selfNodeId))
        throw new ReferenceError('Self node id is not of type string');

      const selfNode = graphObj.findById(selfNodeId);

      const isNode = (object: any): object is INode => 'getEdges' in object;

      if (!isNode(selfNode)) throw new ReferenceError('Event item is no node');

      graphObj.setItemState(selfNodeId, 'selected', true);

      getDependentEdges(selfNode, true).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });

      getDependentEdges(selfNode, false).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });

      graphObj.focusItem(selfNode);
    });

    graphObj.on('nodeselectchange', (event) => {
      if (!event.select || !event.target) {
        closeSidePanel();
        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        selectedEdges.forEach((edge) => edge.clearStates());
      } else if (event.select && event.target.get('type') === 'node') {
        closeSidePanel();
        const isNode = (object: any): object is INode => 'getEdges' in object;

        if (!isNode(event.target))
          throw new ReferenceError('Event item is no node');

        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        selectedEdges.forEach((edge) => edge.clearStates());

        const selfNodeId = event.target.getID();
        graphObj.data(loadData(selfNodeId, DataLoadNodeType.Self, [], []));

        graphObj.render();

        graphObj.emit('layout:finish', {
          selfNodeId,
        });
      } else if (event.select && event.target.get('type') === 'combo') {
        const comboId = event.target.get('id');

        const sqlLogicFilterResults = sqlLogic.filter(
          (logic) => logic.comboId === comboId
        );

        if (sqlLogicFilterResults.length > 1)
          throw new ReferenceError(
            'Multiple sql models for materialization found'
          );
        if (!sqlLogicFilterResults.length)
          throw new ReferenceError('No sql model for materialization found');

        setSQL(sqlLogicFilterResults[0].sql);

        const panel = document.getElementById('sqlSidepanel');
        if (!panel) throw new ReferenceError('SQL Panel does not exist');
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
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

    const defaultNodeId = '12';
    const defaultData = loadData(defaultNodeId, DataLoadNodeType.Self, [], []);

    graphObj.data(defaultData);

    graphObj.render();

    graphObj.emit('layout:finish', { selfNodeId: defaultNodeId });

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

    // graphObj.render();

    setGraph(graphObj);
  }, []);

  return (
    <div id="lineageContainer">
      <div className="navbar">
        <img className="logo" src={Logo} alt="logo" />
        <div id="searchbar" className="searchbar">
          <div id="inputWrapper">
            <input
              className="search"
              id="search-bar-1"
              name="search-bar"
              type="text"
              placeholder="e.g. 'fact_sales.label' or 'dim_region'"
              value={inputText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
            <input
              className="suggestion"
              id="search-bar-2"
              name="search-bar"
              type="text"
              value={suggestion}
              onChange={() => {}}
            />
          </div>
          <button className="submit" type="submit" onClick={handleSearch}>
            GO
          </button>
        </div>
      </div>
      <div id="lineage" />
      <div id="sqlSidepanel" className="sidepanel">
        <div className="header">
          <p className="title">SQL Model Logic</p>
          <button className="closebtn" onClick={closeSidePanel}>
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
            fontSize={18}
            readOnly={true}
            value={sql}
            wrapEnabled={true}
            showPrintMargin={false}
          />
        </div>
      </div>

      <div id="snackbar">{info}</div>
    </div>
  );
};
