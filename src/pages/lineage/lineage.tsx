import React, { ReactElement, useEffect, useState } from 'react';
import Logo from '../../components/top-nav/hivedive180.svg';
import G6, { EdgeConfig, Graph, GraphData, IEdge, INode } from '@antv/g6';
import './lineage.scss';
// import { FaSearch } from 'react-icons/fa';
// import Button from 'react-bootstrap/Button';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-pgsql';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';
// import LineageApiRepository from '../../infrastructure/lineage-api/lineage/lineage-api-repository';
// import MaterializationsApiRepository from '../../infrastructure/lineage-api/materializations/materializations-api-repository';
// import ColumnsApiRepository from '../../infrastructure/lineage-api/columns/columns-api-repository';
// import DependenciesApiRepository from '../../infrastructure/lineage-api/dependencies/dependencies-api-repository';
import LineageDto from '../../infrastructure/lineage-api/lineage/lineage-dto';
// import MaterializationDto from '../../infrastructure/lineage-api/materializations/materialization-dto';
// import ColumnDto from '../../infrastructure/lineage-api/columns/column-dto';
// import DependencyDto from '../../infrastructure/lineage-api/dependencies/dependency-dto';
// import LogicApiRepository from '../../infrastructure/lineage-api/logics/logics-api-repository';
import { defaultData, defaultSql } from './test-data';

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

