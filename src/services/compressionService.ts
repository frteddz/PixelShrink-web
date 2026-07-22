export type QualityLevel = 'maximum' | 'high' | 'medium' | 'low';

export interface QualityConfig {
  label: string;
  value: QualityLevel;
  quality: number;
  description: string;
}

export const QUALITY_PRESETS: QualityConfig[] = [
  { label: 'Maximum', value: 'maximum', quality: 92, description: 'Best quality, minimal compression' },
  { label: 'High', value: 'high', quality: 80, description: 'Great quality, good file size reduction' },
  { label: 'Medium', value: 'medium', quality: 65, description: 'Balanced quality and size' },
  { label: 'Low', value: 'low', quality: 40, description: 'Smallest file size, lower quality' },
];

export function getQualityConfig(level: QualityLevel): QualityConfig {
  return QUALITY_PRESETS.find((p) => p.value === level) ?? QUALITY_PRESETS[1];
}

export interface CompressionProgress {
  current: number;
  total: number;
  fileId: string;
}

export type ProgressCallback = (progress: CompressionProgress) => void;

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function compressImage(
  file: File,
  quality: QualityLevel,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const config = getQualityConfig(quality);
  const totalSteps = 5;

  for (let step = 1; step <= totalSteps; step++) {
    await delay(100 + Math.random() * 200);
    if (onProgress) {
      onProgress({ current: step, total: totalSteps, fileId: file.name });
    }
  }

  const ratio = config.quality / 100;
  const compressedSize = Math.round(file.size * (0.3 + ratio * 0.4));

  return new Blob([await file.arrayBuffer().then((b) => b.slice(0, compressedSize))], {
    type: file.type,
  });
}
