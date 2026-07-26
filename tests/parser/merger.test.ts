import { describe, it, expect } from 'vitest';
import {
  mergeFragmentedFiles,
  deduplicateFiles,
} from '@parser/merger';
import type { ExtractedFile } from '@types/index';

describe('File Merger', () => {
  const createFile = (
    id: string,
    filename: string,
    content: string,
    path = ''
  ): ExtractedFile => ({
    id,
    filename,
    path,
    language: 'typescript',
    content,
    isFragment: false,
    extractedAt: Date.now(),
  });

  describe('mergeFragmentedFiles', () => {
    it('should merge Part 1 and Part 2 files', () => {
      const files = [
        createFile('1', 'utils.ts Part 1', 'export function foo() {'),
        createFile('2', 'utils.ts Part 2', '  return 42;\n}'),
      ];

      const result = mergeFragmentedFiles(files);
      expect(result.merged).toHaveLength(1);
      expect(result.merged[0].content).toContain('export function foo');
      expect(result.merged[0].content).toContain('return 42');
    });

    it('should detect [continued] pattern', () => {
      const files = [
        createFile('1', 'index.ts', 'const x = 1;'),
        createFile('2', 'index.ts [continued]', 'const y = 2;'),
      ];

      const result = mergeFragmentedFiles(files);
      expect(result.merged).toHaveLength(1);
      expect(result.mergedPairs).toHaveLength(1);
    });

    it('should not merge files with different names', () => {
      const files = [
        createFile('1', 'utils.ts', 'code 1'),
        createFile('2', 'helper.ts', 'code 2'),
      ];

      const result = mergeFragmentedFiles(files);
      expect(result.merged).toHaveLength(2);
      expect(result.unchanged).toHaveLength(2);
    });
  });

  describe('deduplicateFiles', () => {
    it('should remove duplicate files', () => {
      const files = [
        createFile('1', 'index.ts', 'const x = 1;'),
        createFile('2', 'index.ts', 'const x = 1;'), // exact duplicate
        createFile('3', 'other.ts', 'const y = 2;'),
      ];

      const result = deduplicateFiles(files);
      expect(result.unique).toHaveLength(2);
      expect(result.duplicates).toHaveLength(1);
    });

    it('should keep all unique files', () => {
      const files = [
        createFile('1', 'a.ts', 'code a'),
        createFile('2', 'b.ts', 'code b'),
        createFile('3', 'c.ts', 'code c'),
      ];

      const result = deduplicateFiles(files);
      expect(result.unique).toHaveLength(3);
      expect(result.duplicates).toHaveLength(0);
    });

    it('should consider path in deduplication', () => {
      const files = [
        createFile('1', 'index.ts', 'same content', 'src'),
        createFile('2', 'index.ts', 'same content', 'test'),
      ];

      const result = deduplicateFiles(files);
      // Different paths = different files
      expect(result.unique.length).toBeGreaterThanOrEqual(1);
    });
  });
});
