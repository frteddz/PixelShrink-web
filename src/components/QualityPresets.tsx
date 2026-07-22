import type { QualityLevel } from '../services/compressionService';
import { QUALITY_PRESETS } from '../services/compressionService';

interface QualityPresetsProps {
  selected: QualityLevel;
  onSelect: (level: QualityLevel) => void;
}

export default function QualityPresets({ selected, onSelect }: QualityPresetsProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {QUALITY_PRESETS.map((preset) => {
        const active = selected === preset.value;
        return (
          <button
            key={preset.value}
            onClick={() => onSelect(preset.value)}
            style={{
              flex: 1,
              minWidth: 120,
              padding: '12px 16px',
              border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              background: active ? 'var(--color-primary-light)' : 'var(--color-surface)',
              color: active ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 2 }}>{preset.label}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              Q={preset.quality}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
              {preset.description}
            </div>
          </button>
        );
      })}
    </div>
  );
}
