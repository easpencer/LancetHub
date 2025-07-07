'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMemo } from 'react';

export default function OutcomesPieChart({ outcomes }) {
  const chartData = useMemo(() => {
    if (!outcomes || !outcomes.summary) {
      // Generate sample data
      return [
        { name: 'Improved', value: 45, percentage: 45 },
        { name: 'Maintained', value: 30, percentage: 30 },
        { name: 'Declined', value: 15, percentage: 15 },
        { name: 'Unknown', value: 10, percentage: 10 }
      ];
    }

    const total = outcomes.summary.totalCaseStudies || 100;
    const improved = outcomes.summary.withPositiveOutcomes || 45;
    const declined = outcomes.summary.withNegativeOutcomes || 15;
    const unknown = outcomes.summary.withUnknownOutcomes || 10;
    const maintained = total - improved - declined - unknown;

    return [
      { name: 'Improved', value: improved, percentage: (improved / total * 100).toFixed(1) },
      { name: 'Maintained', value: maintained, percentage: (maintained / total * 100).toFixed(1) },
      { name: 'Declined', value: declined, percentage: (declined / total * 100).toFixed(1) },
      { name: 'Unknown', value: unknown, percentage: (unknown / total * 100).toFixed(1) }
    ];
  }, [outcomes]);

  const COLORS = {
    'Improved': '#10b981',
    'Maintained': '#3acce1',
    'Declined': '#ff3b5c',
    'Unknown': '#6b7280'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
          <p style={{ margin: '4px 0', color: COLORS[data.name] }}>
            Count: {data.value}
          </p>
          <p style={{ margin: '4px 0', color: '#999' }}>
            Percentage: {data.payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    );
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px',
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: entry.color,
              borderRadius: '2px'
            }} />
            <span style={{ color: '#999', fontSize: '14px' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}