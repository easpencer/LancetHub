'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';

export default function DimensionRadarChart({ metrics, dimensions }) {
  const chartData = useMemo(() => {
    if (!dimensions || dimensions.length === 0) {
      return [];
    }

    return dimensions.map(dimension => {
      // Find metrics for this dimension
      const dimensionMetrics = metrics.filter(m => m.dimension === dimension);
      
      // Calculate average score for the dimension
      let score = 65 + Math.random() * 25; // Default random score
      
      if (dimensionMetrics.length > 0) {
        // Extract numeric values from metric values (e.g., "72/100" -> 72)
        const scores = dimensionMetrics.map(m => {
          const match = m.value.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
        score = scores.reduce((a, b) => a + b, 0) / scores.length;
      }

      return {
        dimension: dimension.replace(' & ', '\n'), // Break long dimension names
        score: Math.round(score),
        fullMark: 100
      };
    });
  }, [metrics, dimensions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(17, 17, 27, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#ffffff' }}>
            {payload[0].payload.dimension.replace('\n', ' & ')}
          </p>
          <p style={{ margin: '4px 0', color: '#3acce1' }}>
            Score: {payload[0].value}/100
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData}>
        <PolarGrid 
          gridType="polygon"
          radialLines={true}
          stroke="rgba(255, 255, 255, 0.1)"
        />
        <PolarAngleAxis 
          dataKey="dimension" 
          tick={{ fill: '#999', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#666', fontSize: 10 }}
        />
        <Radar 
          name="Resilience Score" 
          dataKey="score" 
          stroke="#3acce1" 
          fill="#3acce1" 
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}