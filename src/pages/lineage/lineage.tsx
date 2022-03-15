import React, { ReactElement, useEffect, useState } from 'react';

import G6, {
  ComboConfig,
  Graph,
  GraphData,
  ICombo,
  IEdge,
  INode,
} from '@antv/g6';
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

    const collapseIcon = (x: number, y: number, r: number) => {
      return [
        ['M', x - r, y],
        ['a', r, r, 0, 1, 0, r * 2, 0],
        ['a', r, r, 0, 1, 0, -r * 2, 0],
        ['M', x - r + 4, y],
        ['L', x - r + 2 * r - 4, y],
      ];
    };
    const expandIcon = (x: number, y: number, r: number) => {
      return [
        ['M', x - r, y],
        ['a', r, r, 0, 1, 0, r * 2, 0],
        ['a', r, r, 0, 1, 0, -r * 2, 0],
        ['M', x - r + 4, y],
        ['L', x - r + 2 * r - 4, y],
        ['M', x - r + r, y - r + 4],
        ['L', x, y + r - 4],
      ];
    };

    G6.registerCombo(
      'cRect',
      {
        drawShape: function drawShape(cfg, group) {
          if (!cfg) throw new ReferenceError('Combo config not available');
          if (!group) throw new ReferenceError('Combo group not available');

          const isComboConfig = (object: any): object is ComboConfig =>
            'padding' in object;

          if (!isComboConfig(cfg))
            throw new ReferenceError('Config is not of type combo config');

          cfg.padding = cfg.padding || [50, 20, 20, 20];
          // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
          const style = this.getShapeStyle(cfg);
          // Add a rect shape as the keyShape which is the same as the extended rect Combo
          if (!cfg.padding)
            throw new RangeError('Config padding cannot be null');

          const xRectFormula = (paddingRight: number, paddingLeft: number) =>
            -style.width / 2 - (paddingRight - paddingLeft) / 2;

          const xRect =
            cfg.padding instanceof Array
              ? xRectFormula(cfg.padding[3], cfg.padding[1])
              : xRectFormula(cfg.padding, cfg.padding);

          const yRectFormula = (paddingTop: number, paddingBottom: number) =>
            -style.height / 2 - (paddingTop - paddingBottom) / 2;
          const yRect =
            cfg.padding instanceof Array
              ? yRectFormula(cfg.padding[0], cfg.padding[2])
              : yRectFormula(cfg.padding, cfg.padding);

          const rect = group.addShape('rect', {
            attrs: {
              ...style,
              x: xRect,
              y: yRect,
              width: style.width,
              height: style.height,
            },
            // draggable: true,
            name: 'combo-keyShape',
          });

          const xMarkerFormula = (paddingLeft: number) =>
            style.width / 2 + paddingLeft;
          const xMarker =
            cfg.padding instanceof Array
              ? xMarkerFormula(cfg.padding[1])
              : xMarkerFormula(cfg.padding);

          const yMarkerFormula = (paddingBottom: number, paddingTop: number) =>
            (paddingBottom - paddingTop) / 2;
          const yMarker =
            cfg.padding instanceof Array
              ? yMarkerFormula(cfg.padding[2], cfg.padding[0])
              : yMarkerFormula(cfg.padding, cfg.padding);

          // Add the circle on the right
          group.addShape('marker', {
            attrs: {
              ...style,
              fill: '#fff',
              opacity: 1,
              // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
              x: xMarker,
              y: yMarker,
              r: 10,
              symbol: collapseIcon,
            },
            draggable: true,
            name: 'combo-marker-shape',
          });
          return rect;
        },
        // Define the updating logic of the right circle
        afterUpdate: function afterUpdate(cfg, combo) {
          if (!cfg) throw new ReferenceError('Combo config not found');

          if (!cfg.padding)
            throw new RangeError('Config padding cannot be null');

          if (!combo) throw new ReferenceError('Combo not found');

          const isComboConfig = (object: any): object is ComboConfig =>
            'padding' in object;

          if (!isComboConfig(cfg))
            throw new ReferenceError('Config is not of type combo config');

          const style = this.getShapeStyle(cfg);

          const xMarkerFormula = (paddingLeft: number) =>
            style.width / 2 + paddingLeft;
          const xMarker =
            cfg.padding instanceof Array
              ? xMarkerFormula(cfg.padding[1])
              : xMarkerFormula(cfg.padding);

          const yMarkerFormula = (paddingBottom: number, paddingTop: number) =>
            (paddingBottom - paddingTop) / 2;
          const yMarker =
            cfg.padding instanceof Array
              ? yMarkerFormula(cfg.padding[2], cfg.padding[0])
              : yMarkerFormula(cfg.padding, cfg.padding);

          const group = combo.get('group');
          // Find the circle shape in the graphics group of the Combo by name
          const marker = group.find(
            (element: any) => element.get('name') === 'combo-marker-shape'
          );
          // Update the position of the right circle
          marker.attr({
            // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
            x: xMarker,
            y: yMarker,
            // The property 'collapsed' in the combo data represents the collapsing state of the Combo
            // Update the symbol according to 'collapsed'
            symbol: cfg.collapsed ? expandIcon : collapseIcon,
          });
        },
      },
      'rect'
    );

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
        default: [
          'drag-canvas',
          'zoom-canvas',
          'click-select',
          {
            type: 'collapse-expand-combo',
            relayout: false,
          },
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
        type: 'cRect',
        // type: 'rect',
        // style: {
        //   height: 100,
        //   width: 100,
        // },
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

    // graphObj.on('node:click', (event) => {});

    // graphObj.on('combo:click', (event) => {});

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

    // collapse/expand when click the marker
    graphObj.on('combo:click', (event) => {
      if (event.target.get('name') === 'combo-marker-shape') {
        // graph.collapseExpandCombo(e.item.getModel().id);
        const isCombo = (object: any): object is ICombo => 'getNodes' in object;

        if (!isCombo(event.item))
          throw new ReferenceError('Event item is no combo');

        graphObj.collapseExpandCombo(event.item);
        if (graphObj.get('layout')) graphObj.layout();
        else graphObj.refreshPositions();
      }
    });

    graphObj.data(data);
    graphObj.render();

    // graphObj.getCombos().forEach(combo => graphObj.collapseCombo(combo.getID()));
    // graphObj.render();

    graphObj.fitView();

    setGraph(graphObj);
  }, []);

  return <Lineage id="lineage" />;
};
