/**
 * React hooks for ZIP export operations
 */

import { useState, useCallback } from 'react';
import type { ExtractedProject } from '@types/index';
import { exportProjectToZip, type ExportOptions, type ExportProgress } from './zip';

export interface UseExportState {
  isExporting: boolean;
  progress: ExportProgress | null;
  error: Error | null;
  blob: Blob | null;
}

/**
 * Hook for exporting projects to ZIP
 */
export function useExportProject() {
  const [state, setState] = useState<UseExportState>({
    isExporting: false,
    progress: null,
    error: null,
    blob: null,
  });

  const export_ = useCallback(
    async (project: ExtractedProject, options?: ExportOptions) => {
      setState({
        isExporting: true,
        progress: null,
        error: null,
        blob: null,
      });

      try {
        const blob = await exportProjectToZip(project, options, (progress) => {
          setState((prev) => ({
            ...prev,
            progress,
          }));
        });

        setState((prev) => ({
          ...prev,
          isExporting: false,
          blob,
        }));

        return blob;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          isExporting: false,
          error: err,
        }));
        throw err;
      }
    },
    []
  );

  return {
    ...state,
    export: export_,
  };
}
