'use client';

import { useEffect, useRef } from 'react';
import styles from './Chart.module.css';

export default function DimensionCorrelationMatrix({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 80, left: 60 };

    // Clear previous chart
    svg.innerHTML = '';
    
    // Set up dimensions
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Process data
    const dimensions = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12); // Show top 12 dimensions
    
    const maxCount = Math.max(...dimensions.map(d => d[1]));
    
    // Create scales
    const xScale = (index) => (index / (dimensions.length - 1)) * chartWidth;
    const yScale = (value) => chartHeight - (value / maxCount) * chartHeight;
    const barWidth = chartWidth / dimensions.length * 0.8;
    
    // Create SVG container
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    
    // Create chart group
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
    svg.appendChild(chartGroup);
    
    // Create bars
    dimensions.forEach((dimension, index) => {
      const [name, count] = dimension;
      const x = xScale(index) - barWidth / 2;
      const y = yScale(count);
      const barHeight = chartHeight - yScale(count);
      
      // Create bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', barWidth);
      rect.setAttribute('height', barHeight);
      rect.setAttribute('fill', `hsl(${180 + (index * 30) % 180}, 70%, 60%)`);
      rect.setAttribute('rx', '4');
      rect.style.transition = 'all 0.3s ease';
      
      // Add hover effects
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('fill', `hsl(${180 + (index * 30) % 180}, 80%, 50%)`);
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('fill', `hsl(${180 + (index * 30) % 180}, 70%, 60%)`);
      });
      
      chartGroup.appendChild(rect);
      
      // Add count label on top of bar
      const countLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      countLabel.setAttribute('x', xScale(index));
      countLabel.setAttribute('y', y - 5);
      countLabel.setAttribute('text-anchor', 'middle');
      countLabel.setAttribute('fill', '#ffffff');
      countLabel.setAttribute('font-size', '12');
      countLabel.setAttribute('font-weight', 'bold');
      countLabel.textContent = count;
      chartGroup.appendChild(countLabel);
      
      // Add dimension label (rotated)
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', xScale(index));
      label.setAttribute('y', chartHeight + 20);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('fill', '#cccccc');
      label.setAttribute('font-size', '10');
      label.setAttribute('transform', `rotate(-45, ${xScale(index)}, ${chartHeight + 20})`);
      label.textContent = name.length > 20 ? name.substring(0, 20) + '...' : name;
      chartGroup.appendChild(label);
    });
    
    // Add axes
    // X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', chartWidth);
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('stroke', '#555');
    xAxis.setAttribute('stroke-width', '2');
    chartGroup.appendChild(xAxis);
    
    // Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('stroke', '#555');
    yAxis.setAttribute('stroke-width', '2');
    chartGroup.appendChild(yAxis);
    
    // Add Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = (maxCount / 5) * i;
      const y = yScale(value);
      
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', -5);
      tick.setAttribute('y1', y);
      tick.setAttribute('x2', 0);
      tick.setAttribute('y2', y);
      tick.setAttribute('stroke', '#555');
      chartGroup.appendChild(tick);
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', -10);
      label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('fill', '#cccccc');
      label.setAttribute('font-size', '10');
      label.textContent = Math.round(value);
      chartGroup.appendChild(label);
    }
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', chartWidth / 2);
    title.setAttribute('y', -10);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#ffffff');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Resilience Dimensions Coverage';
    chartGroup.appendChild(title);
    
  }, [data]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={styles.noData}>
        <p>No dimension data available</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <svg ref={svgRef} className={styles.chart}></svg>
      <div className={styles.chartCaption}>
        <p>Distribution of case studies across different resilience dimensions</p>
      </div>
    </div>
  );
}