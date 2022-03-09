import React, { ReactElement, useEffect, useState } from 'react';
import { BootstrapButton, Lineage } from './lineage-items';

import G6, { Graph } from '@antv/g6';
import ReactDOM from 'react-dom';

export default (): ReactElement => {
  const ref = React.useRef(null);
  const [graph, setGraph] = useState<Graph>();

  const data = {
    nodes: [
      {
        id: 'node1',
        label: 'Circle1',
        x: 150,
        y: 150,
      },
      {
        id: 'node2',
        label: 'Circle2',
        x: 400,
        y: 150,
      },
    ],
    edges: [
      {
        source: 'node1',
        target: 'node2',
      },
    ],
  };

  useEffect(() => {
    if (graph) return;

    const graphObj = new G6.Graph({
      container: ReactDOM.findDOMNode(ref.current).,
      width: 1200,
      height: 800,
      modes: {
        default: ['drag-canvas'],
      },
      layout: {
        type: 'dagre',
        direction: 'LR',
      },
      defaultNode: {
        type: 'node',
        labelCfg: {
          style: {
            fill: '#000000A6',
            fontSize: 10,
          },
        },
        style: {
          stroke: '#72CC4A',
          width: 150,
        },
      },
      defaultEdge: {
        type: 'polyline',
      },
    });
    graphObj.data(data);
    graphObj.render();

    setGraph(graphObj);
  }, [graph]);

  return (
    <Lineage>
      <BootstrapButton>meow</BootstrapButton>
      {graph}
    </Lineage>
  );
};
