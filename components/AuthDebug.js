'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Fetch debug info from API
    fetch('/api/auth-debug')
      .then(res => res.json())
      .then(data => setDebugInfo(data))
      .catch(err => console.error('Debug fetch error:', err));
  }, [session]);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: '#000',
      color: '#0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '11px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 9999,
      opacity: 0.9
    }}>
      <div>Auth Status: {status}</div>
      <div>Session: {session ? 'Active' : 'None'}</div>
      {session && (
        <>
          <div>User: {session.user?.email}</div>
          <div>Role: {session.user?.role}</div>
        </>
      )}
      {debugInfo && (
        <>
          <hr style={{margin: '5px 0'}} />
          <div>Cookies:</div>
          <div>- Session: {debugInfo.cookies?.sessionToken}</div>
          <div>- Secure: {debugInfo.cookies?.secureSessionToken}</div>
          <div>ENV: {debugInfo.environment?.NODE_ENV}</div>
          <div>URL: {debugInfo.environment?.NEXTAUTH_URL || 'not set'}</div>
          <div>Secret: {debugInfo.environment?.hasSecret ? 'set' : 'MISSING!'}</div>
        </>
      )}
    </div>
  );
}