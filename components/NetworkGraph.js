import React from 'react';

const NetworkGraph = ({ data, width = 800, height = 600 }) => {
  return (
    <div style={{ 
      width: `${width}px`, 
      height: `${height}px`,
      backgroundColor: 'var(--card-background)',
      borderRadius: 'var(--border-radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--light-text)'
    }}>
      <p>Network Graph Visualization</p>
    </div>
  );
};

export default NetworkGraph;