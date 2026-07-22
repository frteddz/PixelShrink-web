import type { CompressedFile } from '../utils/imageUtils';
import { formatSize, calcSavings } from '../utils/imageUtils';

interface ImageFileListProps {
  files: CompressedFile[];
  onRemove: (id: string) => void;
  onDownload: (item: CompressedFile) => void;
}

export default function ImageFileList({ files, onRemove, onDownload }: ImageFileListProps) {
  if (files.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {files.map((f) => (
        <div
          key={f.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            animation: 'fadeIn 0.25s ease forwards',
          }}
        >
          <img
            src={f.preview}
            alt={f.file.name}
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-sm)',
              objectFit: 'cover',
              background: 'var(--color-background)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {f.file.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
              <span>{formatSize(f.originalSize)}</span>
              {f.compressedSize !== null && (
                <>
                  <span style={{ margin: '0 6px', color: 'var(--color-border)' }}>&rarr;</span>
                  <span style={{ color: 'var(--color-success)' }}>{formatSize(f.compressedSize)}</span>
                  <span style={{ marginLeft: 6, color: 'var(--color-primary)' }}>
                    (-{calcSavings(f.originalSize, f.compressedSize)}%)
                  </span>
                </>
              )}
            </div>
          </div>
          <div style={{ minWidth: 70, textAlign: 'right' }}>
            <StatusBadge status={f.status} />
          </div>
          {f.status === 'done' && (
            <button
              onClick={() => onDownload(f)}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              title="Download compressed"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          )}
          <button
            onClick={() => onRemove(f.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              fontSize: 18,
              lineHeight: 1,
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: CompressedFile['status'] }) {
  const styles: Record<string, React.CSSProperties> = {
    pending: { background: 'var(--color-surface-secondary)', color: 'var(--color-text-tertiary)' },
    compressing: { background: 'var(--color-info-light)', color: 'var(--color-info)' },
    done: { background: 'var(--color-success-light)', color: 'var(--color-success)' },
    error: { background: 'var(--color-error-light)', color: 'var(--color-error)' },
  };

  const labels: Record<string, string> = {
    pending: 'Pending',
    compressing: '...',
    done: 'Done',
    error: 'Error',
  };

  return (
    <span
      style={{
        ...styles[status],
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 999,
        display: 'inline-block',
      }}
    >
      {labels[status]}
    </span>
  );
}
