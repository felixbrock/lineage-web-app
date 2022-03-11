import React, { ReactElement, useEffect, useState } from 'react';

import G6, { Graph} from '@antv/g6';
import { Lineage } from './lineage-items';

export default (): ReactElement => {
  // const data = {
  //   label: 'Modeling Methods',
  //   children: [
  //     {
  //       label: 'Classification',
  //       children: [
  //         {
  //           label: 'Logistic regression',
  //         },
  //         {
  //           label: 'Linear discriminant analysis',
  //         },
  //         {
  //           label: 'Rules',
  //         },
  //         {
  //           label: 'Decision trees',
  //         },
  //         {
  //           label: 'Naive Bayes',
  //         },
  //         {
  //           label: 'K nearest neighbor',
  //         },
  //         {
  //           label: 'Probabilistic neural network',
  //         },
  //         {
  //           label: 'Support vector machine',
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Consensus',
  //       children: [
  //         {
  //           label: 'Models diversity',
  //           children: [
  //             {
  //               label: 'Different initializations',
  //             },
  //             {
  //               label: 'Different parameter choices',
  //             },
  //             {
  //               label: 'Different architectures',
  //             },
  //             {
  //               label: 'Different modeling methods',
  //             },
  //             {
  //               label: 'Different training sets',
  //             },
  //             {
  //               label: 'Different feature sets',
  //             },
  //           ],
  //         },
  //         {
  //           label: 'Methods',
  //           children: [
  //             {
  //               label: 'Classifier selection',
  //             },
  //             {
  //               label: 'Classifier fusion',
  //             },
  //           ],
  //         },
  //         {
  //           label: 'Common',
  //           children: [
  //             {
  //               label: 'Bagging',
  //             },
  //             {
  //               label: 'Boosting',
  //             },
  //             {
  //               label: 'AdaBoost',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Regression',
  //       children: [
  //         {
  //           label: 'Multiple linear regression',
  //         },
  //         {
  //           label: 'Partial least squares',
  //         },
  //         {
  //           label: 'Multi-layer feedforward neural network',
  //         },
  //         {
  //           label: 'General regression neural network',
  //         },
  //         {
  //           label: 'Support vector regression',
  //         },
  //       ],
  //     },
  //   ],
  // };

  const data = {
    nodes: [
      {
        id: '0',
        label: '0',
      },
      {
        id: '1',
        label: '1',
      },
      {
        id: '2',
        label: '2',
      },
      {
        id: '3',
        label: '3',
      },
      {
        id: '4',
        label: '4',
      },
      {
        id: '5',
        label: '5',
      },
      {
        id: '6',
        label: '6',
      },
      {
        id: '7',
        label: '7',
      },
      {
        id: '8',
        label: '8',
      },
      {
        id: '9',
        label: '9',
      },
    ],
    edges: [
      {
        source: '0',
        target: '1',
      },
      {
        source: '0',
        target: '2',
      },
      {
        source: '1',
        target: '4',
      },
      {
        source: '0',
        target: '3',
      },
      {
        source: '3',
        target: '4',
      },
      {
        source: '4',
        target: '5',
      },
      {
        source: '4',
        target: '6',
      },
      {
        source: '5',
        target: '7',
      },
      {
        source: '5',
        target: '8',
      },
      {
        source: '8',
        target: '9',
      },
      {
        source: '2',
        target: '9',
      },
      {
        source: '3',
        target: '9',
      },
    ],
  };

  const [graph, setGraph] = useState<Graph>();

  useEffect(() => {
    if (graph) return;

    //   G6.registerNode(
    //     'tree-node',
    //     {
    //       drawLabel: (cfg: ModelConfig, group: IGroup) => {
    //         const text = group.addShape('text', {
    //           attrs: {
    //           },
    //           name: 'text-shape',
    //         });

    //         return text;
    //       },

    //       drawShape: function drawShape(cfg, group) {
    //         if (!group) throw new ReferenceError('Shape group not found');
    //         if (!cfg) throw new ReferenceError('Model config not found');
    //         const rect = group.addShape('rect', {
    //           attrs: {
    //             fill: '#fff',
    //             stroke: '#666',
    //             x: 0,
    //             y: 0,
    //             width: 1,
    //             height: 1,
    //           },
    //           name: 'rect-shape',
    //         });
    //         // if(!cfg.label) throw new ReferenceError('No label found for node');
    //         // if(typeof cfg.label === 'string') throw new ReferenceError('No label found for node');
    //         const content = cfg.label;
    //         const text = group.addShape('text', {
    //           attrs: {
    //             text: content,
    //             x: 0,
    //             y: 0,
    //             textAlign: 'left',
    //             textBaseline: 'middle',
    //             fill: '#666',
    //           },
    //           name: 'text-shape',
    //         });
    //         const bbox = text.getBBox();
    //         rect.attr({
    //           x: -bbox.width / 2 - 4,
    //           y: -bbox.height / 2 - 6,
    //           width: bbox.width + 12,
    //           height: bbox.height + 12,
    //         });
    //         text.attr({
    //           x: -bbox.width / 2,
    //           y: 0,
    //         });

    //         return rect;
    //       },
    //       update: (cfg, item) => {
    //         const group = item.getContainer();
    //         const icon = group.find((e) => e.get('name') === 'collapse-icon');
    //         icon.attr(
    //           'symbol',
    //           cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse
    //         );
    //       },
    //     },
    //     'single-node'
    //   );

    const container = document.getElementById('lineage');
    if (!container) throw new ReferenceError(`Container for graph not found`);
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    //   const graphObj = new G6.TreeGraph({
    //     container: container,
    //     width,
    //     height,
    //     modes: {
    //       default: [
    //         {
    //           type: 'collapse-expand',
    //           onChange: function onChange(item, collapsed) {
    //             if (!item) throw new ReferenceError('onchange item missing');
    //             const dataObj = item.get('model');
    //             graphObj.updateItem(item, {
    //               collapsed,
    //             });
    //             dataObj.collapsed = collapsed;
    //             return true;
    //           },
    //         },
    //         'drag-canvas',
    //         'zoom-canvas',
    //       ],
    //     },
    //     defaultNode: {
    //       type: 'tree-node',
    //       anchorPoints: [
    //         [0, 0.5],
    //         [1, 0.5],
    //       ],
    //     },
    //     defaultEdge: {
    //       type: 'cubic-horizontal',
    //       style: {
    //         stroke: '#A3B1BF',
    //       },
    //     },
    //     layout: {
    //       type: 'compactBox',
    //       direction: 'LR',
    //       getId: function getId(d: any) {
    //         return d.id;
    //       },
    //       getHeight: function getHeight() {
    //         return 16;
    //       },
    //       getWidth: function getWidth() {
    //         return 16;
    //       },
    //       getVGap: function getVGap() {
    //         return 20;
    //       },
    //       getHGap: function getHGap() {
    //         return 80;
    //       },
    //     },
    //   });

    //   if (typeof window !== 'undefined')
    //     window.onresize = () => {
    //       if (!graphObj || graphObj.get('destroyed')) return;
    //       if (!container || !container.scrollWidth || !container.scrollHeight)
    //         return;
    //       graphObj.changeSize(container.scrollWidth, container.scrollHeight);
    //     };

    const graphObj = new G6.Graph({
      container,
      width,
      height,
      fitView: true,
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'UL',
        controlPoints: true,
        nodesepFunc: () => 1,
        ranksepFunc: () => 1,
      },
      defaultNode: {
        size: [30, 20],
        type: 'rect',
        style: {
          lineWidth: 2,
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
        },
      },
      defaultEdge: {
        type: 'polyline',
        size: 1,
        color: '#e2e2e2',
        style: {
          endArrow: {
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#e2e2e2',
          },
          radius: 20,
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

    graphObj.data(data);
    graphObj.render();
    graphObj.fitView();

    setGraph(graphObj);
  }, []);

  return <Lineage id="lineage" />;
};
