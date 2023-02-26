import G6, {
  ComboConfig,
  EdgeConfig,
  Graph,
  GraphData,
  GraphOptions,
  ICombo,
  IEdge,
  INode,
  NodeConfig,
} from '@antv/g6';
import { ReactElement, useEffect, useState } from 'react';
import appConfig from '../../../config';
import ColumnDto from '../../../infrastructure/lineage-api/columns/column-dto';
import DashboardDto from '../../../infrastructure/lineage-api/dashboards/dashboard-dto';
import DependencyDto from '../../../infrastructure/lineage-api/dependencies/dependency-dto';
import MaterializationDto from '../../../infrastructure/lineage-api/materializations/materialization-dto';
import {
  defaultAnomalyStates,
  defaultData,
  defaultMaterializations,
} from '../test-data';

enum DataLoadNodeType {
  Self = 'SELF',
  Parent = 'PARENT',
  Child = 'CHILD',
}

export interface SelectedElement {
  id: string;
  type: LineageElement;
  comboId?: string;
}

export interface SourceData {
  mats: MaterializationDto[];
  cols: ColumnDto[];
  dashboards: DashboardDto[];
}
export interface GraphSourceData extends SourceData {
  selectedEl?: SelectedElement;
  dependencies: DependencyDto[];
}

export type LineageElement = 'node' | 'combo';

const tableLevelLineageIdSuffix = 'table-level-lineage';

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

const setTableLevelLineagePlaceholderState = (g: Graph): Graph => {
  const localGraph = g;
  localGraph.getNodes().forEach((node) => {
    const nodeId = node.getID();
    if (nodeId.includes(tableLevelLineageIdSuffix))
      localGraph.setItemState(nodeId, 'tableLevelLineagePlaceholder', true);
  });

  return localGraph;
};

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

const loadData = (
  nodeId: string,
  nodeType: DataLoadNodeType,
  coveredNodeIds: string[],
  coveredComboIds: string[],
  data: GraphData
): GraphData => {
  const localCoveredNodeIds = coveredNodeIds;
  const localCoveredComboIds = coveredComboIds;

  if (!data.nodes || !data.nodes.length) return data;
  const dataNodes = data.nodes;

  if (!data.edges || !data.edges.length) return data;
  const dataEdges = data.edges;

  if (!data.combos || !data.combos.length) return data;
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

  /* For rendering column level lineage only */
  graphData.nodes = graphData.nodes.filter((node) =>
    coveredNodeIds.includes(node.id)
  );

  return graphData;
};

