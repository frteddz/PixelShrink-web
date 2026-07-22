export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif';

export interface CompressedFile {
  id: string;
  file: File;
  originalSize: number;
  compressedSize: number | null;
  compressedBlob?: Blob;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
  preview: string;
}

const ALLOWED_TYPES: ImageFormat[] = ['png', 'jpg', 'jpeg', 'webp', 'avif'];

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function validateImageType(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() as ImageFormat | undefined;
  return ext ? ALLOWED_TYPES.includes(ext) : false;
}

export function calcSavings(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round((1 - compressed / original) * 100);
}

export function generateId(): string {
  return crypto.randomUUID();
}
