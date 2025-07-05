'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './ProgressIndicator.module.css';

export default function ProgressIndicator() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Handle route change start
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
    };

    // Handle route change complete
    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
    };

    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleRouteChangeStart);
    
    // In Next.js 13 App Router, we can't listen to route change events directly
    // So we're listening for page load complete
    if (document.readyState === 'complete') {
      handleRouteChangeComplete();
    } else {
      window.addEventListener('load', handleRouteChangeComplete);
    }

    return () => {
      window.removeEventListener('beforeunload', handleRouteChangeStart);
      window.removeEventListener('load', handleRouteChangeComplete);
    };
  }, []);

  // When pathname changes, briefly show the progress indicator
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {isNavigating && (
        <motion.div 
          className={styles.progressBar}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      )}
    </>
  );
}
