'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import styles from './NetworkGraph.module.css';

/**
 * NetworkGraph - Interactive network visualization for exploring relationships
 * 
 * @param {Object} props
 * @param {Array} props.nodes - Array of node objects with id, name, group properties
 * @param {Array} props.links - Array of link objects with source, target, value properties
 * @param {Object} props.options - Visualization options
 * @param {Function} props.onNodeClick - Callback when node is clicked
 * @param {Function} props.onLinkClick - Callback when link is clicked
 */
export default function NetworkGraph({
  nodes = [],
  links = [],
  options = {},
  onNodeClick = () => {},
  onLinkClick = () => {}
}) {
  const networkRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // Default configuration
  const defaults = {
    width: 800,
    height: 600,
    nodeRadius: 10,
    linkDistance: 100,
    chargeStrength: -300,
    centerStrength: 0.1,
    collideStrength: 0.7,
    colorScheme: d3.schemeCategory10,
    animate: true,
    showLabels: true,
    enableZoom: true,
    highlightConnections: true
  };
  
  // Merge default options with provided options
  const config = { ...defaults, ...options };
  
  useEffect(() => {
    if (!networkRef.current) return;
    
    // Clear any existing visualizations
    d3.select(networkRef.current).selectAll("*").remove();
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (nodes.length === 0) {
        setError("No nodes provided for visualization");
        setIsLoading(false);
        return;
      }
      
      // Create SVG
      const width = config.width || networkRef.current.clientWidth || 800;
      const height = config.height || networkRef.current.clientHeight || 600;
      
      const svg = d3.select(networkRef.current)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", "100%")
        .attr("height", "100%")
        .classed(styles.networkSvg, true);
      
      // Create zoom behavior if enabled
      if (config.enableZoom) {
        const zoom = d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([0.1, 10])
          .on("zoom", zoomed);
        
        svg.call(zoom);
        
        function zoomed(event) {
          networkGroup.attr("transform", event.transform);
        }
      }
      
      // Create container group for all network elements
      const networkGroup = svg.append("g")
        .classed(styles.networkGroup, true);
      
      // Create color scale for nodes
      const color = d3.scaleOrdinal(config.colorScheme);
      
      // Create force simulation
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(config.linkDistance))
        .force("charge", d3.forceManyBody().strength(config.chargeStrength))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(config.centerStrength))
        .force("collide", d3.forceCollide().radius(d => config.nodeRadius * 1.2).strength(config.collideStrength));
      
      // Create links
      const link = networkGroup.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value || 1))
        .classed(styles.link, true)
        .on("click", (event, d) => {
          event.stopPropagation();
          onLinkClick(d);
        })
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke", "#f39c12")
            .attr("stroke-opacity", 1);
            
          // Show link tooltip
          const tooltip = d3.select(networkRef.current)
            .append("div")
            .attr("class", styles.tooltip)
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY}px`);
          
          tooltip.html(`
            <div class="${styles.tooltipContent}">
              <div><strong>Relationship</strong></div>
              <div>${d.source.name || d.source} → ${d.target.name || d.target}</div>
              ${d.value ? `<div>Strength: ${d.value}</div>` : ''}
              ${d.type ? `<div>Type: ${d.type}</div>` : ''}
            </div>
          `);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke", d => selectedNode && 
              (d.source.id === selectedNode.id || d.target.id === selectedNode.id) ? 
              "#f39c12" : "#999")
            .attr("stroke-opacity", d => selectedNode && 
              (d.source.id === selectedNode.id || d.target.id === selectedNode.id) ? 
              1 : 0.6);
          
          // Remove tooltip
          d3.select(networkRef.current)
            .selectAll(`.${styles.tooltip}`)
            .remove();
        });
      
      // Create nodes
      const node = networkGroup.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .classed(styles.nodeGroup, true)
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedNode(selectedNode && selectedNode.id === d.id ? null : d);
          onNodeClick(d);
          
          // Highlight connected links and nodes
          if (config.highlightConnections) {
            if (selectedNode && selectedNode.id === d.id) {
              // Deselecting node - reset everything
              link
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", d => Math.sqrt(d.value || 1));
                
              node.select("circle")
                .attr("stroke", "#fff")
                .attr("stroke-opacity", 1)
                .attr("stroke-width", 1.5);
            } else {
              // Selecting node - highlight connections
              link
                .attr("stroke", l => 
                  l.source.id === d.id || l.target.id === d.id ? 
                  "#f39c12" : "#999")
                .attr("stroke-opacity", l => 
                  l.source.id === d.id || l.target.id === d.id ? 
                  1 : 0.2)
                .attr("stroke-width", l => 
                  l.source.id === d.id || l.target.id === d.id ? 
                  Math.sqrt(l.value || 1) * 2 : Math.sqrt(l.value || 1));
                
              node.select("circle")
                .attr("stroke", n => 
                  n.id === d.id || links.some(l => 
                    (l.source.id === d.id && l.target.id === n.id) || 
                    (l.target.id === d.id && l.source.id === n.id)) ? 
                  "#f39c12" : "#fff")
                .attr("stroke-opacity", n => 
                  n.id === d.id || links.some(l => 
                    (l.source.id === d.id && l.target.id === n.id) || 
                    (l.target.id === d.id && l.source.id === n.id)) ? 
                  1 : 0.3)
                .attr("stroke-width", n => 
                  n.id === d.id ? 3 : 1.5);
            }
          }
        });
      
      // Add node circles
      node.append("circle")
        .attr("r", d => Math.sqrt((d.value || 1) * config.nodeRadius))
        .attr("fill", d => d.color || color(d.group || 0))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .classed(styles.nodeCircle, true)
        .on("mouseover", function(event, d) {
          setHoveredNode(d);
          
          // Highlight this node
          d3.select(this)
            .attr("stroke", "#f39c12")
            .attr("stroke-width", 3);
          
          // Show node tooltip
          const tooltip = d3.select(networkRef.current)
            .append("div")
            .attr("class", styles.tooltip)
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY}px`);
          
          tooltip.html(`
            <div class="${styles.tooltipContent}">
              <div><strong>${d.name}</strong></div>
              ${d.group ? `<div>Group: ${d.group}</div>` : ''}
              ${d.value ? `<div>Value: ${d.value}</div>` : ''}
              ${d.description ? `<div>${d.description}</div>` : ''}
            </div>
          `);
        })
        .on("mouseout", function(event, d) {
          setHoveredNode(null);
          
          // Reset node style unless it's selected
          if (!selectedNode || selectedNode.id !== d.id) {
            d3.select(this)
              .attr("stroke", selectedNode && links.some(l => 
                (l.source.id === selectedNode.id && l.target.id === d.id) || 
                (l.target.id === selectedNode.id && l.source.id === d.id)) ? 
                "#f39c12" : "#fff")
              .attr("stroke-width", 1.5);
          }
          
          // Remove tooltip
          d3.select(networkRef.current)
            .selectAll(`.${styles.tooltip}`)
            .remove();
        });
      
      // Add node labels if enabled
      if (config.showLabels) {
        node.append("text")
          .attr("dx", d => Math.sqrt((d.value || 1) * config.nodeRadius) + 5)
          .attr("dy", ".35em")
          .text(d => d.name)
          .classed(styles.nodeLabel, true);
      }
      
      // SVG background click handler to deselect
      svg.on("click", () => {
        // Reset all styles when clicking on background
        if (selectedNode) {
          link
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", d => Math.sqrt(d.value || 1));
            
          node.select("circle")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1.5);
          
          setSelectedNode(null);
        }
      });
      
      // Update positions on simulation tick
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        
        node
          .attr("transform", d => `translate(${
            d.x = Math.max(10, Math.min(width - 10, d.x))
          }, ${
            d.y = Math.max(10, Math.min(height - 10, d.y))
          })`);
      });
      
      // Drag functions
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error creating network visualization:", err);
      setError(`Failed to create visualization: ${err.message}`);
      setIsLoading(false);
    }
  }, [nodes, links, options, networkRef]);
  
  return (
    <motion.div 
      className={styles.networkContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className="loading-animation">
            <div></div><div></div><div></div><div></div>
          </div>
          <p>Building network visualization...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
        </div>
      ) : (
        <div className={styles.networkVisualization} ref={networkRef}></div>
      )}
      
      {selectedNode && (
        <motion.div 
          className={styles.nodeDetails}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4>{selectedNode.name}</h4>
          {selectedNode.description && <p>{selectedNode.description}</p>}
          {selectedNode.group && <p><strong>Group:</strong> {selectedNode.group}</p>}
          {selectedNode.value && <p><strong>Value:</strong> {selectedNode.value}</p>}
          
          <div className={styles.nodeStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {links.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id).length}
              </span>
              <span className={styles.statLabel}>Connections</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
