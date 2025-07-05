'use client';

import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const PandemicResilienceMapFixed = dynamic(() => import('./PandemicResilienceMapFixed'), {
  ssr: false,
  loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#fff' }}>Loading pandemic resilience map...</div>
});

export default function PandemicResilienceMap() {
  return <PandemicResilienceMapFixed />;
}