'use client';

import { useProtectedRoute } from '../hooks/useAuthState';
import LoadingState from './LoadingState';

export default function ProtectedPage({ children }) {
  const { shouldRender, isLoading } = useProtectedRoute();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Only render children if authenticated or still loading
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}