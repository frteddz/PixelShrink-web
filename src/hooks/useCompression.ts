import { useState, useCallback, useRef } from 'react';
import type { CompressedFile } from '../utils/imageUtils';
import { generateId, validateImageType } from '../utils/imageUtils';
import type { QualityLevel } from '../services/compressionService';
import { compressImage } from '../services/compressionService';

export interface CompressionState {
  files: CompressedFile[];
  quality: QualityLevel;
  compressing: boolean;
  progress: { current: number; total: number } | null;
}

export function useCompression() {
  const [state, setState] = useState<CompressionState>({
    files: [],
    quality: 'high',
    compressing: false,
    progress: null,
  });

  const abortRef = useRef(false);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    const valid = incoming.filter(validateImageType);

    if (valid.length === 0) return;

    const newFiles: CompressedFile[] = valid.map((file) => ({
      id: generateId(),
      file,
      originalSize: file.size,
      compressedSize: null,
      status: 'pending' as const,
      preview: URL.createObjectURL(file),
    }));

    setState((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  }, []);

  const removeFile = useCallback((id: string) => {
    setState((prev) => {
      const file = prev.files.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return { ...prev, files: prev.files.filter((f) => f.id !== id) };
    });
  }, []);

  const setQuality = useCallback((quality: QualityLevel) => {
    setState((prev) => ({ ...prev, quality }));
  }, []);

  const compressAll = useCallback(async () => {
    abortRef.current = false;
    setState((prev) => ({ ...prev, compressing: true, progress: { current: 0, total: prev.files.length } }));

    const results: CompressedFile[] = [];

    for (let i = 0; i < state.files.length; i++) {
      if (abortRef.current) break;

      const file = state.files[i];
      results.push({ ...file, status: 'compressing' as const });

      try {
        const blob = await compressImage(file.file, state.quality, () => {
          setState((prev) => ({
            ...prev,
            files: prev.files.map((f) =>
              f.id === file.id ? { ...f, status: 'compressing' as const } : f
            ),
            progress: { current: i, total: state.files.length },
          }));
        });

        results[i] = {
          ...results[i],
          compressedSize: blob.size,
          compressedBlob: blob,
          status: 'done' as const,
        };
      } catch {
        results[i] = { ...results[i], status: 'error' as const, error: 'Compression failed' };
      }
    }

    setState((prev) => ({
      ...prev,
      files: results.map((r) => r),
      compressing: false,
      progress: null,
    }));
  }, [state.files, state.quality]);

  const downloadFile = useCallback((item: CompressedFile) => {
    if (!item.compressedBlob) return;
    const ext = item.file.name.split('.').pop() || 'png';
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(item.compressedBlob);
    a.download = `${baseName}-compressed.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const downloadAll = useCallback(() => {
    state.files.forEach((item) => {
      if (item.status === 'done' && item.compressedBlob) {
        downloadFile(item);
      }
    });
  }, [state.files, downloadFile]);

  const clearAll = useCallback(() => {
    state.files.forEach((f) => URL.revokeObjectURL(f.preview));
    setState({ files: [], quality: 'high', compressing: false, progress: null });
  }, [state.files]);

  return { ...state, addFiles, removeFile, setQuality, compressAll, clearAll, downloadFile, downloadAll };
}
