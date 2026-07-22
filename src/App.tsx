import { lazy, Suspense, useState, type ComponentType } from 'react';
import { useTheme } from './hooks/useTheme';

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
  const [page, setPage] = useState<PageKey>('home');
  const { dark, toggle } = useTheme();
  const PageComponent = PAGES[page];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav
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
        <div style={{ fontSize: 20, fontWeight: 700, padding: '8px 12px', marginBottom: 24, letterSpacing: '-0.02em' }}>
          PixelShrink
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
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
  );
}
