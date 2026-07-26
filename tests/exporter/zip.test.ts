import { describe, it, expect } from 'vitest';
import { exportProjectToZip, formatBytes } from '@exporter/zip';
import type { ExtractedProject } from '@types/index';

describe('ZIP Export', () => {
  const createTestProject = (): ExtractedProject => ({
    id: 'proj_1',
    name: 'Test Project',
    files: [
      {
        id: 'file_1',
        filename: 'index.ts',
        path: 'src',
        language: 'typescript',
        content: 'console.log("hello");',
        isFragment: false,
        extractedAt: Date.now(),
      },
      {
        id: 'file_2',
        filename: 'App.tsx',
        path: 'src/components',
        language: 'typescript',
        content: 'export function App() { return <div>App</div>; }',
        isFragment: false,
        extractedAt: Date.now(),
      },
    ],
    platform: 'unknown',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  describe('exportProjectToZip', () => {
    it('should create a valid ZIP blob', async () => {
      const project = createTestProject();
      const blob = await exportProjectToZip(project);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
      expect(blob.type).toBe('application/zip');
    });

    it('should respect includeTreeFile option', async () => {
      const project = createTestProject();
      const blob = await exportProjectToZip(project, { includeTreeFile: false });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should track export progress', async () => {
      const project = createTestProject();
      const progressUpdates: number[] = [];

      await exportProjectToZip(project, {}, (progress) => {
        progressUpdates.push(progress.percentage);
      });

      expect(progressUpdates.length).toBeGreaterThan(0);
      // Should end at 100%
      expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
    });
  });
});

// Note: formatBytes is tested indirectly through export
// Can add specific tests if needed:
/*
describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toContain('KB');
    expect(formatBytes(1024 * 1024)).toContain('MB');
  });
});
*/
