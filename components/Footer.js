import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.branding}>
            <Link href="/" className={styles.logoLink}>
              <h2 className={styles.logo}>Pandemic Resilience Hub</h2>
            </Link>
            <p className={styles.tagline}>
              Building societal resilience through research, collaboration, and action
            </p>
            <div className={styles.socialLinks}>
              <a href="https://twitter.com/TheLancet" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://www.linkedin.com/company/the-lancet/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="mailto:info@pandemic-resilience-hub.org" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>
          
          <div className={styles.linksSection}>
            <h3>About</h3>
            <ul>
              <li><Link href="/commission">The Commission</Link></li>
              <li><Link href="/commission/members">Commissioners</Link></li>
              <li><Link href="/roadmap">Roadmap</Link></li>
            </ul>
          </div>
          
          <div className={styles.linksSection}>
            <h3>Resources</h3>
            <ul>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/landscape">Landscape</Link></li>
              <li><Link href="/bibliography">Bibliography</Link></li>
            </ul>
          </div>
          
          <div className={styles.linksSection}>
            <h3>Connect</h3>
            <ul>
              <li><Link href="/join-us">Join Us</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><a href="https://www.thelancet.com" target="_blank" rel="noopener noreferrer">The Lancet</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {year} The Lancet Commission on Societal Resilience. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
