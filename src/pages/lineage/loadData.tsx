import { GraphData } from '@antv/g6';
import { DataLoadNodeType, getNodeIdsToExplore, compare } from './lineage';

/* Returns a  subset of existing data for a selected node */
export function loadData({ nodeId, nodeType, coveredNodeIds, coveredComboIds, data }: { nodeId: string; nodeType: DataLoadNodeType; coveredNodeIds: string[]; coveredComboIds: string[]; data: GraphData; }): GraphData {
  const localCoveredNodeIds = coveredNodeIds;
  const localCoveredComboIds = coveredComboIds;

  if (!data.nodes)
    return data;
  const dataNodes = data.nodes;

  if (!data.edges)
    return data;
  const dataEdges = data.edges;

  if (!data.combos)
    return data;
  const dataCombos = data.combos;

  const selfNode = dataNodes.find((element) => element.id === nodeId);
  if (!selfNode)
    throw new ReferenceError('Node not found');

  const graphData: GraphData = { nodes: [], edges: [], combos: [] };

  if (!graphData.nodes)
    throw new ReferenceError('Nodes not available');
  graphData.nodes.push(selfNode);

  localCoveredNodeIds.push(nodeId);

  if (selfNode.comboId && !localCoveredComboIds.includes(selfNode.comboId)) {
    const selfCombo = dataCombos.find(
      (element) => element.id === selfNode.comboId
    );
    if (!selfCombo)
      return data;

    if (!graphData.combos)
      throw new ReferenceError('Combos not available');
    graphData.combos.push(selfCombo);

    localCoveredComboIds.push(selfNode.comboId);
  }

  if (!graphData.edges)
    throw new ReferenceError('Edges not available');

  const isGraphData = (item: GraphData | undefined): item is GraphData => !!item;

  if (nodeType === DataLoadNodeType.Parent ||
    nodeType === DataLoadNodeType.Self) {
    const selfParentEdges = dataEdges.filter((edge) => edge.target === nodeId);

    graphData.edges.push(...selfParentEdges);

    const nodeIdsToExplore = getNodeIdsToExplore(
      { edgesToExplore: selfParentEdges, coveredNodeIds: localCoveredNodeIds });

    const dataSubsets = nodeIdsToExplore
      .map((id) => loadData(
        { nodeId: id, nodeType: DataLoadNodeType.Parent, coveredNodeIds: localCoveredNodeIds, coveredComboIds: localCoveredComboIds, data })
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

  if (nodeType === DataLoadNodeType.Child ||
    nodeType === DataLoadNodeType.Self) {
    const selfChildEdges = dataEdges.filter((edge) => edge.source === nodeId);

    graphData.edges.push(...selfChildEdges);

    const nodeIdsToExplore = getNodeIdsToExplore(
      { edgesToExplore: selfChildEdges, coveredNodeIds: localCoveredNodeIds });

    const dataSubsets = nodeIdsToExplore
      .map((id) => loadData(
        { nodeId: id, nodeType: DataLoadNodeType.Child, coveredNodeIds: localCoveredNodeIds, coveredComboIds: localCoveredComboIds, data })
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
    (node, index, self) => index === self.findIndex((element) => element.id === node.id)
  );

  graphData.nodes = cleanedNodes;

  graphData.nodes.sort(compare);
  if (graphData.combos)
    graphData.combos.sort(compare);

  return graphData;
}
export const showRealData = false;
export const lineageId = '627929bf08bead50ede9b472';
