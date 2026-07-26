import { describe, it, expect } from 'vitest';
import { generateId, detectLanguage, sanitizeFilename, parseFilePath } from '@shared/utils';

describe('Shared Utilities', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^test_/);
    });

    it('should use default prefix', () => {
      const id = generateId();
      expect(id).toMatch(/^id_/);
    });
  });

  describe('detectLanguage', () => {
    it('should detect TypeScript', () => {
      expect(detectLanguage('index.ts')).toBe('typescript');
      expect(detectLanguage('App.tsx')).toBe('typescript');
    });

    it('should detect JavaScript', () => {
      expect(detectLanguage('index.js')).toBe('javascript');
      expect(detectLanguage('App.jsx')).toBe('javascript');
    });

    it('should detect Python', () => {
      expect(detectLanguage('script.py')).toBe('python');
    });

    it('should handle unknown extensions', () => {
      expect(detectLanguage('file.unknown')).toBe('unknown');
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove invalid characters', () => {
      const result = sanitizeFilename('My File<>.txt');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should replace spaces with underscores', () => {
      const result = sanitizeFilename('My File Name.txt');
      expect(result).toContain('_');
    });

    it('should convert to lowercase', () => {
      const result = sanitizeFilename('MyFile.TXT');
      expect(result).toBe(result.toLowerCase());
    });
  });

  describe('parseFilePath', () => {
    it('should parse file path correctly', () => {
      const result = parseFilePath('src/components/Button.tsx');
      expect(result.dir).toBe('src/components');
      expect(result.filename).toBe('Button.tsx');
    });

    it('should handle root level files', () => {
      const result = parseFilePath('README.md');
      expect(result.dir).toBe('');
      expect(result.filename).toBe('README.md');
    });
  });
});
