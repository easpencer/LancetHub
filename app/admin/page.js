'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);
  
  return <div>Redirecting to admin dashboard...</div>;
}
