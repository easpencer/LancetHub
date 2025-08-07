'use client';

import { useEffect, useRef } from 'react';
import styles from './Chart.module.css';

export default function GeographicImpactMap({ studies }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!studies || studies.length === 0) return;

    const svg = svgRef.current;
    const width = 900;
    const height = 500;

    // Clear previous content
    svg.innerHTML = '';
    
    // Set up SVG
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    
    // Sample geographic regions (simplified for demonstration)
    const regions = [
      { name: 'North America', x: 150, y: 180, studies: [], color: '#3ACCF1' },
      { name: 'South America', x: 200, y: 320, studies: [], color: '#F1E73A' },
      { name: 'Europe', x: 450, y: 150, studies: [], color: '#FF6B6B' },
      { name: 'Africa', x: 480, y: 280, studies: [], color: '#4ECDC4' },
      { name: 'Asia', x: 650, y: 200, studies: [], color: '#45B7D1' },
      { name: 'Oceania', x: 750, y: 350, studies: [], color: '#96CEB4' }
    ];
    
    // Assign studies to regions based on institution or keywords (simplified logic)
    studies.forEach(study => {
      const institution = study.Institution || '';
      const description = study.Description || '';
      const title = study.Title || '';
      const text = `${institution} ${description} ${title}`.toLowerCase();
      
      let assignedRegion = null;
      
      // Simple keyword-based region assignment
      if (text.includes('usa') || text.includes('america') || text.includes('united states') || text.includes('canada')) {
        assignedRegion = regions.find(r => r.name === 'North America');
      } else if (text.includes('europe') || text.includes('uk') || text.includes('germany') || text.includes('france') || text.includes('italy')) {
        assignedRegion = regions.find(r => r.name === 'Europe');
      } else if (text.includes('asia') || text.includes('china') || text.includes('japan') || text.includes('india') || text.includes('korea')) {
        assignedRegion = regions.find(r => r.name === 'Asia');
      } else if (text.includes('africa') || text.includes('nigeria') || text.includes('south africa') || text.includes('kenya')) {
        assignedRegion = regions.find(r => r.name === 'Africa');
      } else if (text.includes('australia') || text.includes('new zealand') || text.includes('oceania')) {
        assignedRegion = regions.find(r => r.name === 'Oceania');
      } else if (text.includes('brazil') || text.includes('argentina') || text.includes('chile') || text.includes('colombia')) {
        assignedRegion = regions.find(r => r.name === 'South America');
      } else {
        // Default assignment based on index
        assignedRegion = regions[Math.floor(Math.random() * regions.length)];
      }
      
      if (assignedRegion) {
        assignedRegion.studies.push(study);
      }
    });
    
    // Calculate impact scores for each region
    regions.forEach(region => {
      region.avgImpactScore = region.studies.length > 0 
        ? region.studies.reduce((sum, s) => sum + (s.impactScore || 0), 0) / region.studies.length
        : 0;
      region.studyCount = region.studies.length;
    });
    
    // Draw simplified world map background
    const mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Simple continent shapes (very simplified)
    const continents = [
      { name: 'North America', path: 'M 50,100 Q 100,80 200,100 L 250,200 Q 200,250 150,220 Q 100,200 50,180 Z' },
      { name: 'South America', path: 'M 150,250 Q 200,240 220,300 L 230,400 Q 200,420 180,400 Q 150,380 140,320 Z' },
      { name: 'Europe', path: 'M 400,100 Q 450,90 500,110 L 520,180 Q 480,200 440,180 Q 400,160 400,120 Z' },
      { name: 'Africa', path: 'M 420,200 Q 480,190 540,220 L 550,350 Q 500,380 450,360 Q 420,340 420,280 Z' },
      { name: 'Asia', path: 'M 520,80 Q 650,60 780,100 L 800,250 Q 720,280 620,260 Q 520,240 520,160 Z' },
      { name: 'Oceania', path: 'M 700,320 Q 750,310 800,330 L 820,380 Q 780,400 740,390 Q 700,370 700,350 Z' }
    ];
    
    continents.forEach(continent => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', continent.path);
      path.setAttribute('fill', 'rgba(255, 255, 255, 0.05)');
      path.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
      path.setAttribute('stroke-width', '1');
      mapGroup.appendChild(path);
    });
    
    svg.appendChild(mapGroup);
    
    // Draw region markers
    regions.forEach(region => {
      if (region.studyCount === 0) return;
      
      const maxRadius = 50;
      const minRadius = 10;
      const radius = Math.max(minRadius, Math.min(maxRadius, 10 + region.studyCount * 3));
      
      // Impact color
      const impactLevel = region.avgImpactScore;
      let color = '#666666'; // Default gray
      
      if (impactLevel >= 7) {
        color = '#4CAF50'; // High impact - green
      } else if (impactLevel >= 4) {
        color = '#FFC107'; // Medium impact - yellow
      } else if (impactLevel > 0) {
        color = '#F44336'; // Low impact - red
      }
      
      // Outer glow circle
      const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerCircle.setAttribute('cx', region.x);
      outerCircle.setAttribute('cy', region.y);
      outerCircle.setAttribute('r', radius + 5);
      outerCircle.setAttribute('fill', color);
      outerCircle.setAttribute('opacity', '0.3');
      svg.appendChild(outerCircle);
      
      // Main circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', region.x);
      circle.setAttribute('cy', region.y);
      circle.setAttribute('r', radius);
      circle.setAttribute('fill', color);
      circle.setAttribute('opacity', '0.8');
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', '2');
      circle.style.cursor = 'pointer';
      
      // Add hover effects
      circle.addEventListener('mouseenter', (e) => {
        circle.setAttribute('opacity', '1');
        circle.setAttribute('stroke-width', '3');
        
        // Create tooltip
        const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tooltip.setAttribute('id', `tooltip-${region.name}`);
        
        const tooltipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tooltipBg.setAttribute('x', region.x + radius + 10);
        tooltipBg.setAttribute('y', region.y - 30);
        tooltipBg.setAttribute('width', '180');
        tooltipBg.setAttribute('height', '60');
        tooltipBg.setAttribute('fill', 'rgba(0, 0, 0, 0.9)');
        tooltipBg.setAttribute('rx', '5');
        tooltip.appendChild(tooltipBg);
        
        const tooltipText1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tooltipText1.setAttribute('x', region.x + radius + 20);
        tooltipText1.setAttribute('y', region.y - 10);
        tooltipText1.setAttribute('fill', '#ffffff');
        tooltipText1.setAttribute('font-size', '12');
        tooltipText1.setAttribute('font-weight', 'bold');
        tooltipText1.textContent = region.name;
        tooltip.appendChild(tooltipText1);
        
        const tooltipText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tooltipText2.setAttribute('x', region.x + radius + 20);
        tooltipText2.setAttribute('y', region.y + 5);
        tooltipText2.setAttribute('fill', '#cccccc');
        tooltipText2.setAttribute('font-size', '10');
        tooltipText2.textContent = `${region.studyCount} studies`;
        tooltip.appendChild(tooltipText2);
        
        const tooltipText3 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tooltipText3.setAttribute('x', region.x + radius + 20);
        tooltipText3.setAttribute('y', region.y + 20);
        tooltipText3.setAttribute('fill', '#cccccc');
        tooltipText3.setAttribute('font-size', '10');
        tooltipText3.textContent = `Avg Impact: ${region.avgImpactScore.toFixed(1)}/10`;
        tooltip.appendChild(tooltipText3);
        
        svg.appendChild(tooltip);
      });
      
      circle.addEventListener('mouseleave', (e) => {
        circle.setAttribute('opacity', '0.8');
        circle.setAttribute('stroke-width', '2');
        
        const tooltip = svg.querySelector(`#tooltip-${region.name}`);
        if (tooltip) tooltip.remove();
      });
      
      svg.appendChild(circle);
      
      // Study count label
      const countLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      countLabel.setAttribute('x', region.x);
      countLabel.setAttribute('y', region.y + 4);
      countLabel.setAttribute('text-anchor', 'middle');
      countLabel.setAttribute('fill', '#ffffff');
      countLabel.setAttribute('font-size', '12');
      countLabel.setAttribute('font-weight', 'bold');
      countLabel.textContent = region.studyCount;
      svg.appendChild(countLabel);
      
      // Region name
      const nameLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameLabel.setAttribute('x', region.x);
      nameLabel.setAttribute('y', region.y + radius + 20);
      nameLabel.setAttribute('text-anchor', 'middle');
      nameLabel.setAttribute('fill', '#cccccc');
      nameLabel.setAttribute('font-size', '10');
      nameLabel.textContent = region.name;
      svg.appendChild(nameLabel);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#ffffff');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Global Research Distribution & Impact';
    svg.appendChild(title);
    
  }, [studies]);

  if (!studies || studies.length === 0) {
    return (
      <div className={styles.placeholder}>
        <h3>Geographic Impact Map</h3>
        <p>No geographic data available for visualization</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <svg ref={svgRef} className={styles.chart}></svg>
      <div className={styles.chartCaption}>
        <p>
          Global distribution of case studies with impact scoring. Circle size represents study volume,
          color indicates average impact score per region. Hover for details.
        </p>
      </div>
    </div>
  );
}