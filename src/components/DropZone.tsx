import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';

interface DropZoneProps {
  onFiles: (files: FileList | File[]) => void;
}

export default function DropZone({ onFiles }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent, over: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(over);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragOver={(e) => handleDrag(e, true)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '48px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? 'var(--color-primary-light)' : 'var(--color-surface)',
        transition: 'all var(--transition-normal)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.webp,.avif"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div style={{ fontSize: 40, marginBottom: 12, color: 'var(--color-text-tertiary)' }}>
        {dragging ? '📂' : '🖼️'}
      </div>
      <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--color-text)' }}>
        {dragging ? 'Drop images here' : 'Drag & drop images here'}
      </p>
      <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
        PNG, JPG, WebP, AVIF &mdash; or click to browse
      </p>
    </div>
  );
}
