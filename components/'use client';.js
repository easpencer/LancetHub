'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path ? styles.active : '';
  };
  
  return (
    <nav className={styles.navigation}>
      <div className={styles.logo}>
        <Link href="/">Airtable Interactive Portal</Link>
      </div>
      <ul className={styles.navList}>
        <li>
          <Link href="/" className={isActive('/')}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/people" className={isActive('/people')}>
            People
          </Link>
        </li>
        <li>
          <Link href="/case-studies" className={isActive('/case-studies')}>
            Case Studies
          </Link>
        </li>
        <li>
          <Link href="/bibliography" className={isActive('/bibliography')}>
            Bibliography
          </Link>
        </li>
        <li>
          <Link href="/landscape" className={isActive('/landscape')}>
            Landscape
          </Link>
        </li>
      </ul>
    </nav>
  );
}
