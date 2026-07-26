import { describe, it, expect } from 'vitest';
import { validateFile, validateProject, editFile, renameFile, moveFile } from '@exporter/editor';
import type { ExtractedFile, ExtractedProject } from '@types/index';

describe('File Editor & Validator', () => {
  const createFile = (): ExtractedFile => ({
    id: '1',
    filename: 'index.ts',
    path: 'src',
    language: 'typescript',
    content: 'const x = 1;',
    isFragment: false,
    extractedAt: Date.now(),
  });

  describe('validateFile', () => {
    it('should validate normal file', () => {
      const file = createFile();
      const validation = validateFile(file);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should error on empty content', () => {
      const file = createFile();
      file.content = '';
      const validation = validateFile(file);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should warn on suspicious content', () => {
      const file = createFile();
      file.content = '<script>alert(1)</script>';
      file.language = 'typescript';
      const validation = validateFile(file);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateProject', () => {
    it('should validate project', () => {
      const project: ExtractedProject = {
        id: '1',
        name: 'Test Project',
        files: [createFile()],
        platform: 'unknown',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const validation = validateProject(project);
      expect(validation.valid).toBe(true);
    });

    it('should error on empty project name', () => {
      const project: ExtractedProject = {
        id: '1',
        name: '',
        files: [createFile()],
        platform: 'unknown',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const validation = validateProject(project);
      expect(validation.valid).toBe(false);
    });
  });

  describe('editFile', () => {
    it('should edit file content', () => {
      const file = createFile();
      const edited = editFile(file, 'new content');
      expect(edited.content).toBe('new content');
      expect(edited.id).toBe(file.id);
    });
  });

  describe('renameFile', () => {
    it('should rename file', () => {
      const file = createFile();
      const renamed = renameFile(file, 'app.ts');
      expect(renamed.filename).toBe('app.ts');
    });
  });

  describe('moveFile', () => {
    it('should move file to new path', () => {
      const file = createFile();
      const moved = moveFile(file, 'src/utils');
      expect(moved.path).toBe('src/utils');
    });
  });
});
