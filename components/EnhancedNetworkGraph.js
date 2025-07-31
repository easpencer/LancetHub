'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import styles from './EnhancedNetworkGraph.module.css';

const EnhancedNetworkGraph = ({ 
  caseStudies, 
  width = 1200, 
  height = 700,
  onNodeClick,
  onLinkClick,
  highlightNode = null
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width, height });
  const [graphStats, setGraphStats] = useState({ nodes: 0, edges: 0 });
  const [filterOptions, setFilterOptions] = useState({
    showCaseStudies: true,
    showDimensions: true,
    showInstitutions: true,
    showKeywords: true,
    showPeople: true,
    minConnections: 0
  });
  const [layoutType, setLayoutType] = useState('force'); // 'force', 'radial', 'hierarchical'

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ 
          width: rect.width - 20, 
          height: rect.height - 20 
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build enhanced graph data
  const buildEnhancedGraphData = useCallback((studies) => {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();
    
    // Statistics tracking
    const stats = {
      byType: {},
      avgConnections: 0,
      maxConnections: 0
    };

    // Add case study nodes with enhanced properties
    studies.forEach(study => {
      const node = {
        id: `study-${study.id}`,
        label: study.Title || 'Untitled',
        type: 'case-study',
        radius: 8,
        data: study,
        connections: 0,
        importance: 0
      };
      nodes.push(node);
      nodeMap.set(node.id, node);
      stats.byType['case-study'] = (stats.byType['case-study'] || 0) + 1;
    });

    // Add dimension nodes with hierarchy
    const dimensionHierarchy = new Map();
    studies.forEach(study => {
      if (study.Dimensions) {
        const dims = study.Dimensions.split(',').map(d => d.trim());
        dims.forEach(dim => {
          if (!dimensionHierarchy.has(dim)) {
            const node = {
              id: `dim-${dim}`,
              label: dim,
              type: 'dimension',
              radius: 15,
              count: 0,
              connections: 0,
              importance: 0
            };
            dimensionHierarchy.set(dim, node);
            nodes.push(node);
            nodeMap.set(node.id, node);
            stats.byType['dimension'] = (stats.byType['dimension'] || 0) + 1;
          }
          
          const dimNode = dimensionHierarchy.get(dim);
          dimNode.count++;
          dimNode.connections++;
          
          // Create weighted link
          links.push({
            source: `study-${study.id}`,
            target: `dim-${dim}`,
            type: 'has-dimension',
            value: 1,
            strength: 0.8
          });
          
          nodeMap.get(`study-${study.id}`).connections++;
        });
      }
    });

    // Add institution nodes with size based on contribution
    const institutions = new Map();
    studies.forEach(study => {
      if (study.Institution) {
        if (!institutions.has(study.Institution)) {
          const node = {
            id: `inst-${study.Institution}`,
            label: study.Institution,
            type: 'institution',
            radius: 12,
            count: 0,
            connections: 0,
            importance: 0
          };
          institutions.set(study.Institution, node);
          nodes.push(node);
          nodeMap.set(node.id, node);
          stats.byType['institution'] = (stats.byType['institution'] || 0) + 1;
        }
        
        const instNode = institutions.get(study.Institution);
        instNode.count++;
        instNode.connections++;
        instNode.radius = Math.min(20, 10 + instNode.count * 2);
        
        links.push({
          source: `study-${study.id}`,
          target: `inst-${study.Institution}`,
          type: 'from-institution',
          value: 1,
          strength: 0.7
        });
        
        nodeMap.get(`study-${study.id}`).connections++;
      }
    });

    // Add keyword nodes with importance scoring
    const keywordImportance = new Map();
    studies.forEach(study => {
      if (study.Keywords) {
        const keywords = study.Keywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
          keywordImportance.set(keyword, (keywordImportance.get(keyword) || 0) + 1);
        });
      }
    });

    // Get top keywords by importance
    const topKeywords = Array.from(keywordImportance.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30);

    topKeywords.forEach(([keyword, count]) => {
      const node = {
        id: `kw-${keyword}`,
        label: keyword,
        type: 'keyword',
        radius: Math.min(12, 5 + Math.sqrt(count) * 2),
        count: count,
        connections: 0,
        importance: count / studies.length
      };
      nodes.push(node);
      nodeMap.set(node.id, node);
      stats.byType['keyword'] = (stats.byType['keyword'] || 0) + 1;
    });

    // Create keyword links
    studies.forEach(study => {
      if (study.Keywords) {
        const keywords = study.Keywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
          if (nodeMap.has(`kw-${keyword}`)) {
            links.push({
              source: `study-${study.id}`,
              target: `kw-${keyword}`,
              type: 'has-keyword',
              value: 0.5,
              strength: 0.5
            });
            
            nodeMap.get(`study-${study.id}`).connections++;
            nodeMap.get(`kw-${keyword}`).connections++;
          }
        });
      }
    });

    // Add people nodes if available
    const peopleMap = new Map();
    studies.forEach(study => {
      if (study.People || study.Contributors) {
        const people = study.Contributors || (Array.isArray(study.People) ? study.People : [study.People]);
        people.forEach(person => {
          const personName = typeof person === 'object' ? person.name : person;
          if (personName && !peopleMap.has(personName)) {
            peopleMap.set(personName, {
              id: `person-${personName}`,
              label: personName,
              type: 'person',
              radius: 10,
              connections: 0,
              studies: []
            });
          }
          
          if (personName && peopleMap.has(personName)) {
            const personNode = peopleMap.get(personName);
            personNode.studies.push(study.id);
            personNode.connections++;
          }
        });
      }
    });

    // Add people nodes to graph
    peopleMap.forEach(person => {
      nodes.push(person);
      nodeMap.set(person.id, person);
      stats.byType['person'] = (stats.byType['person'] || 0) + 1;
      
      person.studies.forEach(studyId => {
        links.push({
          source: `study-${studyId}`,
          target: person.id,
          type: 'authored-by',
          value: 1,
          strength: 0.6
        });
      });
    });

    // Calculate cross-connections (dimension-dimension, institution-institution)
    const dimensionPairs = new Map();
    studies.forEach(study => {
      if (study.Dimensions) {
        const dims = study.Dimensions.split(',').map(d => d.trim());
        for (let i = 0; i < dims.length - 1; i++) {
          for (let j = i + 1; j < dims.length; j++) {
            const key = [dims[i], dims[j]].sort().join('|');
            dimensionPairs.set(key, (dimensionPairs.get(key) || 0) + 1);
          }
        }
      }
    });

    // Add dimension co-occurrence links
    dimensionPairs.forEach((count, key) => {
      if (count >= 2) { // Only show if co-occurs in 2+ studies
        const [dim1, dim2] = key.split('|');
        links.push({
          source: `dim-${dim1}`,
          target: `dim-${dim2}`,
          type: 'co-occurs',
          value: count,
          strength: 0.3
        });
      }
    });

    // Calculate node importance scores
    nodes.forEach(node => {
      // PageRank-like importance calculation
      node.importance = node.connections / Math.max(1, links.length) * 100;
      
      // Adjust radius based on importance
      if (node.type === 'case-study') {
        node.radius = 6 + Math.sqrt(node.importance) * 2;
      }
    });

    // Calculate statistics
    const totalConnections = nodes.reduce((sum, node) => sum + node.connections, 0);
    stats.avgConnections = totalConnections / nodes.length;
    stats.maxConnections = Math.max(...nodes.map(n => n.connections));

    return { 
      nodes, 
      links, 
      stats: {
        nodes: nodes.length,
        edges: links.length,
        ...stats
      }
    };
  }, []);

  useEffect(() => {
    if (!caseStudies || caseStudies.length === 0) {
      console.log('EnhancedNetworkGraph: No case studies provided');
      return;
    }

    console.log('EnhancedNetworkGraph: Building graph with', caseStudies.length, 'studies');

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Build graph data
    const graphData = buildEnhancedGraphData(caseStudies);
    setGraphStats(graphData.stats);

    // Filter nodes and links based on options
    const filteredNodes = graphData.nodes.filter(node => {
      if (!filterOptions[`show${node.type.charAt(0).toUpperCase() + node.type.slice(1).replace('-', '')}s`]) {
        return false;
      }
      if (node.connections < filterOptions.minConnections) {
        return false;
      }
      return true;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = graphData.links.filter(link => 
      filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    );

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Add background
    svg.append("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("fill", "#f8f9fa");

    // Create container for zoom/pan
    const g = svg.append("g");
    
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create force simulation based on layout type
    let simulation;
    
    if (layoutType === 'force') {
      simulation = d3.forceSimulation(filteredNodes)
        .force("link", d3.forceLink(filteredLinks)
          .id(d => d.id)
          .distance(d => 50 + (1 - d.strength) * 50)
          .strength(d => d.strength))
        .force("charge", d3.forceManyBody()
          .strength(d => -100 - d.importance * 5))
        .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
        .force("collision", d3.forceCollide()
          .radius(d => d.radius + 5));
    } else if (layoutType === 'radial') {
      // Radial layout - group by type
      const typeGroups = d3.group(filteredNodes, d => d.type);
      const angleStep = (2 * Math.PI) / typeGroups.size;
      let angleIndex = 0;
      
      typeGroups.forEach((nodes, type) => {
        const angle = angleIndex * angleStep;
        const radius = 200;
        nodes.forEach((node, i) => {
          const nodeAngle = angle + (i / nodes.length) * angleStep;
          node.fx = dimensions.width / 2 + Math.cos(nodeAngle) * radius;
          node.fy = dimensions.height / 2 + Math.sin(nodeAngle) * radius;
        });
        angleIndex++;
      });
      
      simulation = d3.forceSimulation(filteredNodes)
        .force("link", d3.forceLink(filteredLinks).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-50));
    }

    // Create link elements
    const link = g.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter().append("line")
      .attr("class", styles.link)
      .attr("stroke", d => getLinkColor(d.type))
      .attr("stroke-opacity", d => 0.3 + d.strength * 0.4)
      .attr("stroke-width", d => Math.sqrt(d.value || 1))
      .on("click", (event, d) => {
        if (onLinkClick) onLinkClick(d);
      });

    // Create node groups
    const node = g.append("g")
      .selectAll("g")
      .data(filteredNodes)
      .enter().append("g")
      .attr("class", styles.node)
      .call(drag(simulation));

    // Add node circles
    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => getNodeColor(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.9)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleNodeClick);

    // Add node labels
    node.append("text")
      .text(d => d.label)
      .attr("x", 0)
      .attr("y", d => d.radius + 15)
      .attr("text-anchor", "middle")
      .attr("class", styles.nodeLabel)
      .style("font-size", d => {
        if (d.type === 'case-study') return "10px";
        if (d.type === 'dimension') return "12px";
        return "11px";
      })
      .style("font-weight", d => d.importance > 10 ? "bold" : "normal")
      .style("pointer-events", "none");

    // Add importance indicators for high-importance nodes
    node.filter(d => d.importance > 20)
      .append("circle")
      .attr("r", d => d.radius + 5)
      .attr("fill", "none")
      .attr("stroke", getNodeColor(d => d.type))
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.5);

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", styles.tooltip)
      .style("opacity", 0);

    function handleMouseOver(event, d) {
      setHoveredNode(d);
      
      // Highlight connected nodes and links
      node.style("opacity", n => isConnected(d, n) ? 1 : 0.2);
      link.style("opacity", l => 
        (l.source === d || l.target === d || l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1
      );
      
      // Show enhanced tooltip
      tooltip.transition()
        .duration(200)
        .style("opacity", .95);
      
      tooltip.html(getEnhancedTooltipContent(d))
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    }

    function handleMouseOut() {
      setHoveredNode(null);
      
      // Reset opacity
      node.style("opacity", 0.9);
      link.style("opacity", d => 0.3 + d.strength * 0.4);
      
      // Hide tooltip
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    }

    function handleNodeClick(event, d) {
      setSelectedNode(d);
      if (onNodeClick) onNodeClick(d);
      event.stopPropagation();
    }

    // Check if nodes are connected
    function isConnected(a, b) {
      if (a === b) return true;
      return filteredLinks.some(link => 
        (link.source === a && link.target === b) || 
        (link.source === b && link.target === a) ||
        (link.source.id === a.id && link.target.id === b.id) ||
        (link.source.id === b.id && link.target.id === a.id)
      );
    }

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        if (layoutType !== 'radial') {
          d.fx = null;
          d.fy = null;
        }
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Click on background to deselect
    svg.on("click", () => {
      setSelectedNode(null);
    });

    // Highlight specific node if provided
    if (highlightNode) {
      const nodeToHighlight = filteredNodes.find(n => n.id === highlightNode);
      if (nodeToHighlight) {
        setSelectedNode(nodeToHighlight);
        // Center on highlighted node
        const scale = 1.5;
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity
            .translate(dimensions.width / 2, dimensions.height / 2)
            .scale(scale)
            .translate(-nodeToHighlight.x, -nodeToHighlight.y)
        );
      }
    }

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [caseStudies, dimensions, filterOptions, layoutType, highlightNode, buildEnhancedGraphData, onNodeClick, onLinkClick]);

  function getNodeColor(type) {
    const colors = {
      'case-study': '#3498db',
      'dimension': '#e74c3c',
      'institution': '#f39c12',
      'keyword': '#27ae60',
      'person': '#9b59b6'
    };
    return colors[type] || '#95a5a6';
  }

  function getLinkColor(type) {
    const colors = {
      'has-dimension': '#e74c3c',
      'from-institution': '#f39c12',
      'has-keyword': '#27ae60',
      'authored-by': '#9b59b6',
      'co-occurs': '#95a5a6'
    };
    return colors[type] || '#bdc3c7';
  }

  function getEnhancedTooltipContent(node) {
    let content = `<div class="${styles.tooltipContent}">`;
    content += `<h4>${node.label}</h4>`;
    content += `<p class="${styles.nodeType}">Type: ${node.type}</p>`;
    
    if (node.count) {
      content += `<p>Occurrences: <strong>${node.count}</strong></p>`;
    }
    
    if (node.connections) {
      content += `<p>Connections: <strong>${node.connections}</strong></p>`;
    }
    
    if (node.importance > 0) {
      content += `<p>Importance: <strong>${node.importance.toFixed(1)}%</strong></p>`;
    }
    
    if (node.data) {
      if (node.data.Description) {
        content += `<div class="${styles.description}">${node.data.Description.substring(0, 150)}...</div>`;
      }
      if (node.data.Institution) {
        content += `<p>Institution: ${node.data.Institution}</p>`;
      }
      if (node.data.Date) {
        content += `<p>Date: ${new Date(node.data.Date).toLocaleDateString()}</p>`;
      }
    }
    
    content += `</div>`;
    return content;
  }

  return (
    <div ref={containerRef} className={styles.graphContainer}>
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <h4>Layout</h4>
          <select value={layoutType} onChange={(e) => setLayoutType(e.target.value)}>
            <option value="force">Force Layout</option>
            <option value="radial">Radial Layout</option>
          </select>
        </div>
        
        <div className={styles.controlGroup}>
          <h4>Show/Hide</h4>
          <label>
            <input
              type="checkbox"
              checked={filterOptions.showCaseStudies}
              onChange={(e) => setFilterOptions({...filterOptions, showCaseStudies: e.target.checked})}
            />
            Case Studies
          </label>
          <label>
            <input
              type="checkbox"
              checked={filterOptions.showDimensions}
              onChange={(e) => setFilterOptions({...filterOptions, showDimensions: e.target.checked})}
            />
            Dimensions
          </label>
          <label>
            <input
              type="checkbox"
              checked={filterOptions.showInstitutions}
              onChange={(e) => setFilterOptions({...filterOptions, showInstitutions: e.target.checked})}
            />
            Institutions
          </label>
          <label>
            <input
              type="checkbox"
              checked={filterOptions.showKeywords}
              onChange={(e) => setFilterOptions({...filterOptions, showKeywords: e.target.checked})}
            />
            Keywords
          </label>
          <label>
            <input
              type="checkbox"
              checked={filterOptions.showPeople}
              onChange={(e) => setFilterOptions({...filterOptions, showPeople: e.target.checked})}
            />
            People
          </label>
        </div>
        
        <div className={styles.controlGroup}>
          <h4>Min Connections</h4>
          <input
            type="range"
            min="0"
            max="10"
            value={filterOptions.minConnections}
            onChange={(e) => setFilterOptions({...filterOptions, minConnections: parseInt(e.target.value)})}
          />
          <span>{filterOptions.minConnections}</span>
        </div>
        
        <button onClick={() => {
          const svg = d3.select(svgRef.current);
          svg.transition().duration(750).call(
            d3.zoom().transform,
            d3.zoomIdentity
          );
        }}>
          Reset View
        </button>
        
        <div className={styles.stats}>
          <p>Nodes: {graphStats.nodes}</p>
          <p>Edges: {graphStats.edges}</p>
          <p>Avg Connections: {graphStats.avgConnections?.toFixed(1)}</p>
        </div>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: getNodeColor('case-study') }}></span>
            Case Studies
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: getNodeColor('dimension') }}></span>
            Dimensions
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: getNodeColor('institution') }}></span>
            Institutions
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: getNodeColor('keyword') }}></span>
            Keywords
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: getNodeColor('person') }}></span>
            People
          </div>
        </div>
      </div>
      
      <svg ref={svgRef} className={styles.graph}></svg>
      
      {selectedNode && (
        <div className={styles.nodeDetails}>
          <button className={styles.closeButton} onClick={() => setSelectedNode(null)}>×</button>
          <h3>{selectedNode.label}</h3>
          <div className={styles.detailsContent}>
            <p><strong>Type:</strong> {selectedNode.type}</p>
            <p><strong>Connections:</strong> {selectedNode.connections}</p>
            <p><strong>Importance:</strong> {selectedNode.importance?.toFixed(1)}%</p>
            {selectedNode.data && (
              <>
                {selectedNode.data.Description && (
                  <div>
                    <strong>Description:</strong>
                    <p>{selectedNode.data.Description}</p>
                  </div>
                )}
                {selectedNode.data.Dimensions && (
                  <div>
                    <strong>Dimensions:</strong>
                    <p>{selectedNode.data.Dimensions}</p>
                  </div>
                )}
                {selectedNode.data.Keywords && (
                  <div>
                    <strong>Keywords:</strong>
                    <p>{selectedNode.data.Keywords}</p>
                  </div>
                )}
                {selectedNode.data.Institution && (
                  <p><strong>Institution:</strong> {selectedNode.data.Institution}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedNetworkGraph;