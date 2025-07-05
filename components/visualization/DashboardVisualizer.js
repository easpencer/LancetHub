'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaExpand, FaCompress, FaInfoCircle, FaDownload } from 'react-icons/fa';
import styles from './DashboardVisualizer.module.css';

// Import visualization libraries
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import { Chart } from 'chart.js/auto';

/**
 * DashboardVisualizer - A flexible component for displaying various data visualizations
 * 
 * @param {Object} props
 * @param {string} props.type - Visualization type (sunburst, network, bar, etc.)
 * @param {Array} props.data - Data to visualize
 * @param {Object} props.options - Configuration options
 * @param {string} props.title - Visualization title
 * @param {string} props.description - Visualization description
 * @param {function} props.onDataSelection - Callback when data is selected
 */
export default function DashboardVisualizer({
  type = 'bar',
  data = [],
  options = {},
  title = 'Data Visualization',
  description = '',
  onDataSelection = () => {}
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const chart = useRef(null);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle info panel toggle
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  // Handle chart download
  const downloadChart = () => {
    if (!chartRef.current) return;
    
    try {
      // Create a temporary link
      const link = document.createElement('a');
      
      if (type === 'network' || type === 'sunburst') {
        // For SVG-based visualizations
        const svgElement = chartRef.current.querySelector('svg');
        if (!svgElement) return;
        
        // Get SVG content
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        link.href = svgUrl;
        link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-visualization.svg`;
      } else {
        // For canvas-based visualizations
        const canvasElement = chartRef.current.querySelector('canvas');
        if (!canvasElement) return;
        
        link.href = canvasElement.toDataURL('image/png');
        link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-visualization.png`;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading visualization:', err);
    }
  };
  
  // Initialize and render the visualization
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) {
      setError('No data available for visualization');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Clear previous visualization
    if (chartRef.current) {
      chartRef.current.innerHTML = '';
    }
    
    // If a Chart.js instance exists, destroy it
    if (chart.current) {
      chart.current.destroy();
      chart.current = null;
    }
    
    try {
      switch (type) {
        case 'bar':
          renderBarChart();
          break;
        case 'pie':
          renderPieChart();
          break;
        case 'line':
          renderLineChart();
          break;
        case 'sunburst':
          renderSunburstChart();
          break;
        case 'network':
          renderNetworkGraph();
          break;
        case 'heatmap':
          renderHeatmap();
          break;
        case 'radar':
          renderRadarChart();
          break;
        default:
          setError(`Unsupported visualization type: ${type}`);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error rendering visualization:', err);
      setError(`Failed to create visualization: ${err.message}`);
      setIsLoading(false);
    }
  }, [type, data, options]);
  
  // Chart rendering functions
  const renderBarChart = () => {
    const ctx = document.createElement('canvas');
    chartRef.current.appendChild(ctx);
    
    // Set default options for bar chart
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        }
      },
      ...options
    };
    
    chart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label || ''),
        datasets: [{
          label: options.datasetLabel || 'Value',
          data: data.map(d => d.value || 0),
          backgroundColor: data.map((d, i) => 
            d.color || `hsl(${i * 360 / data.length}, 70%, 60%)`
          ),
          borderWidth: 1
        }]
      },
      options: chartOptions
    });
  };
  
  const renderPieChart = () => {
    const ctx = document.createElement('canvas');
    chartRef.current.appendChild(ctx);
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }
      },
      ...options
    };
    
    chart.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.label || ''),
        datasets: [{
          data: data.map(d => d.value || 0),
          backgroundColor: data.map((d, i) => 
            d.color || `hsl(${i * 360 / data.length}, 70%, 60%)`
          ),
          borderWidth: 1
        }]
      },
      options: chartOptions
    });
  };
  
  const renderLineChart = () => {
    const ctx = document.createElement('canvas');
    chartRef.current.appendChild(ctx);
    
    // Create datasets from data
    const datasets = [];
    
    // Check if data is a multi-series dataset
    if (data[0] && Array.isArray(data[0].values)) {
      // Handle multi-series line chart
      data.forEach((series, i) => {
        datasets.push({
          label: series.label || `Series ${i+1}`,
          data: series.values.map(v => v.value || 0),
          borderColor: series.color || `hsl(${i * 360 / data.length}, 70%, 60%)`,
          backgroundColor: series.fillColor || `hsla(${i * 360 / data.length}, 70%, 60%, 0.1)`,
          tension: 0.4,
          fill: !!series.fillColor,
          pointRadius: 3
        });
      });
      
      // Use the first series' labels for x-axis if available
      const xLabels = data[0].values.map(v => v.label || '');
      
      chart.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: xLabels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }
          },
          scales: {
            y: {
              beginAtZero: options.beginAtZero !== undefined ? options.beginAtZero : true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }
          },
          ...options
        }
      });
    } else {
      // Simple line chart
      chart.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d.label || ''),
          datasets: [{
            label: options.datasetLabel || 'Value',
            data: data.map(d => d.value || 0),
            borderColor: options.lineColor || 'rgb(0, 182, 212)',
            backgroundColor: options.fillColor || 'rgba(0, 182, 212, 0.1)',
            tension: 0.4,
            fill: !!options.fillColor,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }
          },
          scales: {
            y: {
              beginAtZero: options.beginAtZero !== undefined ? options.beginAtZero : true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }
          },
          ...options
        }
      });
    }
  };
  
  const renderRadarChart = () => {
    const ctx = document.createElement('canvas');
    chartRef.current.appendChild(ctx);
    
    chart.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.map(d => d.label || ''),
        datasets: [{
          label: options.datasetLabel || 'Value',
          data: data.map(d => d.value || 0),
          backgroundColor: options.fillColor || 'rgba(0, 182, 212, 0.2)',
          borderColor: options.lineColor || 'rgb(0, 182, 212)',
          pointBackgroundColor: options.pointColor || 'rgb(0, 182, 212)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(0, 182, 212)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }
        },
        scales: {
          r: {
            angleLines: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            pointLabels: {
              color: 'rgba(255, 255, 255, 0.8)'
            },
            ticks: {
              backdropColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.8)'
            }
          }
        },
        ...options
      }
    });
  };
  
  const renderSunburstChart = () => {
    // D3-based sunburst chart
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight || 500;
    const radius = Math.min(width, height) / 2;
    
    // Process hierarchical data
    const hierarchy = d3.hierarchy(options.hierarchyData || { 
      name: "root", 
      children: data.map(d => ({ name: d.label, value: d.value, color: d.color }))
    })
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);
    
    // Create partition layout
    const root = d3.partition()
      .size([2 * Math.PI, radius])(hierarchy);
    
    // Create SVG element
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("viewBox", `${-radius} ${-radius} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .style("font", "12px sans-serif");
    
    // Create arc generator
    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);
    
    // Create color scheme
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.length + 1));
    
    // Add paths
    svg.append("g")
      .selectAll("path")
      .data(root.descendants().filter(d => d.depth))
      .join("path")
      .attr("fill", d => {
        while (d.depth > 1) d = d.parent;
        return d.data.color || color(d.data.name);
      })
      .attr("d", arc)
      .on("mouseover", function(event, d) {
        // Show tooltip
        const tooltip = d3.select(chartRef.current)
          .append("div")
          .attr("class", styles.tooltip)
          .style("position", "absolute")
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
        
        tooltip.html(`
          <div><strong>${d.data.name}</strong></div>
          <div>Value: ${d.value}</div>
        `);
        
        // Highlight segment
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseout", function() {
        // Remove tooltip
        d3.select(chartRef.current)
          .selectAll(`.${styles.tooltip}`)
          .remove();
        
        // Reset opacity
        d3.select(this).style("opacity", 1);
      })
      .on("click", (event, d) => {
        onDataSelection(d.data);
      })
      .append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${d.value}`);
    
    // Add text labels
    svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
      .join("text")
      .attr("transform", d => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", d => Math.min(14, (d.x1 - d.x0) * 50))
      .text(d => d.data.name);
  };
  
  const renderNetworkGraph = () => {
    // D3-based network graph
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight || 500;
    
    // Process network data
    const nodes = options.nodes || data.map((d, i) => ({ 
      id: d.id || i, 
      name: d.label, 
      group: d.group || 1,
      value: d.value || 1
    }));
    
    const links = options.links || [];
    
    // Create SVG element
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");
    
    // Create a simulation with forces
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(d => Math.sqrt(d.value) * 4 + 10));
    
    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value || 1));
    
    // Add tooltips
    const tooltip = d3.select(chartRef.current)
      .append("div")
      .attr("class", styles.tooltip)
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none");
    
    // Create nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => Math.sqrt(d.value || 1) * 4 + 5)
      .attr("fill", d => d.color || color(d.group || 0))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("mouseover", function(event, d) {
        // Show tooltip
        tooltip.transition()
          .style("opacity", .9);
          
        tooltip.html(`
          <div><strong>${d.name}</strong></div>
          <div>Group: ${d.group || 'N/A'}</div>
          <div>Value: ${d.value || 'N/A'}</div>
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        
        // Highlight connected links
        link.style("stroke", l => 
          l.source.id === d.id || l.target.id === d.id ? 
            "#ff9e00" : "#999");
        link.style("stroke-opacity", l => 
          l.source.id === d.id || l.target.id === d.id ? 
            1 : 0.6);
        link.style("stroke-width", l => 
          l.source.id === d.id || l.target.id === d.id ? 
            Math.sqrt(l.value || 1) * 2 : Math.sqrt(l.value || 1));
          
        // Highlight this node
        d3.select(this)
          .attr("stroke", "#ff9e00")
          .attr("stroke-width", 3);
      })
      .on("mouseout", function() {
        // Hide tooltip
        tooltip.transition()
          .style("opacity", 0);
          
        // Reset all links
        link.style("stroke", "#999")
          .style("stroke-opacity", 0.6)
          .style("stroke-width", d => Math.sqrt(d.value || 1));
          
        // Reset this node
        d3.select(this)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5);
      })
      .on("click", (event, d) => {
        onDataSelection(d);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add node labels if specified
    if (options.showLabels) {
      const labels = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.name)
        .style("font-size", "12px")
        .style("fill", "white");
      
      // Update label positions during simulation
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        
        node
          .attr("cx", d => d.x = Math.max(10, Math.min(width - 10, d.x)))
          .attr("cy", d => d.y = Math.max(10, Math.min(height - 10, d.y)));
        
        labels
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });
    } else {
      // Just update node and link positions
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        
        node
          .attr("cx", d => d.x = Math.max(10, Math.min(width - 10, d.x)))
          .attr("cy", d => d.y = Math.max(10, Math.min(height - 10, d.y)));
      });
    }
    
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
  };
  
  const renderHeatmap = () => {
    const ctx = document.createElement('canvas');
    chartRef.current.appendChild(ctx);
    
    // Process heatmap data
    const labels = options.labels || Array.from({ length: 10 }, (_, i) => `Label ${i+1}`);
    const dataLabels = options.dataLabels || Array.from({ length: 10 }, (_, i) => `Data ${i+1}`);
    
    // Create datasets
    const datasets = dataLabels.map((label, i) => ({
      label,
      data: labels.map((_, j) => {
        // Find a data point that matches these coordinates, or use a default value
        const dataPoint = data.find(d => d.x === j && d.y === i);
        return dataPoint ? dataPoint.value : Math.floor(Math.random() * 100);
      })
    }));
    
    // Create chart
    chart.current = new Chart(ctx, {
      type: 'matrix',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            },
            grid: {
              display: false
            }
          }
        },
        ...options
      }
    });
  };
  
  return (
    <motion.div
      className={`${styles.visualizerContainer} ${isFullscreen ? styles.fullscreen : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <div className={styles.header}>
        <h3>{title}</h3>
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={toggleInfo}
            title="View information"
          >
            <FaInfoCircle />
          </button>
          <button
            className={styles.controlButton}
            onClick={downloadChart}
            title="Download visualization"
          >
            <FaDownload />
          </button>
          <button
            className={styles.controlButton}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className="loading-animation">
            <div></div><div></div><div></div><div></div>
          </div>
          <p>Loading visualization...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
        </div>
      ) : (
        <div className={styles.chartContainer} ref={chartRef} />
      )}
      
      {showInfo && description && (
        <div className={styles.infoPanel}>
          <h4>About this visualization</h4>
          <p>{description}</p>
        </div>
      )}
    </motion.div>
  );
}
