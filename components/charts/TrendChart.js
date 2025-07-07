'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

export default function TrendChart({ data, dimension, color }) {
  // Generate sample trend data if no data provided
  const chartData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    
    // Generate sample data with realistic trends
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseValue = 50 + Math.random() * 30;
    let currentValue = baseValue;
    
    return months.map((month, index) => {
      // Add some realistic variation with overall trend
      const trend = (Math.random() - 0.3) * 10; // Slight upward bias
      const seasonalVariation = Math.sin((index / 12) * Math.PI * 2) * 5;
      currentValue = Math.max(20, Math.min(100, currentValue + trend + seasonalVariation));
      
      return {
        month,
        score: Math.round(currentValue * 10) / 10,
        benchmark: 65 // Industry benchmark
      };
    });
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(17, 17, 27, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#ffffff' }}>{label}</p>
          <p style={{ margin: '4px 0', color: color || '#3acce1' }}>
            Score: {payload[0].value}
          </p>
          {payload[1] && (
            <p style={{ margin: '4px 0', color: '#ffd23f' }}>
              Benchmark: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />
          <XAxis 
            dataKey="month" 
            stroke="#999"
            tick={{ fill: '#999', fontSize: 12 }}
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
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke={color || '#3acce1'} 
            strokeWidth={3}
            dot={{ fill: color || '#3acce1', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name={dimension || 'Resilience Score'}
          />
          <Line 
            type="monotone" 
            dataKey="benchmark" 
            stroke="#ffd23f" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Industry Benchmark"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}