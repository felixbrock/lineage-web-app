import React, { ReactElement, useEffect, useState } from 'react';

import G6, { Graph, GraphData, IEdge, INode } from '@antv/g6';
import { Lineage } from './lineage-items';

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

export default (): ReactElement => {
  const data: GraphData = {
    nodes: [
      { id: '0', label: '0', comboId: 'a' },
      { id: '1', label: '1', comboId: 'a' },
      { id: '2', label: '2', comboId: 'a' },
      { id: '3', label: '3', comboId: 'b' },
      { id: '4', label: '4', comboId: 'b' },
      { id: '5', label: '5', comboId: 'b' },
      { id: '6', label: '6', comboId: 'b' },
      { id: '7', label: '7', comboId: 'c' },
      { id: '8', label: '8', comboId: 'c' },
      { id: '9', label: '9', comboId: 'c' },
      { id: '10', label: '10', comboId: 'd' },
      { id: '11', label: '11', comboId: 'd' },
      { id: '12', label: '12', comboId: 'd' },
      { id: '13', label: '13', comboId: 'd' },
      { id: '14', label: '14', comboId: 'e' },
      { id: '15', label: '15', comboId: 'e' },
      { id: '16', label: '16', comboId: 'e' },
      { id: '17', label: '17', comboId: 'f' },
      { id: '18', label: '18', comboId: 'f' },
      { id: '19', label: '19', comboId: 'f' },
      { id: '20', label: '20', comboId: 'f' },
      { id: '21', label: '21', comboId: 'f' },
      { id: '22', label: '22', comboId: 'g' },
      { id: '23', label: '23', comboId: 'g' },
      { id: '24', label: '24', comboId: 'g' },
      { id: '25', label: '25', comboId: 'g' },
      { id: '26', label: '26', comboId: 'g' },
      { id: '27', label: '27', comboId: 'g' },
      { id: '28', label: '28', comboId: 'g' },
      { id: '29', label: '29', comboId: 'g' },
      { id: '30', label: '30', comboId: 'h' },
      { id: '31', label: '31', comboId: 'h' },
      { id: '32', label: '32', comboId: 'h' },
      { id: '33', label: '33', comboId: 'h' },
      { id: '34', label: '34', comboId: 'h' },
      { id: '35', label: '35', comboId: 'i' },
      { id: '36', label: '36', comboId: 'i' },
      { id: '37', label: '37', comboId: 'i' },
      { id: '38', label: '38', comboId: 'i' },
      { id: '39', label: '39', comboId: 'i' },
      { id: '40', label: '40', comboId: 'i' },
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
        source: '0',
        target: '7',
      },
      {
        source: '1',
        target: '5',
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
        source: '2',
        target: '8',
      },
      {
        source: '2',
        target: '9',
      },
      {
        source: '3',
        target: '21',
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
        source: '10',
        target: '23',
      },
      {
        source: '11',
        target: '26',
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
        source: '16',
        target: '29',
      },
      {
        source: '17',
        target: '34',
      },
      {
        source: '20',
        target: '27',
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
        source: '28',
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
        label: 'a',
      },
      {
        id: 'b',
        label: 'b',
      },
      {
        id: 'c',
        label: 'c',
      },
      {
        id: 'd',
        label: 'd',
      },
      {
        id: 'e',
        label: 'e',
      },
      {
        id: 'f',
        label: 'f',
      },
      {
        id: 'g',
        label: 'g',
      },
      {
        id: 'h',
        label: 'h',
      },
      {
        id: 'i',
        label: 'i',
      },
    ],
  };

  const [graph, setGraph] = useState<Graph>();

  useEffect(() => {
    if (graph) return;

    const hivediveBlue = '#2c25ff';

    const container = document.getElementById('lineage');
    if (!container) throw new ReferenceError(`Container for graph not found`);
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height || 800;

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
        type: 'polyline',
        size: 1,
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
        type: 'rect',
        style: {
          fillOpacity: 0.1,
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

    graphObj.on('node:click', (event) => {
      if (!event.item)
        throw new ReferenceError('Clicked node could not be referenced');

      const isNode = (object: any): object is INode => 'getEdges' in object;

      if (!isNode(event.item))
        throw new ReferenceError('Node does not have getEdges member');

      const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
      selectedEdges.forEach((edge) => edge.clearStates());

      getDependentEdges(event.item, true).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });

      getDependentEdges(event.item, false).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });
    });

    graphObj.data(data);
    graphObj.render();
    graphObj.fitView();

    setGraph(graphObj);
  }, []);

  return <Lineage id="lineage" />;
};
