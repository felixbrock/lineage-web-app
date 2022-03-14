import React, { ReactElement, useEffect, useState } from 'react';

import G6, { Graph, GraphData, INode } from '@antv/g6';
import { Lineage } from './lineage-items';

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
    ],
  };

  const [graph, setGraph] = useState<Graph>();

  useEffect(() => {
    if (graph) return;

    const container = document.getElementById('lineage');
    if (!container) throw new ReferenceError(`Container for graph not found`);
    const width = container.getBoundingClientRect().width;
    const height = container.getBoundingClientRect().height || 500;

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
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
        },
      },
      nodeStateStyles: {
        selected: {
          stroke: '#666',
          lineWidth: 2,
          fill: 'steelblue',
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
          radius: 50,
        },
      },
      edgeStateStyles: {
        selected: {
          style: {
            stroke: '#eb4034',
          }
        }
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
      console.log(event.item.getID());
      console.log(event);

      const isNode = (object: any): object is INode => 'getEdges' in object;

      if (!isNode(event.item))
        throw new ReferenceError('Node does not have getEdges member');

      const selectedEdges = graphObj.findAllByState('edge', 'selected');
      selectedEdges.forEach(edge => edge.clearStates());

      console.log(selectedEdges);
      
      event.item.getEdges().forEach((edge) => {
       graphObj.setItemState(edge.getID(), 'selected', true); 
      });
    });

    graphObj.on('nodeselectchange', (event) => {
      if(!event.select) console.log(event);
    });

    graphObj.data(data);
    graphObj.render();
    graphObj.fitView();

    setGraph(graphObj);
  }, []);

  return <Lineage id="lineage" />;
};
