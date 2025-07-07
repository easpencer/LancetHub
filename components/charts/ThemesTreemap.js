'use client';

import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';

export default function ThemesTreemap({ themes }) {
  const chartData = useMemo(() => {
    if (!themes || !themes.keywords) {
      return [];
    }

    // Take top 20 keywords and structure them for treemap
    const topKeywords = themes.keywords.slice(0, 20);
    
    return [{
      name: 'Keywords',
      children: topKeywords.map((keyword, index) => ({
        name: keyword.term,
        size: keyword.count * 100, // Scale up for better visualization
        value: keyword.count,
        tfidf: keyword.tfidf
      }))
    }];
  }, [themes]);

  const COLORS = [
    '#3acce1', '#ff3b5c', '#ffd23f', '#a78bfa', '#10b981', 
    '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
    '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(17, 17, 27, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#ffffff' }}>
            {data.name}
          </p>
          <p style={{ margin: '4px 0', color: '#3acce1' }}>
            Count: {data.value}
          </p>
          <p style={{ margin: '4px 0', color: '#ffd23f' }}>
            TF-IDF: {data.tfidf?.toFixed(4)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomContent = ({ x, y, width, height, index, name, value }) => {
    const fontSize = width > 80 && height > 40 ? 14 : 
                    width > 60 && height > 30 ? 12 : 
                    width > 40 && height > 25 ? 10 : 0;

    if (fontSize === 0) return null;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: COLORS[index % COLORS.length],
            stroke: '#11111b',
            strokeWidth: 2,
            strokeOpacity: 0.5
          }}
        />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#ffffff"
          fontSize={fontSize}
          fontWeight="500"
        >
          {name}
        </text>
        {width > 60 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 16}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize={fontSize - 2}
            opacity={0.7}
          >
            ({value})
          </text>
        )}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={chartData}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#11111b"
        content={<CustomContent />}
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
}