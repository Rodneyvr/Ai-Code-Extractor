import { describe, it, expect } from 'vitest';
import { getFilePreview, getFileIcon, isReadableText } from '@exporter/preview';
import type { ExtractedFile } from '@types/index';

describe('File Preview Utilities', () => {
  const createFile = (content: string): ExtractedFile => ({
    id: '1',
    filename: 'test.ts',
    path: '',
    language: 'typescript',
    content,
    isFragment: false,
    extractedAt: Date.now(),
  });

  describe('getFilePreview', () => {
    it('should return full content for short files', () => {
      const file = createFile('short content');
      const preview = getFilePreview(file, { maxLength: 100 });
      expect(preview).toBe('short content');
    });

    it('should truncate long content', () => {
      const file = createFile('x'.repeat(1000));
      const preview = getFilePreview(file, { maxLength: 100 });
      expect(preview.length).toBeLessThanOrEqual(130); // 100 + marker
      expect(preview).toContain('truncated');
    });
  });

  describe('isReadableText', () => {
    it('should detect readable text', () => {
      const file = createFile('console.log("hello");');
      expect(isReadableText(file)).toBe(true);
    });

    it('should detect binary content', () => {
      const file = createFile('\x00\x01\x02\x03\x04');
      expect(isReadableText(file)).toBe(false);
    });
  });

  describe('getFileIcon', () => {
    it('should return icon for TypeScript', () => {
      const icon = getFileIcon('index.ts');
      expect(icon).toBeDefined();
      expect(typeof icon).toBe('string');
    });

    it('should return icon for Python', () => {
      const icon = getFileIcon('script.py');
      expect(icon).toBeDefined();
    });

    it('should return default icon for unknown type', () => {
      const icon = getFileIcon('file.xyz');
      expect(icon).toBe('📄');
    });
  });
});
