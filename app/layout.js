import './globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export const metadata = {
  title: {
    default: 'Pandemic Resilience Hub - The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future',
    template: '%s | Pandemic Resilience Hub'
  },
  description: 'The official platform for The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future. Discover community resilience frameworks, case studies, and actionable strategies for pandemic preparedness.',
  keywords: ['Lancet Commission', 'US Societal Resilience', 'Pandemic Age', 'Community Resilience', 'Public Health', 'Pandemic Preparedness', 'Global Health'],
  author: 'The Lancet Commission on US Societal Resilience in a Global Pandemic Age',
  openGraph: {
    title: 'Pandemic Resilience Hub - The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future',
    description: 'Discover community resilience frameworks and pandemic preparedness strategies from The Lancet Commission.',
    url: 'https://pandemic-resilience-hub.org',
    siteName: 'Pandemic Resilience Hub',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pandemic Resilience Hub - The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future',
    description: 'Discover community resilience frameworks and pandemic preparedness strategies from The Lancet Commission.',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
