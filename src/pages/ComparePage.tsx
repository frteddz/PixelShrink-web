import { useState, useRef } from 'react';
import ComparisonSlider from '../components/ComparisonSlider';
import { formatSize } from '../utils/imageUtils';

interface ImageInfo {
  src: string;
  name: string;
  size: number;
}

export default function ComparePage() {
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [compressed, setCompressed] = useState<ImageInfo | null>(null);
  const origRef = useRef<HTMLInputElement>(null);
  const compRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File, setter: (info: ImageInfo) => void) => {
    const src = URL.createObjectURL(file);
    setter({ src, name: file.name, size: file.size });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px', animation: 'fadeIn 0.3s ease forwards' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Compare Images</h2>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <button
            onClick={() => origRef.current?.click()}
            style={{
              width: '100%',
              padding: '40px 16px',
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all var(--transition-fast)',
            }}
          >
            {original ? (
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {original.name} ({formatSize(original.size)})
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                Click to select original
              </div>
            )}
          </button>
          <input
            ref={origRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.avif"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], setOriginal)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <button
            onClick={() => compRef.current?.click()}
            style={{
              width: '100%',
              padding: '40px 16px',
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all var(--transition-fast)',
            }}
          >
            {compressed ? (
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                {compressed.name} ({formatSize(compressed.size)})
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                Click to select compressed
              </div>
            )}
          </button>
          <input
            ref={compRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.avif"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], setCompressed)}
          />
        </div>
      </div>

      {original && compressed && (
        <>
          <ComparisonSlider
            original={original.src}
            compressed={compressed.src}
            originalLabel={`Original: ${formatSize(original.size)}`}
            compressedLabel={`Compressed: ${formatSize(compressed.size)}`}
          />
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>File Info</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span>Original: {original.name} &mdash; {formatSize(original.size)}</span>
              <span>Compressed: {compressed.name} &mdash; {formatSize(compressed.size)}</span>
              {original.size > 0 && (
                <span style={{ color: 'var(--color-success)' }}>
                  Savings: -{Math.round((1 - compressed.size / original.size) * 100)}%
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {(!original || !compressed) && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-tertiary)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p>Select both original and compressed images to compare.</p>
        </div>
      )}
    </div>
  );
}
