'use client';

import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';

export default function NetworkVisualization({ graph }) {
  const containerRef = useRef(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !graph || !graph.graph) return;

    // Prepare nodes data
    const nodes = graph.graph.nodes.map((node, index) => ({
      id: node.id,
      label: node.label,
      title: `${node.label}\nType: ${node.type}\nDegree: ${node.degree || 0}`,
      group: node.type,
      value: node.degree || 1,
      // Different shapes for different types
      shape: node.type === 'case_study' ? 'dot' : 
             node.type === 'dimension' ? 'square' : 
             node.type === 'keyword' ? 'triangle' : 'ellipse',
      // Size based on degree centrality
      size: Math.min(50, 10 + (node.degree || 1) * 2)
    }));

    // Prepare edges data
    const edges = graph.graph.edges.map(edge => ({
      from: edge.source,
      to: edge.target,
      value: edge.weight || 1,
      title: `Weight: ${edge.weight || 1}`
    }));

    // Create network data
    const data = { nodes, edges };

    // Network options
    const options = {
      nodes: {
        font: {
          size: 12,
          color: '#ffffff',
          strokeWidth: 2,
          strokeColor: '#11111b'
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 10,
          x: 5,
          y: 5
        }
      },
      edges: {
        width: 1,
        color: {
          color: 'rgba(255, 255, 255, 0.2)',
          highlight: '#3acce1',
          hover: '#3acce1'
        },
        smooth: {
          type: 'continuous',
          roundness: 0.5
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.3)',
          size: 5,
          x: 2,
          y: 2
        }
      },
      groups: {
        case_study: {
          color: {
            background: '#3acce1',
            border: '#2ba5b8',
            highlight: {
              background: '#4dd8ed',
              border: '#3acce1'
            }
          }
        },
        dimension: {
          color: {
            background: '#ffd23f',
            border: '#e6bb00',
            highlight: {
              background: '#ffe166',
              border: '#ffd23f'
            }
          }
        },
        keyword: {
          color: {
            background: '#ff3b5c',
            border: '#e62545',
            highlight: {
              background: '#ff5470',
              border: '#ff3b5c'
            }
          }
        },
        person: {
          color: {
            background: '#a78bfa',
            border: '#8b5cf6',
            highlight: {
              background: '#c4b5fd',
              border: '#a78bfa'
            }
          }
        },
        organization: {
          color: {
            background: '#10b981',
            border: '#059669',
            highlight: {
              background: '#34d399',
              border: '#10b981'
            }
          }
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
          damping: 0.4,
          avoidOverlap: 1
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 50
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        navigationButtons: true,
        keyboard: {
          enabled: true
        }
      },
      layout: {
        improvedLayout: true,
        clusterThreshold: 150
      }
    };

    // Create network
    const networkInstance = new Network(containerRef.current, data, options);
    
    // Add event listeners
    networkInstance.on('stabilizationProgress', (params) => {
      const progress = params.iterations / params.total * 100;
      console.log('Stabilization progress:', progress.toFixed(0) + '%');
    });

    networkInstance.once('stabilizationIterationsDone', () => {
      console.log('Network stabilization complete');
      networkInstance.setOptions({ physics: { enabled: false } });
    });

    // Focus on the network
    networkInstance.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        networkInstance.focus(nodeId, {
          scale: 1.5,
          animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
          }
        });
      }
    });

    setNetwork(networkInstance);

    // Cleanup
    return () => {
      if (networkInstance) {
        networkInstance.destroy();
      }
    };
  }, [graph]);

  const resetView = () => {
    if (network) {
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      });
    }
  };

  const togglePhysics = () => {
    if (network) {
      const options = network.getOptions();
      network.setOptions({
        physics: { enabled: !options.physics.enabled }
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: '#1a1a2e',
          borderRadius: '12px'
        }} 
      />
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        <button
          onClick={resetView}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3acce1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#4dd8ed';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3acce1';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Reset View
        </button>
        <button
          onClick={togglePhysics}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ffd23f',
            color: '#11111b',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ffe166';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ffd23f';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Toggle Physics
        </button>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(17, 17, 27, 0.9)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#999'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '600', color: '#fff' }}>Legend:</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3acce1', borderRadius: '50%' }} />
            <span>Case Study</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#ffd23f' }} />
            <span>Dimension</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '0', height: '0', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '12px solid #ff3b5c' }} />
            <span>Keyword</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#a78bfa', borderRadius: '50%' }} />
            <span>Person</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }} />
            <span>Organization</span>
          </div>
        </div>
      </div>
    </div>
  );
}