interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: 'var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 4,
            background: 'linear-gradient(90deg, var(--color-primary), #a78bfa)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4, textAlign: 'right' }}>
        {current} / {total} ({pct}%)
      </div>
    </div>
  );
}
