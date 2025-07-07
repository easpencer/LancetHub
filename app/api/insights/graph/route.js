import { NextResponse } from 'next/server';
import { fetchCaseStudies, fetchPeopleData } from '../../../../utils/airtable';
import { createInsightsEngine } from '../../../../utils/insights-engine';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const graphType = searchParams.get('type') || 'full';
    const limit = parseInt(searchParams.get('limit') || '100');
    const includeKeywords = searchParams.get('includeKeywords') !== 'false';
    const includeSimilarity = searchParams.get('includeSimilarity') !== 'false';
    
    console.log('🕸️ Building knowledge graph...');
    
    // Fetch data
    const [caseStudies, people] = await Promise.all([
      fetchCaseStudies({ maxRecords: limit }),
      fetchPeopleData({ maxRecords: 50 })
    ]);
    
    if (caseStudies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No case studies found for graph construction'
      });
    }
    
    if (graphType === 'simple') {
      // Build a simplified graph without full analysis
      const nodes = [];
      const edges = [];
      const nodeMap = new Map();
      
      // Add case study nodes
      caseStudies.forEach(cs => {
        const node = {
          id: `cs_${cs.id}`,
          type: 'case-study',
          label: cs.Title,
          group: 1,
          data: {
            institution: cs.Institution,
            date: cs.Date,
            dimensions: cs['Resilient Dimensions']
          }
        };
        nodes.push(node);
        nodeMap.set(node.id, node);
      });
      
      // Add dimension nodes
      const dimensionNodes = new Map();
      caseStudies.forEach(cs => {
        if (cs['Resilient Dimensions']) {
          const dimensions = cs['Resilient Dimensions'].split(',').map(d => d.trim());
          dimensions.forEach(dim => {
            if (!dimensionNodes.has(dim)) {
              const node = {
                id: `dim_${dim.replace(/\s+/g, '_')}`,
                type: 'dimension',
                label: dim,
                group: 2
              };
              nodes.push(node);
              dimensionNodes.set(dim, node);
            }
            
            edges.push({
              source: `cs_${cs.id}`,
              target: dimensionNodes.get(dim).id,
              type: 'has-dimension',
              weight: 1
            });
          });
        }
      });
      
      // Add people nodes and connections
      people.forEach(person => {
        const node = {
          id: `person_${person.id}`,
          type: 'person',
          label: person.Name,
          group: 3,
          data: {
            role: person.Role,
            institution: person.Institution,
            expertise: person.Expertise
          }
        };
        nodes.push(node);
        
        // Connect people to institutions
        caseStudies.forEach(cs => {
          if (person.Institution && cs.Institution && 
              person.Institution.toLowerCase().includes(cs.Institution.toLowerCase())) {
            edges.push({
              source: node.id,
              target: `cs_${cs.id}`,
              type: 'affiliated-with',
              weight: 0.5
            });
          }
        });
      });
      
      return NextResponse.json({
        success: true,
        graphType: 'simple',
        graph: {
          nodes,
          edges,
          stats: {
            totalNodes: nodes.length,
            totalEdges: edges.length,
            caseStudies: caseStudies.length,
            dimensions: dimensionNodes.size,
            people: people.length
          }
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Full knowledge graph using insights engine
    const engine = await createInsightsEngine(caseStudies);
    const knowledgeGraph = engine.knowledgeGraph;
    
    // Add additional analysis data
    const graphStats = {
      totalNodes: knowledgeGraph.nodes.length,
      totalEdges: knowledgeGraph.edges.length,
      nodeTypes: {},
      edgeTypes: {},
      avgDegree: 0
    };
    
    // Calculate node type distribution
    knowledgeGraph.nodes.forEach(node => {
      graphStats.nodeTypes[node.type] = (graphStats.nodeTypes[node.type] || 0) + 1;
    });
    
    // Calculate edge type distribution and node degrees
    const nodeDegrees = new Map();
    knowledgeGraph.edges.forEach(edge => {
      graphStats.edgeTypes[edge.type] = (graphStats.edgeTypes[edge.type] || 0) + 1;
      
      // Update degrees
      nodeDegrees.set(edge.source, (nodeDegrees.get(edge.source) || 0) + 1);
      nodeDegrees.set(edge.target, (nodeDegrees.get(edge.target) || 0) + 1);
    });
    
    // Calculate average degree
    if (nodeDegrees.size > 0) {
      const totalDegree = Array.from(nodeDegrees.values()).reduce((sum, d) => sum + d, 0);
      graphStats.avgDegree = (totalDegree / nodeDegrees.size).toFixed(2);
    }
    
    // Find central nodes (highest degree)
    const centralNodes = Array.from(nodeDegrees.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([nodeId, degree]) => {
        const node = knowledgeGraph.nodes.find(n => n.id === nodeId);
        return {
          id: nodeId,
          label: node?.label || nodeId,
          type: node?.type || 'unknown',
          degree
        };
      });
    
    // Find clusters using connected components
    const clusters = findConnectedComponents(knowledgeGraph);
    
    // Generate graph insights
    const insights = [];
    
    if (centralNodes.length > 0) {
      insights.push({
        type: 'central-nodes',
        title: 'Most Connected Entities',
        message: `${centralNodes[0].label} is the most connected entity with ${centralNodes[0].degree} connections`,
        data: centralNodes.slice(0, 5)
      });
    }
    
    if (clusters.length > 1) {
      insights.push({
        type: 'graph-structure',
        title: 'Network Structure',
        message: `The knowledge graph contains ${clusters.length} distinct clusters, suggesting multiple research communities or focus areas`,
        data: {
          clusterCount: clusters.length,
          largestClusterSize: Math.max(...clusters.map(c => c.length))
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      graphType: 'full',
      graph: {
        nodes: knowledgeGraph.nodes,
        edges: knowledgeGraph.edges,
        stats: graphStats,
        centralNodes,
        clusters: clusters.length
      },
      insights,
      visualizationOptions: {
        layout: 'force-directed',
        nodeSize: 'degree',
        edgeWeight: 'similarity',
        clustering: true
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error building knowledge graph:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Helper function to find connected components
function findConnectedComponents(graph) {
  const adjacencyList = new Map();
  
  // Build adjacency list
  graph.nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });
  
  graph.edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target);
    adjacencyList.get(edge.target)?.push(edge.source);
  });
  
  const visited = new Set();
  const components = [];
  
  // DFS to find components
  function dfs(nodeId, component) {
    visited.add(nodeId);
    component.push(nodeId);
    
    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach(neighbor => {
      if (!visited.has(neighbor)) {
        dfs(neighbor, component);
      }
    });
  }
  
  // Find all components
  graph.nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const component = [];
      dfs(node.id, component);
      components.push(component);
    }
  });
  
  return components;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nodes, edges, analysisType = 'centrality' } = body;
    
    if (!nodes || !edges) {
      return NextResponse.json({
        success: false,
        error: 'Nodes and edges are required'
      }, { status: 400 });
    }
    
    let result;
    
    switch (analysisType) {
      case 'centrality':
        // Calculate various centrality measures
        result = calculateCentrality(nodes, edges);
        break;
        
      case 'communities':
        // Detect communities in the graph
        result = detectCommunities(nodes, edges);
        break;
        
      case 'paths':
        // Find shortest paths
        result = findShortestPaths(nodes, edges);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid analysis type'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      analysisType,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🔴 Error in graph analysis:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Graph analysis helper functions
function calculateCentrality(nodes, edges) {
  const degrees = new Map();
  
  // Calculate degree centrality
  edges.forEach(edge => {
    degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1);
    degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1);
  });
  
  const centrality = nodes.map(node => ({
    nodeId: node.id,
    label: node.label,
    degree: degrees.get(node.id) || 0,
    normalizedDegree: (degrees.get(node.id) || 0) / (nodes.length - 1)
  }));
  
  return {
    centrality: centrality.sort((a, b) => b.degree - a.degree),
    avgDegree: centrality.reduce((sum, n) => sum + n.degree, 0) / nodes.length
  };
}

