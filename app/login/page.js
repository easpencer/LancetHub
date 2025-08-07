'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import styles from './login.module.css';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        setError('Invalid email or password. Please ensure you are a team member and using the correct password.');
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.loginBox}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.loginHeader}>
          <div className={styles.logoSection}>
            <h1>The Lancet Commission</h1>
            <p>Pandemic Resilience Hub</p>
          </div>
          <h2>Team Member Login</h2>
          <p className={styles.subtitle}>
            Please sign in with your registered team email
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <motion.div 
              className={styles.errorMessage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FaExclamationTriangle />
              <span>{error}</span>
            </motion.div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <FaEnvelope className={styles.icon} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your team email"
              required
              disabled={loading}
              className={styles.input}
              autoComplete="email"
            />
            <span className={styles.helpText}>
              Use the email address registered in our team database
            </span>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              <FaLock className={styles.icon} />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter team password"
              required
              disabled={loading}
              className={styles.input}
              autoComplete="current-password"
            />
            <span className={styles.helpText}>
              All team members use the same password
            </span>
          </div>

          <button 
            type="submit" 
            disabled={loading || !email || !password}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Signing in...
              </>
            ) : (
              <>
                <FaLock />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            This area is restricted to authorized team members only.
          </p>
          <p className={styles.footerText}>
            If you're having trouble logging in, please contact the administrator.
          </p>
        </div>
      </motion.div>

      <div className={styles.backgroundPattern}></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div className={styles.loadingSpinner}>Loading...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}