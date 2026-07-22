import { lazy, Suspense, useState, type ComponentType } from 'react';
import { useTheme } from './hooks/useTheme';
import { LicenseProvider, useLicense } from './licensing/LicenseProvider';
import { AnimatedBackground } from './components/AnimatedBackground';

const HomePage = lazy(() => import('./pages/HomePage'));
const CompressPage = lazy(() => import('./pages/CompressPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));

const PAGES: Record<string, ComponentType> = {
  home: HomePage,
  compress: CompressPage,
  compare: ComparePage,
};

type PageKey = keyof typeof PAGES;

const NAV_ITEMS: { key: PageKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'compress', label: 'Compress', icon: '📦' },
  { key: 'compare', label: 'Compare', icon: '🔍' },
];

export default function App() {
  return <LicenseProvider productKey="PixelShrink"><AppInner /></LicenseProvider>;
}

function AppInner() {
  const [page, setPage] = useState<PageKey>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { isPro, loading: proLoading, setShowProModal } = useLicense();
  const PageComponent = PAGES[page];

  return (
    <>
      <AnimatedBackground />
      <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu"
        style={{ position: 'fixed', top: '0.75rem', left: '0.75rem', zIndex: 110, display: 'none', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
          ) : (
            <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
          )}
        </svg>
      </button>
      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {mobileMenuOpen && (
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
            className="mobile-overlay" />
        )}
        <nav className={'sidebar-nav' + (mobileMenuOpen ? ' open' : '')}
        style={{
          width: 220,
          flexShrink: 0,
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, padding: '8px 12px', marginBottom: 24, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          PixelShrink
          {!proLoading && (
            <span style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              padding: '0.125rem 0.375rem',
              borderRadius: 'var(--radius-sm)',
              background: isPro ? 'var(--color-success-light)' : 'var(--color-warning-light)',
              color: isPro ? 'var(--color-success)' : 'var(--color-warning)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {isPro ? 'Studio Pass' : 'Free'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { setPage(item.key); setMobileMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: page === item.key ? 'var(--color-primary-light)' : 'transparent',
                color: page === item.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: page === item.key ? 600 : 400,
                fontSize: 14,
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        {!isPro && (
          <button
            onClick={() => setShowProModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 12px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              marginBottom: '8px',
              width: '100%',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Unlock Studio Pass
          </button>
        )}
        <button
          onClick={toggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: 14,
            marginTop: 'auto',
          }}
        >
          <span>{dark ? '☀️' : '🌙'}</span>
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <a
          href="https://frteddz.github.io/Euthenia-Studio-Website/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            padding: '6px 0', fontSize: '0.65rem', color: 'var(--color-text-tertiary)',
            textDecoration: 'none', borderTop: '1px solid var(--color-border)', marginTop: '4px',
          }}
        >
          Made by <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Euthenia Studio</span>
        </a>
      </nav>
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        <Suspense
          fallback={
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              Loading...
            </div>
          }
        >
          <PageComponent />
        </Suspense>
      </main>
    </div>
    </>
  );
}