function detectCommunities(nodes, edges) {
  // Simple community detection using connected components
  const components = findConnectedComponents({ nodes, edges });
  
  return {
    communities: components.map((component, idx) => ({
      id: idx,
      size: component.length,
      nodes: component
    })),
    modularity: calculateModularity(nodes, edges, components)
  };
}

function calculateModularity(nodes, edges, communities) {
  // Simplified modularity calculation
  const m = edges.length;
  let modularity = 0;
  
  communities.forEach(community => {
    const communitySet = new Set(community);
    let internalEdges = 0;
    let totalDegree = 0;
    
    edges.forEach(edge => {
      if (communitySet.has(edge.source) && communitySet.has(edge.target)) {
        internalEdges++;
      }
      if (communitySet.has(edge.source)) totalDegree++;
      if (communitySet.has(edge.target)) totalDegree++;
    });
    
    modularity += (internalEdges / m) - Math.pow(totalDegree / (2 * m), 2);
  });
  
  return modularity;
}

function findShortestPaths(nodes, edges) {
  // Sample implementation - find paths from first node
  const startNode = nodes[0];
  const distances = new Map();
  const paths = new Map();
  
  // Initialize distances
  nodes.forEach(node => {
    distances.set(node.id, node.id === startNode.id ? 0 : Infinity);
    paths.set(node.id, []);
  });
  
  // Build adjacency list
  const adjacencyList = new Map();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target);
    adjacencyList.get(edge.target)?.push(edge.source);
  });
  
  // BFS for shortest paths
  const queue = [startNode.id];
  paths.set(startNode.id, [startNode.id]);
  
  while (queue.length > 0) {
    const current = queue.shift();
    const currentDistance = distances.get(current);
    
    adjacencyList.get(current)?.forEach(neighbor => {
      if (distances.get(neighbor) === Infinity) {
        distances.set(neighbor, currentDistance + 1);
        paths.set(neighbor, [...paths.get(current), neighbor]);
        queue.push(neighbor);
      }
    });
  }
  
  return {
    source: startNode.id,
    distances: Array.from(distances.entries()).map(([nodeId, distance]) => ({
      nodeId,
      distance: distance === Infinity ? -1 : distance,
      path: paths.get(nodeId)
    }))
  };
}