'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

export default function MetricsBarChart({ metrics }) {
  const chartData = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return [];
    }

    // Take top 8 metrics and extract their numeric values
    return metrics.slice(0, 8).map(metric => {
      // Extract numeric value from strings like "72/100"
      const match = metric.value.match(/(\d+)/);
      const value = match ? parseInt(match[1]) : 0;
      
      return {
        name: metric.name.length > 25 ? metric.name.substring(0, 25) + '...' : metric.name,
        fullName: metric.name,
        current: value,
        previous: Math.max(0, value - parseFloat(metric.changePercent || 0)),
        change: parseFloat(metric.changePercent || 0)
      };
    });
  }, [metrics]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(17, 17, 27, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px',
          maxWidth: '300px'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
            {data.fullName}
          </p>
          <p style={{ margin: '4px 0', color: '#3acce1' }}>
            Current: {payload[0].value}/100
          </p>
          <p style={{ margin: '4px 0', color: '#ff3b5c' }}>
            Previous: {payload[1]?.value}/100
          </p>
          <p style={{ 
            margin: '4px 0', 
            color: data.change >= 0 ? '#3acce1' : '#ff3b5c',
            fontWeight: 600 
          }}>
            Change: {data.change >= 0 ? '+' : ''}{data.change}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ x, y, width, value }) => {
    return (
      <text 
        x={x + width / 2} 
        y={y - 5} 
        fill="#999" 
        textAnchor="middle" 
        fontSize="12"
      >
        {value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255, 255, 255, 0.05)"
          vertical={false}
        />
        <XAxis 
          dataKey="name" 
          stroke="#999"
          tick={{ fill: '#999', fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={100}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
        />
        <YAxis 
          stroke="#999"
          tick={{ fill: '#999', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
        <Bar 
          dataKey="current" 
          fill="#3acce1" 
          name="Current Score"
          radius={[8, 8, 0, 0]}
          label={<CustomLabel />}
        />
        <Bar 
          dataKey="previous" 
          fill="#ff3b5c" 
          name="Previous Score"
          radius={[8, 8, 0, 0]}
          opacity={0.6}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}