import React, { ReactElement, useEffect, useState } from 'react';
import Logo from '../../components/top-nav/hivedive180.svg';
import G6, { Graph, GraphData, ICombo, IEdge, INode } from '@antv/g6';
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

const data: GraphData = {
  nodes: [
    { id: '0', label: 'salesOrderID', comboId: 'a' },
    { id: '1', label: 'countryOfSales', comboId: 'a' },
    { id: '2', label: 'productCategory', comboId: 'a' },
    { id: '3', label: 'orderId', comboId: 'b' },
    { id: '4', label: 'orderedPieces', comboId: 'b' },
    { id: '5', label: 'label', comboId: 'b' },
    { id: '6', label: 'countryOfSales', comboId: 'b' },
    { id: '7', label: 'region', comboId: 'c' },
    { id: '8', label: 'type', comboId: 'c' },
    { id: '9', label: 'name', comboId: 'c' },
    { id: '10', label: 'label', comboId: 'd' },
    { id: '11', label: 'id', comboId: 'd' },
    { id: '12', label: 'storageLocation', comboId: 'd' },
    { id: '13', label: 'distributor', comboId: 'd' },
    { id: '14', label: 'en_country', comboId: 'e' },
    { id: '15', label: 'region', comboId: 'e' },
    { id: '16', label: 'de_country', comboId: 'e' },
    { id: '17', label: 'region', comboId: 'f' },
    { id: '18', label: 'department', comboId: 'f' },
    { id: '19', label: 'role', comboId: 'f' },
    { id: '20', label: 'type', comboId: 'f' },
    { id: '21', label: 'name', comboId: 'f' },
    { id: '22', label: 'storageLocation', comboId: 'g' },
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
    { id: '33', label: 'isActive', comboId: 'h' },
    { id: '34', label: 'region', comboId: 'h' },
    { id: '35', label: 'storageLocation', comboId: 'i' },
    { id: '36', label: 'distributor', comboId: 'i' },
    { id: '37', label: 'status', comboId: 'i' },
    { id: '38', label: 'amountOrders', comboId: 'i' },
    { id: '39', label: 'responsibility', comboId: 'i' },
    { id: '40', label: 'model', comboId: 'i' },
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
      label: 'report_sales_by_region',
    },
  ],
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

const searchData = [
  {
    id: 1,
    text: 'Devpulse',
  },
  {
    id: 2,
    text: 'Linklinks',
  },
  {
    id: 3,
    text: 'Centizu',
  },
  {
    id: 4,
    text: 'Dynabox',
  },
  {
    id: 5,
    text: 'Avaveo',
  },
  {
    id: 6,
    text: 'Demivee',
  },
  {
    id: 7,
    text: 'Jayo',
  },
  {
    id: 8,
    text: 'Blognation',
  },
  {
    id: 9,
    text: 'Podcat',
  },
  {
    id: 10,
    text: 'Layo',
  },
];

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

    const searchMatches = searchData.filter((element) =>
      element.text.toLowerCase().startsWith(inputText)
    );

    const closestMatch = { text: '', similarity: 0 };

    searchMatches.forEach((element) => {
      const similarityResult = similarity(element.text, inputText);
      if (similarityResult > closestMatch.similarity) {
        closestMatch.text = element.text.toLowerCase();
        closestMatch.similarity = similarityResult;
      }
    });

    setSuggestion(closestMatch.text);
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
        default: ['drag-canvas', 'zoom-canvas', 'click-select'],
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

        getDependentEdges(event.target, true).forEach((edge) => {
          graphObj.setItemState(edge.getID(), 'nodeSelected', true);
        });

        getDependentEdges(event.target, false).forEach((edge) => {
          graphObj.setItemState(edge.getID(), 'nodeSelected', true);
        });
      } else if (event.select && event.target.get('type') === 'combo') {
        const isCombo = (object: any): object is ICombo => 'getNodes' in object;

        if (!isCombo(event.target))
          throw new ReferenceError('Event item is no combo');

        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        selectedEdges.forEach((edge) => edge.clearStates());

        // todo - attempt to fix edge highlighting bug when selected collapsed combo
        if (event.target.get('model').collapsed) graphObj.refreshPositions();

        event.target.getNodes().forEach((node) => {
          getDependentEdges(node, true).forEach((edge) => {
            graphObj.setItemState(edge.getID(), 'nodeSelected', true);
          });

          getDependentEdges(node, false).forEach((edge) => {
            graphObj.setItemState(edge.getID(), 'nodeSelected', true);
          });
        });
      }
    });

    // // collapse/expand when click the marker
    // graphObj.on('combo:click', (event) => {
    //   if (event.target.get('name') === 'combo-marker-shape') {
    //     // graph.collapseExpandCombo(e.item.getModel().id);
    //     const isCombo = (object: any): object is ICombo => 'getNodes' in object;

    //     if (!isCombo(event.item))
    //       throw new ReferenceError('Event item is no combo');

    //     graphObj.collapseExpandCombo(event.item);
    //     if (graphObj.get('layout')) graphObj.layout();
    //     else graphObj.refreshPositions();
    //   }
    // });

    graphObj.data(data);
    graphObj.render();

    // todo: collapse combos by default
    // graphObj.getCombos().forEach(combo => graphObj.collapseCombo(combo.getID()));
    // graphObj.render();

    graphObj.fitView();

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
