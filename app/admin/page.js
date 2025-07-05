'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);
  
  return <div>Redirecting to admin dashboard...</div>;
}