const loadCombo = (comboId: string, data: GraphData): GraphData => {
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

/* Returns a  subset of existing data for a selected node */
const loadData = (
  nodeId: string,
  nodeType: DataLoadNodeType,
  coveredNodeIds: string[],
  coveredComboIds: string[],
  data: GraphData
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

  graphData.nodes = cleanedNodes.sort(compare);

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

const searchData = (data: GraphData) => {
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

// const buildData = (
//   materializations: MaterializationDto[],
//   columns: ColumnDto[],
//   dependencies: DependencyDto[]
// ): GraphData => {
//   const combos = materializations.map(
//     (materialization): ComboConfig => ({
//       id: materialization.id,
//       label: materialization.name,
//     })
//   );
//   const nodes = columns
//     .map(
//       (column): NodeConfig => ({
//         id: column.id,
//         label: column.name,
//         comboId: column.materializationId,
//       })
//     )
//     .sort(compare);
//   const edges = dependencies.map(
//     (dependency): EdgeConfig => ({
//       source: dependency.tailId,
//       target: dependency.headId,
//     })
//   );

//   return { combos, nodes, edges };
// };

export default (): ReactElement => {
  const [graph, setGraph] = useState<Graph>();
  const [sql, setSQL] = useState('');
  const [inputText, setInputText] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [info, setInfo] = useState('');
  const [lineage, setLineage] = useState<LineageDto>();
  // const [materializations, setMaterializations] = useState<
  //   MaterializationDto[]
  // >([]);
  // const [columns, setColumns] = useState<ColumnDto[]>([]);
  // const [dependencies, setDependencies] = useState<DependencyDto[]>([]);
  const [data, setData] = useState<GraphData>();
  const [readyToBuild, setReadyToBuild] = useState(false);

  const closeSidePanel = () => {
    setSQL('');

    const panel = document.getElementById('sqlSidepanel');
    if (!panel) throw new ReferenceError('SQL Panel does not exist');
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
  };

  const handleSearch = () => {
    if (!data) return;
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

    if (isOnlyCombo) graph.data(loadCombo(id, data));
    else graph.data(loadData(id, DataLoadNodeType.Self, [], [], data));

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
    if (!data) return;
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

      const comboIndex = searchData(data).find(
        (element) => element.type === 'combo' && element.label === combo
      );
      if (!comboIndex) throw new ReferenceError('Typed combo not found');

      index = searchData(data).filter(
        (element) =>
          element.type === 'node' && element.comboId === comboIndex.id
      );
    } else {
      index = searchData(data).filter((element) => element.type === 'combo');
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
    if (!readyToBuild) return;

    // setData(buildData(materializations, columns, dependencies));
    setData(defaultData);

    setReadyToBuild(false);
  }, [readyToBuild]);

  useEffect(() => {
    if (!sql) return;

    const panel = document.getElementById('sqlSidepanel');
    if (!panel) throw new ReferenceError('SQL Panel does not exist');
    panel.style.visibility = 'visible';
    panel.style.opacity = '1';
  }, [sql]);

  useEffect(() => {
    if (!data) return;

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
        ranksep: 90,
      },
      defaultNode: {
        // size: [30, 20],
        type: 'rect',
        style: {
          width: 300,
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

    graphObj.on('afterlayout', () => {    
      graphObj.emit('layout:finish');
    });

    graphObj.on('layout:finish', () => {
      const selectedNodeId = graphObj.get('selectedNodeId');     

      const isString = (item: unknown): item is string => !!item;

      if (!isString(selectedNodeId))
        throw new ReferenceError('Self node id is not of type string');

      const selfNode = graphObj.findById(selectedNodeId);

      const isNode = (object: any): object is INode => 'getEdges' in object;

      if (!isNode(selfNode)) throw new ReferenceError('Event item is no node');

      graphObj.setItemState(selectedNodeId, 'selected', true);

      getDependentEdges(selfNode, true).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });

      getDependentEdges(selfNode, false).forEach((edge) => {
        graphObj.setItemState(edge.getID(), 'nodeSelected', true);
      });

      graphObj.focusItem(selfNode);
      
      graphObj.zoom(graphObj.get('latestZoom') || 1);
      
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

        const selectedNodeId = event.target.getID();
        graphObj.data(loadData(selectedNodeId, DataLoadNodeType.Self, [], [], data));

        graphObj.set('latestZoom', graphObj.getZoom());
        graphObj.set('selectedNodeId', selectedNodeId);

        graphObj.render();
      } else if (event.select && event.target.get('type') === 'combo') {
        const selectedEdges = graphObj.findAllByState('edge', 'nodeSelected');
        selectedEdges.forEach((edge) => edge.clearStates());

        // const comboId = event.target.get('id');

        // const combo = materializations.find(
        //   (materialization) => materialization.id === comboId
        // );

        // if (!combo)
        //   throw new ReferenceError(
        //     'Materialization object for selected combo not found'
        //   );

        // console.log(combo.logicId);

        // LogicApiRepository.getOne(combo.logicId, 'todo-replace').then(
        //   (logicDto) => {
        //     console.log(logicDto?.sql);

        //     if (!logicDto)
        //       throw new ReferenceError('Not able to retrieve logic object');

        //     setSQL(logicDto.sql);
        //   }
        // );

        setSQL(defaultSql);

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

    const defaultNodeId = '627160657e3d8066494d4190';
    // const defaultData = loadData(
    //   defaultNodeId,
    //   DataLoadNodeType.Self,
    //   [],
    //   [],
    //   data
    // );

    graphObj.data(data);

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

    graphObj.set('selectedNodeId', defaultNodeId);

    graphObj.render();

    setGraph(graphObj);
  }, [data]);

  useEffect(() => {
    if (lineage) return;
    setLineage({ id: 'todo', createdAt: 1 });
    setReadyToBuild(true);

    // const lineageId = '62715f897e3d8066494d3f9e';

    // LineageApiRepository.getOne(lineageId, 'todo-replace')
    //   .then((lineageDto) => {
    //     if (!lineageDto)
    //       throw new TypeError('Queried lineage object not found');
    //     setLineage(lineageDto);
    //     return MaterializationsApiRepository.getBy(
    //       new URLSearchParams({ lineageId: lineageId }),
    //       'todo-replace'
    //     );
    //   })
    //   .then((materializationDtos) => {
    //     setMaterializations(materializationDtos);
    //     return ColumnsApiRepository.getBy(
    //       new URLSearchParams({ lineageId: lineageId }),
    //       'todo-replace'
    //     );
    //   })
    //   .then((columnDtos) => {
    //     setColumns(columnDtos);
    //     return DependenciesApiRepository.getBy(
    //       new URLSearchParams({ lineageId: lineageId }),
    //       'todo-replace'
    //     );
    //   })
    //   .then((dependencyDtos) => {
    //     setDependencies(dependencyDtos);
    //     setReadyToBuild(true);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return (
    <div id="lineageContainer">
      <div className="navbar">
        <img className="logo" src={Logo} alt="logo" />
        <div id="searchbar" className="searchbar">
          <div className="inputWrapper">
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
      {/* {[false, 'sm', 'md', 'lg', 'xl', 'xxl'].map((expand) => (
    <Navbar key={expand} bg="light" expand={expand} className="mb-3">
      <Container fluid>
        <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="#action1">Home</Nav.Link>
              <Nav.Link href="#action2">Link</Nav.Link>
              <NavDropdown
                title="Dropdown"
                id={`offcanvasNavbarDropdown-expand-${expand}`}
              >
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  ))} */}
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
