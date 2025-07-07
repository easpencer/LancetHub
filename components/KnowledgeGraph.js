'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './KnowledgeGraph.module.css';

const KnowledgeGraph = ({ caseStudies, width = 1200, height = 700 }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width, height });

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

  useEffect(() => {
    if (!caseStudies || caseStudies.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Build graph data
    const { nodes, links } = buildGraphData(caseStudies);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Add zoom behavior
    const g = svg.append("g");
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(d => d.radius + 5));

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("class", styles.link)
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value || 1));

    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", styles.node)
      .call(drag(simulation));

    // Add circles to nodes
    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => getNodeColor(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);

    // Add labels to nodes
    node.append("text")
      .text(d => d.label)
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", styles.nodeLabel)
      .style("font-size", d => d.type === 'case-study' ? "10px" : "12px")
      .style("pointer-events", "none");

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("text-align", "left")
      .style("padding", "0.75rem")
      .style("font-size", "0.85rem")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "#fff")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("max-width", "300px")
      .style("box-shadow", "0 10px 25px rgba(0, 0, 0, 0.5)")
      .style("z-index", "100")
      .style("opacity", 0);

    function handleMouseOver(event, d) {
      setHoveredNode(d);
      
      // Highlight connected nodes
      node.style("opacity", n => {
        return isConnected(d, n) ? 1 : 0.3;
      });
      
      link.style("opacity", l => {
        return l.source === d || l.target === d ? 1 : 0.1;
      });

      // Show tooltip
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      
      tooltip.html(getTooltipContent(d))
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    }

    function handleMouseOut() {
      setHoveredNode(null);
      
      // Reset opacity
      node.style("opacity", 1);
      link.style("opacity", 0.6);
      
      // Hide tooltip
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    }

    function handleClick(event, d) {
      setSelectedNode(d);
      event.stopPropagation();
    }

    // Check if nodes are connected
    function isConnected(a, b) {
      if (a === b) return true;
      return links.some(link => 
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

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
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
        d.fx = null;
        d.fy = null;
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

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [caseStudies, dimensions.width, dimensions.height]);

  function buildGraphData(studies) {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // Add case study nodes
    studies.forEach(study => {
      const node = {
        id: `study-${study.id}`,
        label: study.Title || 'Untitled',
        type: 'case-study',
        radius: 8,
        data: study
      };
      nodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Add dimension nodes
    const dimensions = new Map();
    studies.forEach(study => {
      if (study.Dimensions) {
        const dims = study.Dimensions.split(',').map(d => d.trim());
        dims.forEach(dim => {
          if (!dimensions.has(dim)) {
            const node = {
              id: `dim-${dim}`,
              label: dim,
              type: 'dimension',
              radius: 15,
              count: 0
            };
            dimensions.set(dim, node);
            nodes.push(node);
            nodeMap.set(node.id, node);
          }
          dimensions.get(dim).count++;
          
          // Create link between study and dimension
          links.push({
            source: `study-${study.id}`,
            target: `dim-${dim}`,
            type: 'has-dimension',
            value: 1
          });
        });
      }
    });

    // Add institution nodes
    const institutions = new Map();
    studies.forEach(study => {
      if (study.Institution) {
        if (!institutions.has(study.Institution)) {
          const node = {
            id: `inst-${study.Institution}`,
            label: study.Institution,
            type: 'institution',
            radius: 12,
            count: 0
          };
          institutions.set(study.Institution, node);
          nodes.push(node);
          nodeMap.set(node.id, node);
        }
        institutions.get(study.Institution).count++;
        
        // Create link between study and institution
        links.push({
          source: `study-${study.id}`,
          target: `inst-${study.Institution}`,
          type: 'from-institution',
          value: 1
        });
      }
    });

    // Add keyword nodes (limit to top keywords)
    const keywordCounts = new Map();
    studies.forEach(study => {
      if (study.Keywords) {
        const keywords = study.Keywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
          keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
        });
      }
    });

    // Get top 20 keywords
    const topKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    topKeywords.forEach(([keyword, count]) => {
      const node = {
        id: `kw-${keyword}`,
        label: keyword,
        type: 'keyword',
        radius: Math.min(10, 5 + count),
        count: count
      };
      nodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Create links between studies and keywords
    studies.forEach(study => {
      if (study.Keywords) {
        const keywords = study.Keywords.split(',').map(k => k.trim());
        keywords.forEach(keyword => {
          if (nodeMap.has(`kw-${keyword}`)) {
            links.push({
              source: `study-${study.id}`,
              target: `kw-${keyword}`,
              type: 'has-keyword',
              value: 0.5
            });
          }
        });
      }
    });

    // Add people nodes if available
    const peopleSet = new Set();
    studies.forEach(study => {
      if (study.People) {
        const people = Array.isArray(study.People) ? study.People : [study.People];
        people.forEach(person => {
          if (!peopleSet.has(person)) {
            peopleSet.add(person);
            const node = {
              id: `person-${person}`,
              label: person,
              type: 'person',
              radius: 10
            };
            nodes.push(node);
            nodeMap.set(node.id, node);
          }
          
          links.push({
            source: `study-${study.id}`,
            target: `person-${person}`,
            type: 'authored-by',
            value: 1
          });
        });
      }
    });

    return { nodes, links };
  }

  function getNodeColor(type) {
    const colors = {
      'case-study': '#3ACCE1', // Primary color
      'dimension': '#FFD23F', // Accent color
      'institution': '#FF3B5C', // Danger color
      'keyword': '#4CAF50', // Success color
      'person': '#9C27B0' // Purple
    };
    return colors[type] || '#999';
  }

  function getTooltipContent(node) {
    let content = `<strong>${node.label}</strong><br/>`;
    content += `Type: ${node.type}<br/>`;
    
    if (node.count) {
      content += `Count: ${node.count}<br/>`;
    }
    
    if (node.data) {
      if (node.data.Description) {
        content += `<br/>${node.data.Description.substring(0, 150)}...`;
      }
    }
    
    return content;
  }

  return (
    <div ref={containerRef} className={styles.graphContainer}>
      <div className={styles.controls}>
        <button onClick={() => {
          const svg = d3.select(svgRef.current);
          svg.transition().duration(750).call(
            d3.zoom().transform,
            d3.zoomIdentity
          );
        }}>
          Reset View
        </button>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#3ACCE1' }}></span>
            Case Studies
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#FFD23F' }}></span>
            Dimensions
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#FF3B5C' }}></span>
            Institutions
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#4CAF50' }}></span>
            Keywords
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#9C27B0' }}></span>
            People
          </div>
        </div>
      </div>
      
      <svg ref={svgRef} className={styles.graph}></svg>
      
      {selectedNode && (
        <div className={styles.nodeDetails}>
          <h3>{selectedNode.label}</h3>
          <p>Type: {selectedNode.type}</p>
          {selectedNode.data && selectedNode.data.Description && (
            <p>{selectedNode.data.Description}</p>
          )}
          <button onClick={() => setSelectedNode(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;