import React, { ReactElement, useEffect, useState } from 'react';
import Logo from '../../components/top-nav/hivedive180.svg';
import G6, { EdgeConfig, Graph, GraphData, IEdge, INode } from '@antv/g6';
import {
  HivediveLogo,
  IconSearch,
  Input,
  InputSuggestion,
  InputWrapper,
  Lineage,
  NavBar,
  SearchBar,
  Submit,
} from './lineage-items';
import './lineage-items.css';

// const collapseIcon = (x, y, r) => {
//   return [
//     ['M', x - r, y],
//     ['a', r, r, 0, 1, 0, r * 2, 0],
//     ['a', r, r, 0, 1, 0, -r * 2, 0],
//     ['M', x - r + 4, y],
//     ['L', x - r + 2 * r - 4, y],
//   ];
// };
// const expandIcon = (x, y, r) => {
//   return [
//     ['M', x - r, y],
//     ['a', r, r, 0, 1, 0, r * 2, 0],
//     ['a', r, r, 0, 1, 0, -r * 2, 0],
//     ['M', x - r + 4, y],
//     ['L', x - r + 2 * r - 4, y],
//     ['M', x - r + r, y - r + 4],
//     ['L', x, y + r - 4],
//   ];
// };

// G6.registerCombo(
//   'cCircle',
//   {
//     drawShape: function draw(cfg, group) {
//       const self = this;
//       // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
//       const style = self.getShapeStyle(cfg);
//       // Add a circle shape as keyShape which is the same as the extended 'circle' type Combo
//       const circle = group.addShape('circle', {
//         attrs: {
//           ...style,
//           x: 0,
//           y: 0,
//           r: style.r,
//         },
//         draggable: true,
//         name: 'combo-keyShape',
//       });
//       // Add the marker on the bottom
//       const marker = group.addShape('marker', {
//         attrs: {
//           ...style,
//           fill: '#fff',
//           opacity: 1,
//           x: 0,
//           y: style.r,
//           r: 10,
//           symbol: collapseIcon,
//         },
//         draggable: true,
//         name: 'combo-marker-shape',
//       });

//       return circle;
//     },
//     // Define the updating logic for the marker
//     afterUpdate: function afterUpdate(cfg, combo) {
//       const self = this;
//       // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
//       const style = self.getShapeStyle(cfg);
//       const group = combo.get('group');
//       // Find the marker shape in the graphics group of the Combo
//       const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape');
//       // Update the marker shape
//       marker.attr({
//         x: 0,
//         y: style.r,
//         // The property 'collapsed' in the combo data represents the collapsing state of the Combo
//         // Update the symbol according to 'collapsed'
//         symbol: cfg.collapsed ? expandIcon : collapseIcon,
//       });
//     },
//   },
//   'circle',
// );

const data: GraphData = {
  nodes: [
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
    // { id: '41', label: 'department', comboId: 'g' },
    // { id: '42', label: 'department', comboId: 'g' },
    // { id: '43', label: 'department', comboId: 'g' },
    // { id: '44', label: 'department', comboId: 'g' },
    // { id: '45', label: 'department', comboId: 'g' },
    // { id: '46', label: 'department', comboId: 'g' },
    // { id: '47', label: 'department', comboId: 'g' },
    // { id: '48', label: 'department', comboId: 'g' },
    // { id: '49', label: 'department', comboId: 'g' },
    // { id: '50', label: 'department', comboId: 'g' },
    // { id: '51', label: 'department', comboId: 'g' },
    // { id: '52', label: 'department', comboId: 'g' },
    // { id: '53', label: 'department', comboId: 'g' },
    // { id: '54', label: 'department', comboId: 'g' },
    // { id: '55', label: 'department', comboId: 'g' },
    // { id: '56', label: 'department', comboId: 'g' },
    // { id: '57', label: 'department', comboId: 'g' },
    // { id: '58', label: 'department', comboId: 'g' },
    // { id: '59', label: 'department', comboId: 'g' },
    // { id: '60', label: 'department', comboId: 'g' },
    // { id: '61', label: 'department', comboId: 'g' },
    // { id: '62', label: 'department', comboId: 'g' },
    // { id: '63', label: 'department', comboId: 'g' },
    // { id: '64', label: 'department', comboId: 'g' },
    // { id: '65', label: 'department', comboId: 'g' },
    // { id: '66', label: 'department', comboId: 'g' },
    // { id: '67', label: 'department', comboId: 'g' },
    // { id: '68', label: 'department', comboId: 'g' },
    // { id: '69', label: 'department', comboId: 'g' },
    // { id: '70', label: 'department', comboId: 'g' },
    // { id: '71', label: 'department', comboId: 'g' },
    // { id: '72', label: 'department', comboId: 'g' },
    // { id: '73', label: 'department', comboId: 'g' },
    // { id: '74', label: 'department', comboId: 'g' },
    // { id: '75', label: 'department', comboId: 'g' },
    // { id: '76', label: 'department', comboId: 'g' },
    // { id: '77', label: 'department', comboId: 'g' },
    // { id: '78', label: 'department', comboId: 'g' },
    // { id: '79', label: 'department', comboId: 'g' },
    // { id: '80', label: 'department', comboId: 'g' },
    // { id: '81', label: 'department', comboId: 'g' },
    // { id: '82', label: 'department', comboId: 'g' },
    // { id: '83', label: 'department', comboId: 'g' },
    // { id: '84', label: 'department', comboId: 'g' },
    // { id: '85', label: 'department', comboId: 'g' },
    // { id: '86', label: 'department', comboId: 'g' },
    // { id: '87', label: 'department', comboId: 'g' },
    // { id: '88', label: 'department', comboId: 'g' },
    // { id: '89', label: 'department', comboId: 'g' },
    // { id: '90', label: 'department', comboId: 'g' },
    // { id: '91', label: 'department', comboId: 'g' },
  ],
  edges: [
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
  ],
  combos: [
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
  ],
};

enum NodeType {
  Self = 'SELF',
  Parent = 'PARENT',
  Child = 'CHILD',
}

const getNodeIdsToExplore = (edges: EdgeConfig[], coveredNodeIds: string[]) => {
  const isString = (item: string | undefined): item is string => !!item;

  let nodeIdsToExplore: string[] = edges
    .map((edge) => [edge.source, edge.target])
    .flat()
    .filter(isString);
  nodeIdsToExplore = [...Array.from(new Set(nodeIdsToExplore))];
  nodeIdsToExplore = nodeIdsToExplore.filter(
    (id) => !coveredNodeIds.includes(id)
  );

  return nodeIdsToExplore;
};

/* Returns a  subset of existing data for initial load of page */
const loadData = (
  nodeId: string,
  nodeType: NodeType,
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

  if (nodeType === NodeType.Parent || nodeType === NodeType.Self) {
    const selfParentEdges = dataEdges.filter((edge) => edge.target === nodeId);

    graphData.edges.push(...selfParentEdges);

    const nodeIdsToExplore = getNodeIdsToExplore(
      selfParentEdges,
      localCoveredNodeIds
    );

    const dataSubsets = nodeIdsToExplore
      .map((id) =>
        loadData(id, NodeType.Parent, localCoveredNodeIds, localCoveredComboIds)
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

  if (nodeType === NodeType.Child || nodeType === NodeType.Self) {
    const selfChildEdges = dataEdges.filter((edge) => edge.source === nodeId);

    graphData.edges.push(...selfChildEdges);

    const nodeIdsToExplore = getNodeIdsToExplore(
      selfChildEdges,
      localCoveredNodeIds
    );

    const dataSubsets = nodeIdsToExplore
      .map((id) =>
        loadData(id, NodeType.Child, localCoveredNodeIds, localCoveredComboIds)
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
    (node) =>
      node.comboId === selfNode.comboId
  );

  graphData.nodes.push(...selfNodes);

  const cleanedNodes = graphData.nodes.filter((node, index, self) =>
  index === self.findIndex((element) => (
    element.id === node.id
  )));

  graphData.nodes = cleanedNodes;

  return graphData;
};

const getDependentEdges = (node: INode, isUpstream: boolean): IEdge[] => {
  const edges: IEdge[] = [];

  if (isUpstream) {
    node.getInEdges().forEach((edge) => {
      const source = edge.getSource();

      if (source) edges.push(...getDependentEdges(source, true));

      edges.push(edge);
    });
  } else {
    node.getOutEdges().forEach((edge) => {
      const target = edge.getTarget();

      if (target) edges.push(...getDependentEdges(target, false));

      edges.push(edge);
    });
  }

  return edges;
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
      if (!node.type) throw new ReferenceError('Node without type found');
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
      if (!combo.type) throw new ReferenceError('Combo without type found');
      searchIndex.push({
        id: combo.id,
        label: typeof combo.label === 'string' ? combo.label : '',
        type: 'combo',
      });
    });

  return searchIndex;
};
//   {
//     id: 1,
//     text: 'Devpulse',
//   },
//   {
//     id: 2,
//     text: 'Linklinks',
//   },
//   {
//     id: 3,
//     text: 'Centizu',
//   },
//   {
//     id: 4,
//     text: 'Dynabox',
//   },
//   {
//     id: 5,
//     text: 'Avaveo',
//   },
//   {
//     id: 6,
//     text: 'Demivee',
//   },
//   {
//     id: 7,
//     text: 'Jayo',
//   },
//   {
//     id: 8,
//     text: 'Blognation',
//   },
//   {
//     id: 9,
//     text: 'Podcat',
//   },
//   {
//     id: 10,
//     text: 'Layo',
//   },
// ];

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
  const [inputText, setInputText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [info, setInfo] = useState('');

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
    }

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

    const container = document.getElementById('lineage');
    if (!container) throw new ReferenceError(`Container for graph not found`);

    const width = window.innerWidth - 100;
    const height = window.innerHeight - 100;

    const graphObj = new G6.Graph({
      container,
      width,
      height,
      fitView: true,
      fitViewPadding: 30,
      animate: true,
      groupByTypes: false,
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'click-select',
        ],
      },
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        sortByCombo: true,
        controlPoints: true,
        nodesep: 0,
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
    });

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graphObj.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        graphObj.changeSize(container.scrollWidth, container.scrollHeight);
      };


    graphObj.on('node:highlight', (event) => {      
      const selfNodeId = event.selfNodeId;

      const isString = (item: unknown): item is string => !!item;

      if (!isString(selfNodeId))
        throw new ReferenceError('Self node id is not of type string');

      const selfNode = graphObj.findById(selfNodeId);
  
      const isNode = (object: any): object is INode => 'getEdges' in object;

      if (!isNode(selfNode))
        throw new ReferenceError('Event item is no node');

      graphObj.setItemState(selfNodeId, 'selected', true);

      getDependentEdges(selfNode, true).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });

      getDependentEdges(selfNode, false).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });
    });

    graphObj.on('nodeselectchange', (event) => {
      if (!event.select || !event.target) {
        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        selectedEdges.forEach((edge) => edge.clearStates());
      } else if (event.select && event.target.get('type') === 'node') {
        const isNode = (object: any): object is INode => 'getEdges' in object;

        if (!isNode(event.target))
          throw new ReferenceError('Event item is no node');

        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        selectedEdges.forEach((edge) => edge.clearStates());

        const selfNodeId = event.target.getID();
        graphObj.data(loadData(selfNodeId, NodeType.Self, [], []));

        graphObj.render();

        graphObj.emit('node:highlight', {
          selfNodeId
        });
      }
      // else if (event.select && event.target.get('type') === 'combo') {
      //   const isCombo = (object: any): object is ICombo => 'getNodes' in object;

      //   if (!isCombo(event.target))
      //     throw new ReferenceError('Event item is no combo');

      //   const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
      //   selectedEdges.forEach((edge) => edge.clearStates());

      //   // todo - attempt to fix edge highlighting bug when selected collapsed combo
      //   if (event.target.get('model').collapsed) graphObj.refreshPositions();

      //   event.target.getNodes().forEach((node) => {
      //     getDependentEdges(node, true).forEach((edge) => {
      //       graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      //     });

      //     getDependentEdges(node, false).forEach((edge) => {
      //       graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      //     });
      //   });
      // }
    });

    const defaultNodeId = '12';
    const defaultData = loadData(defaultNodeId, NodeType.Self, [], []);

    graphObj.data(defaultData);

    graphObj.render();

    graphObj.emit('node:highlight', {selfNodeId: defaultNodeId});

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

    // graphObj.fitView();

    setGraph(graphObj);
  }, []);

  return (
    <Lineage>
      <NavBar>
        <HivediveLogo src={Logo} alt="logo" />
        <SearchBar>
          <InputWrapper>
            <Input
              id="search-bar-1"
              name="search-bar"
              type="text"
              placeholder="e.g. 'fact_sales.label' or 'dim_region'"
              value={inputText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
            <InputSuggestion
              id="search-bar-2"
              name="search-bar"
              type="text"
              value={suggestion}
              onChange={() => {}}
            />
          </InputWrapper>
          <Submit type="submit" onClick={handleSearch}>
            <IconSearch />
          </Submit>
        </SearchBar>
      </NavBar>
      <div id="lineage" />
      <div id="snackbar">{info}</div>
    </Lineage>
  );
};
