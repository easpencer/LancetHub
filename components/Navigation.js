'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSearch, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { LancetHubLogoSmall } from './LancetHubLogo';
import GlobalSearch from './GlobalSearch';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Handle scroll effect for nav bar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Public links - always visible
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/landscape-interactive', label: 'Interactive Visualization' }
  ];

  // Protected links - only visible when logged in
  const protectedLinks = [
    { href: '/landscape', label: 'Resilience Framework' },
    { href: '/pandemic-vulnerability', label: 'Pandemic Intelligence & Policy' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/analysis-insights', label: 'Analysis & Insights' },
    { href: '/people', label: 'People' },
    { href: '/bibliography-documents', label: 'Bibliography & Documents' },
    { href: '/join-us', label: 'Join Us' }
  ];

  // Combine links based on authentication status
  const navLinks = session ? [...publicLinks, ...protectedLinks] : publicLinks;

  return (
    <motion.header 
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoImage}>
            <LancetHubLogoSmall size={40} />
          </div>
          <span className={styles.logoText}>Pandemic Resilience Hub</span>
        </Link>
        
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link, index) => (
              <li key={index} className={styles.navItem}>
                <Link 
                  href={link.href} 
                  className={`${styles.navLink} ${pathname === link.href || (link.href === '/bibliography-documents' && (pathname === '/bibliography' || pathname === '/references')) ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <button 
          className={styles.searchButton}
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <FaSearch />
        </button>
        
        {/* Login/Logout button */}
        {session ? (
          <button
            className={styles.authButton}
            onClick={() => signOut()}
            aria-label="Sign out"
          >
            <FaSignOutAlt />
            <span className={styles.authText}>Sign Out</span>
          </button>
        ) : (
          <Link href="/login" className={styles.authButton}>
            <FaSignInAlt />
            <span className={styles.authText}>Sign In</span>
          </Link>
        )}
        
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className={styles.mobileNavList}>
              {navLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.mobileNavItem}
                >
                  <Link 
                    href={link.href} 
                    className={`${styles.mobileNavLink} ${pathname === link.href || (link.href === '/bibliography-documents' && (pathname === '/bibliography' || pathname === '/references')) ? styles.active : ''}`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  );
}