/**
 * format the string
 * @param {string} string The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (
  string: string | undefined,
  maxWidth: number,
  fontSize: number
): string => {
  if (!string) return '';
  let currentWidth = 0;
  let result = string;
  string.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) return '';

    currentWidth += G6.Util.getLetterWidth(letter, fontSize);

    if (currentWidth > maxWidth) {
      result = `${string.substring(0, i)}\n${fittingString(
        string.substring(i),
        maxWidth,
        fontSize
      )}`;
    }
  });
  return result;
};

export default ({
  graphSourceData,
  dataAvailable,
  closeMatSidePanelCallback,
  closeColSidePanelCallback,
  closeIntegrationSidePanelCallback,
  setIsRightPanelShownCallback,
  nodeSelectCallback,
  comboSelectCallback,
  comboSelectChangeCallback,
  graphBuiltCallback,
}: {
  graphSourceData?: GraphSourceData;
  dataAvailable: boolean;
  closeMatSidePanelCallback: () => void;
  closeColSidePanelCallback: () => void;
  closeIntegrationSidePanelCallback: () => void;
  setIsRightPanelShownCallback: (show: boolean) => void;
  nodeSelectCallback: (nodeId: string) => void;
  comboSelectCallback: (comboId: string, logicId?: string) => void;
  comboSelectChangeCallback: (comboId: string) => void;
  graphBuiltCallback: () => void;
}): ReactElement => {
  const [graph, setGraph] = useState<Graph>();

  const buildOptions = (container: HTMLElement): GraphOptions => {
    const hivediveBlue = '#6f47ef';

    const width = window.innerWidth;
    const height = window.innerHeight;

    const grid = new G6.Grid();

    return {
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
        ranksep: 150,
      },
      defaultNode: {
        // size: [30, 20],
        type: 'rect',
        style: {
          width: 550,
          lineWidth: 1,
          stroke: '#ababab',
          fill: '#fafaff',
          radius: 5,
          opacity: dataAvailable ? 1 : 0,
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
        tableLevelLineagePlaceholder: {
          fill: hivediveBlue,
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
        padding: [40, 20, 10, 20],
        fixCollapseSize: [80, 10],
        style: {
          fill: '#112227',
          radius: 5,
        },
        labelCfg: {
          style: {
            fontSize: 18,
            fill: '#ffffff',
          },
        },
      },
      comboStateStyles: {
        selected: {
          stroke: hivediveBlue,
          lineWidth: 1,
          shadowBlur: 5,
          fill: '#000000',
        },
      },
      plugins: [grid],
    };
  };

  const clearEdgeStates = (graphObj: Graph) => {
    const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
    const selectedAnomalyEdges = graphObj.findAllByState(
      'edge',
      'anomalyNodeSelected'
    );
    const edges = selectedEdges.concat(selectedAnomalyEdges);
    edges.forEach((edge) => edge.clearStates());
  };

  const clearStates = (graphObj: Graph) => {
    closeMatSidePanelCallback();
    closeColSidePanelCallback();
    closeIntegrationSidePanelCallback();
    setIsRightPanelShownCallback(false);
    clearEdgeStates(graphObj);
  };

  const handleNodeSelectChange = (
    nodeId: string,
    graphObj: Graph,
    data: GraphData
  ): void => {
    closeMatSidePanelCallback();
    closeIntegrationSidePanelCallback();
    setIsRightPanelShownCallback(false);

    clearEdgeStates(graphObj);

    nodeSelectCallback(nodeId);

    graphObj.set('latestZoom', graphObj.getZoom());
    graphObj.data(loadData(nodeId, DataLoadNodeType.Self, [], [], data));

    graphObj.set('selectedElementId', nodeId);

    setGraph(graphObj);
  };

  const handleComboSelectChange = async (
    comboId: string,
    graphObj: Graph,
    initalSelect: boolean
  ): Promise<void> => {
    closeColSidePanelCallback();

    clearEdgeStates(graphObj);

    const rawData: GraphSourceData = graphObj.get('rawData');

    const materializationsToSearch = appConfig.react.showRealData
      ? rawData.mats
      : defaultMaterializations;

    const matCombo = materializationsToSearch.find((el) => el.id === comboId);

    const dashCombo = rawData.dashboards.find(
      (dashboard) => dashboard.url === comboId
    );

    const combo = matCombo || dashCombo;

    if (!combo)
      throw new ReferenceError(
        'Materialization object for selected combo not found'
      );

    comboSelectCallback(
      comboId,
      'logicId' in combo ? combo.logicId : undefined
    );

    if (!initalSelect) comboSelectChangeCallback(comboId);

    graphObj.set('latestZoom', graphObj.getZoom());
    graphObj.set('selectedElementId', comboId);

    setGraph(graphObj);
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

  const buildGraph = (data: GraphData) => {
    const container = document.getElementById('lineageContainer');
    if (!container) throw new ReferenceError(`Container for graph not found`);

    const options = buildOptions(container);
    const localGraph = new G6.Graph(options);

    localGraph.set('rawData', graphSourceData);

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (localGraph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        localGraph.changeSize(container.scrollWidth, container.scrollHeight);
      };

    localGraph.on('afterlayout', () => {
      localGraph.emit('layout:finish');
    });

    const edgeHasAnomalousAncestor = (
      source: INode | ICombo,
      hasAnomalousAncestor: boolean
    ): boolean => {
      const parentEdges = source.getInEdges();

      parentEdges.forEach((parent) => {
        const parentSource = parent.getSource();

        const parentAnomalyState = defaultAnomalyStates.find(
          (state) => state.id === parentSource.getID()
        );
        if (!parentAnomalyState)
          throw new ReferenceError('Anomaly state not found');

        if (parentAnomalyState.hasNewAnomaly) {
          hasAnomalousAncestor = true;
          return hasAnomalousAncestor;
        }
        return edgeHasAnomalousAncestor(parentSource, hasAnomalousAncestor);
      });

      return hasAnomalousAncestor;
    };

    localGraph.on('layout:finish', () => {
      const selectedElementId = localGraph.get('selectedElementId');

      const isString = (item: unknown): item is string => !!item;

      if (!isString(selectedElementId))
        throw new ReferenceError('Self node id is not of type string');

      const element = localGraph.findById(selectedElementId);

      const isNode = (object: any): object is INode =>
        object && 'getType' in object && object.getType() === 'node';

      const isCombo = (object: any): object is ICombo =>
        object && 'getType' in object && object.getType() === 'combo';

      if (isNode(element)) {
        let anomalyState:
          | {
              id: string;
              hasNewAnomaly: boolean;
            }
          | undefined;
        if (!appConfig.react.showRealData) {
          anomalyState = defaultAnomalyStates.find(
            (state) => state.id === selectedElementId
          );
          if (!anomalyState)
            throw new ReferenceError('Anomaly state not found');
        }
        localGraph.setItemState(
          selectedElementId,
          anomalyState?.hasNewAnomaly ? 'anomalyNodeSelected' : 'selected',
          true
        );

        getDependentEdges(element, true).forEach((edge) => {
          let isAnomalous = false;
          const source = edge.getSource();
          const sourceId = source.getID();
          let sourceAnomalyState:
            | {
                id: string;
                hasNewAnomaly: boolean;
              }
            | undefined;
          if (!appConfig.react.showRealData) {
            sourceAnomalyState = defaultAnomalyStates.find(
              (state) => state.id === sourceId
            );
            if (!sourceAnomalyState)
              throw new ReferenceError('Anomaly state not found');

            isAnomalous = edgeHasAnomalousAncestor(source, false);
          }

          localGraph.setItemState(
            edge.getID(),
            sourceAnomalyState?.hasNewAnomaly || isAnomalous
              ? 'anomalyNodeSelected'
              : 'nodeSelected',
            true
          );
        });

        getDependentEdges(element, false).forEach((edge) => {
          const isAnomalous = edgeHasAnomalousAncestor(edge.getSource(), false);
          localGraph.setItemState(
            edge.getID(),
            anomalyState?.hasNewAnomaly || isAnomalous
              ? 'anomalyNodeSelected'
              : 'nodeSelected',
            true
          );
        });
      } else if (isCombo(element)) {
        localGraph.setItemState(selectedElementId, 'selected', true);
      }

      const zoom = localGraph.get('latestZoom') || 1;

      localGraph.zoom(zoom);

      localGraph.focusItem(element);
    });

    localGraph.on('nodeselectchange', (event) => {
      if (!event.target || !event.select) {
        clearStates(localGraph);
        return;
      }

      const localG = setTableLevelLineagePlaceholderState(localGraph);

      const isNode = (object: any): object is INode =>
        object && 'getType' in object && object.getType() === 'node';

      const id = isNode(event.target)
        ? event.target.getID()
        : event.target.get('id');

      if (id.includes(tableLevelLineageIdSuffix))
        handleComboSelectChange(
          id.replace(`-${tableLevelLineageIdSuffix}`, ''),
          localG,
          false
        );
      else if (event.target.get('type') === 'node')
        handleNodeSelectChange(id, localG, data);
      else if (event.target.get('type') === 'combo')
        handleComboSelectChange(id, localG, false);
    });

    const defaultNodeId =
      appConfig.react.showRealData && data && data.nodes && data.nodes.length
        ? data.nodes[0].id
        : '62715f907e3d8066494d409f';

    localGraph.set('selectedElementId', defaultNodeId);

    const selectedEdges = localGraph.findAllByState('edge', 'nodeSelected');
    const selectedAnomalyEdges = localGraph.findAllByState(
      'edge',
      'anomalyNodeSelected'
    );
    const edges = selectedEdges.concat(selectedAnomalyEdges);
    edges.forEach((edge) => edge.clearStates());

    nodeSelectCallback(defaultNodeId);
    localGraph.read(
      loadData(defaultNodeId, DataLoadNodeType.Self, [], [], data)
    );

    localGraph.set('latestZoom', localGraph.getZoom());
    localGraph.set('rawData', graphSourceData);

    setGraph(localGraph);
  };

  const updateGraph = async (selectedEl: SelectedElement, data: GraphData) => {
    if (!graph) return;

    let localGraph = graph;

    const selectedNodes = localGraph.findAllByState('node', 'selected');
    selectedNodes.forEach((node) => node.clearStates());
    selectedNodes.forEach((node) => node.clearStates());

    const selectedCombos = localGraph.findAllByState('combo', 'selected');
    selectedCombos.forEach((combo) => combo.clearStates());

    localGraph.set('rawData', graphSourceData);
    if (selectedEl.type === 'combo') localGraph.read(data);
    else if (selectedEl.type === 'node')
      localGraph.read(
        loadData(selectedEl.id, DataLoadNodeType.Self, [], [], data)
      );

    const target = localGraph.findById(selectedEl.id);

    localGraph = setTableLevelLineagePlaceholderState(localGraph);

    localGraph.setItemState(target, 'selected', true);

    if (selectedEl.type === 'node')
      handleNodeSelectChange(target.getID(), localGraph, data);
    else handleComboSelectChange(target.get('id'), localGraph, true);
  };

  const buildData = (): GraphData => {
    if (!graphSourceData)
      throw new Error('SourceData not found - Required to build GraphData');

    const matCombo = graphSourceData.mats.map(
      (materialization): ComboConfig => ({
        id: materialization.id,
        label: materialization.name,
      })
    );
    const colNodes = graphSourceData.cols.map(
      (column): NodeConfig => ({
        id: column.id,
        label: column.name,
        comboId: column.materializationId,
      })
    );
    const edges = graphSourceData.dependencies.map(
      (dependency): EdgeConfig => ({
        source: dependency.tailId,
        target: dependency.headId,
      })
    );

    const dashCombo = graphSourceData.dashboards.map(
      (dashboard): ComboConfig => ({
        id: dashboard.url ? dashboard.url : '',
        label: dashboard.name
          ? dashboard.name
          : fittingString(dashboard.url, 385, 18),
      })
    );
    const dashNodes = graphSourceData.dashboards.map(
      (dashboard): NodeConfig => ({
        id: dashboard.id,
        label: dashboard.columnName,
        comboId: dashboard.url,
      })
    );
    const combos = matCombo.concat(dashCombo).sort(compare);
    const nodes = colNodes.concat(dashNodes).sort(compare);

    return { combos, nodes, edges };
  };

  const getTableLevelLineage = (dataToAdjust: GraphData): GraphData => {
    const tableLevelLineageFixNodes: NodeConfig[] = dataToAdjust.combos
      ? dataToAdjust.combos.map((combo) => ({
          id: `${combo.id}-${tableLevelLineageIdSuffix}`,
          label: `<<<<< ${combo.label} >>>>>`,
          comboId: combo.id,
        }))
      : [];

    const comboIds = dataToAdjust.combos
      ? dataToAdjust.combos.map((combo) => combo.id)
      : [];

    return {
      combos: dataToAdjust.combos
        ? dataToAdjust.combos.map((combo) => ({ ...combo, label: '' }))
        : [],
      nodes: dataToAdjust.nodes
        ? tableLevelLineageFixNodes.concat(dataToAdjust.nodes)
        : tableLevelLineageFixNodes,
      edges: dataToAdjust.edges
        ? dataToAdjust.edges.map((edge) => ({
            source:
              edge.source && comboIds.includes(edge.source)
                ? `${edge.source}-${tableLevelLineageIdSuffix}`
                : edge.source,
            target:
              edge.target && comboIds.includes(edge.target)
                ? `${edge.target}-${tableLevelLineageIdSuffix}`
                : edge.target,
          }))
        : [],
    };
  };

  useEffect(() => {
    if (!graphSourceData) return;

    let data: GraphData;
    if (appConfig.react.showRealData) data = buildData();
    else {
      defaultData.nodes.sort(compare);
      defaultData.combos.sort(compare);

      data = defaultData;
    }

    data = getTableLevelLineage(data);

    if (!graph) {
      buildGraph(data);
      graphBuiltCallback();
    } else {
      if (!graphSourceData.selectedEl)
        throw new Error('Missing selected element');
      updateGraph(graphSourceData.selectedEl, data);
    }
  }, [graphSourceData]);

  useEffect(() => {
    if (!graph) return;
    graph.render();
  }, [graph]);

  return <div id="lineage" />;
};
