'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Custom hook to manage authentication state and redirects
export function useAuthState(requireAuth = false) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if authentication is required and user is not authenticated
    if (requireAuth && status === 'unauthenticated') {
      // Store the current path for redirect after login
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
    }
  }, [requireAuth, status, pathname, router]);

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading'
  };
}

// Hook to ensure protected pages are only accessible when authenticated
export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthState(true);
  
  return {
    isAuthenticated,
    isLoading,
    // Return true when the page should be rendered
    shouldRender: isAuthenticated || isLoading
  };
}