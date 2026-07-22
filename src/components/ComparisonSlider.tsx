import { useState, useRef, useCallback, type MouseEvent, type TouchEvent } from 'react';

interface ComparisonSliderProps {
  original: string;
  compressed: string;
  originalLabel?: string;
  compressedLabel?: string;
}

export default function ComparisonSlider({
  original,
  compressed,
  originalLabel = 'Original',
  compressedLabel = 'Compressed',
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  const handleMouseDown = () => { dragging.current = true; };
  const handleMouseUp = () => { dragging.current = false; };
  const handleMouseMove = (e: MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const handleTouchMove = (e: TouchEvent) => { updatePos(e.touches[0].clientX); };

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          cursor: 'ew-resize',
          background: 'var(--color-background)',
        }}
      >
        <img
          src={compressed}
          alt="Compressed"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${pos}%`,
            overflow: 'hidden',
          }}
        >
          <img
            src={original}
            alt="Original"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${pos}%`,
            width: 3,
            background: 'white',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 8px rgba(0,0,0,0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pos}%`,
            transform: 'translate(-50%, -50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: '#64748b',
            pointerEvents: 'none',
          }}
        >
          &#8646;
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
        <span>{originalLabel}</span>
        <span>{compressedLabel}</span>
      </div>
    </div>
  );
}
