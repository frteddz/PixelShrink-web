import { useMemo, useCallback } from 'react';
import DropZone from '../components/DropZone';
import QualityPresets from '../components/QualityPresets';
import ImageFileList from '../components/ImageFileList';
import ProgressBar from '../components/ProgressBar';
import { useCompression } from '../hooks/useCompression';
import type { CompressedFile } from '../utils/imageUtils';

export default function CompressPage() {
  const {
    files,
    quality,
    compressing,
    progress,
    addFiles,
    removeFile,
    setQuality,
    compressAll,
    clearAll,
    downloadFile,
    downloadAll,
  } = useCompression();

  const handleDownload = useCallback((item: CompressedFile) => downloadFile(item), [downloadFile]);
  const doneFiles = useMemo(() => files.filter((f) => f.status === 'done'), [files]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px', animation: 'fadeIn 0.3s ease forwards' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Compress Images</h2>

      <DropZone onFiles={addFiles} />

      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          <QualityPresets selected={quality} onSelect={setQuality} />

          {progress && <ProgressBar current={progress.current} total={progress.total} />}

          <ImageFileList files={files} onRemove={removeFile} onDownload={handleDownload} />

          {doneFiles.length > 0 && !compressing && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-success-light)',
                color: 'var(--color-success)',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              <span>Compression complete! {doneFiles.length}/{files.length} files processed.</span>
              <button
                onClick={downloadAll}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-success)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download All
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={compressAll}
              disabled={compressing}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: compressing ? 'var(--color-border)' : 'var(--color-primary)',
                color: compressing ? 'var(--color-text-tertiary)' : '#fff',
                fontWeight: 600,
                fontSize: 15,
                transition: 'all var(--transition-fast)',
              }}
            >
              {compressing ? 'Compressing...' : `Compress All (${files.length})`}
            </button>
            <button
              onClick={clearAll}
              disabled={compressing}
              style={{
                padding: '12px 20px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontWeight: 500,
                fontSize: 14,
                transition: 'all var(--transition-fast)',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
