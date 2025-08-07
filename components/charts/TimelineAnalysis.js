'use client';

import { useEffect, useRef } from 'react';
import styles from './Chart.module.css';

export default function TimelineAnalysis({ data, studies }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const svg = svgRef.current;
    const width = 1000;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };

    // Clear previous chart
    svg.innerHTML = '';
    
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Process data
    const years = Object.entries(data)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year)
      .filter(d => d.year >= 2010 && d.year <= new Date().getFullYear()); // Filter reasonable years
    
    if (years.length === 0) return;
    
    const minYear = years[0].year;
    const maxYear = years[years.length - 1].year;
    const maxCount = Math.max(...years.map(d => d.count));
    
    // Create scales
    const xScale = (year) => ((year - minYear) / (maxYear - minYear)) * chartWidth;
    const yScale = (count) => chartHeight - (count / maxCount) * chartHeight;
    
    // Set up SVG
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chartGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
    svg.appendChild(chartGroup);
    
    // Create gradient for line
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'timelineGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#3ACCF1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#F1E73A');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Create area under curve
    let pathData = `M 0 ${chartHeight}`;
    years.forEach((d, index) => {
      const x = xScale(d.year);
      const y = yScale(d.count);
      if (index === 0) {
        pathData += ` L ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });
    pathData += ` L ${chartWidth} ${chartHeight} Z`;
    
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', pathData);
    area.setAttribute('fill', 'url(#timelineGradient)');
    area.setAttribute('opacity', '0.3');
    chartGroup.appendChild(area);
    
    // Create line
    let lineData = '';
    years.forEach((d, index) => {
      const x = xScale(d.year);
      const y = yScale(d.count);
      lineData += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', lineData);
    line.setAttribute('stroke', 'url(#timelineGradient)');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('fill', 'none');
    chartGroup.appendChild(line);
    
    // Add dots for each year
    years.forEach(d => {
      const x = xScale(d.year);
      const y = yScale(d.count);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', '#ffffff');
      circle.setAttribute('stroke', '#3ACCF1');
      circle.setAttribute('stroke-width', '3');
      circle.style.cursor = 'pointer';
      
      // Add hover effects
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', '8');
        
        // Show tooltip
        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tooltip.setAttribute('id', 'tooltip');
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x - 30);
        rect.setAttribute('y', y - 35);
        rect.setAttribute('width', '60');
        rect.setAttribute('height', '25');
        rect.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
        rect.setAttribute('rx', '4');
        tooltip.appendChild(rect);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y - 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = `${d.year}: ${d.count}`;
        tooltip.appendChild(text);
        
        chartGroup.appendChild(tooltip);
      });
      
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', '6');
        const tooltip = chartGroup.querySelector('#tooltip');
        if (tooltip) tooltip.remove();
      });
      
      chartGroup.appendChild(circle);
    });
    
    // Add axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', chartHeight);
    xAxis.setAttribute('x2', chartWidth);
    xAxis.setAttribute('y2', chartHeight);
    xAxis.setAttribute('stroke', '#555');
    xAxis.setAttribute('stroke-width', '2');
    chartGroup.appendChild(xAxis);
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', chartHeight);
    yAxis.setAttribute('stroke', '#555');
    yAxis.setAttribute('stroke-width', '2');
    chartGroup.appendChild(yAxis);
    
    // Add year labels
    years.forEach(d => {
      const x = xScale(d.year);
      
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', x);
      tick.setAttribute('y1', chartHeight);
      tick.setAttribute('x2', x);
      tick.setAttribute('y2', chartHeight + 5);
      tick.setAttribute('stroke', '#555');
      chartGroup.appendChild(tick);
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x);
      label.setAttribute('y', chartHeight + 20);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#cccccc');
      label.setAttribute('font-size', '12');
      label.textContent = d.year;
      chartGroup.appendChild(label);
    });
    
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
    title.textContent = 'Research Activity Over Time';
    chartGroup.appendChild(title);
    
  }, [data, studies]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={styles.placeholder}>
        <h3>Timeline Analysis</h3>
        <p>No temporal data available for visualization</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <svg ref={svgRef} className={styles.chart}></svg>
      <div className={styles.chartCaption}>
        <p>Evolution of research activity and publication trends over time</p>
      </div>
    </div>
  );
}