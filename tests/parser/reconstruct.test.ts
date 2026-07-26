import { describe, it, expect } from 'vitest';
import {
  buildProjectStructure,
  validateProjectStructure,
  generateTreeView,
} from '@parser/reconstruct';
import type { ExtractedFile, ExtractedProject } from '@types/index';

describe('Project Reconstruction', () => {
  const createFile = (
    filename: string,
    path = '',
    content = 'test'
  ): ExtractedFile => ({
    id: Math.random().toString(),
    filename,
    path,
    language: 'typescript',
    content,
    isFragment: false,
    extractedAt: Date.now(),
  });

  describe('buildProjectStructure', () => {
    it('should build virtual filesystem', () => {
      const files = [
        createFile('index.ts', 'src'),
        createFile('App.tsx', 'src/components'),
        createFile('package.json', ''),
      ];

      const structure = buildProjectStructure(files);
      expect(structure.totalFiles).toBe(3);
      expect(structure.totalDirectories).toBeGreaterThan(0);
    });

    it('should handle nested directories', () => {
      const files = [
        createFile('utils.ts', 'src/utils/helpers'),
        createFile('types.ts', 'src/types'),
      ];

      const structure = buildProjectStructure(files);
      expect(structure.totalFiles).toBe(2);
      expect(structure.totalDirectories).toBeGreaterThanOrEqual(3);
    });

    it('should handle root-level files', () => {
      const files = [
        createFile('README.md', ''),
        createFile('package.json', ''),
      ];

      const structure = buildProjectStructure(files);
      expect(structure.totalFiles).toBe(2);
    });
  });

  describe('validateProjectStructure', () => {
    it('should validate empty project', () => {
      const project: ExtractedProject = {
        id: '1',
        name: 'test',
        files: [],
        platform: 'unknown',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const validation = validateProjectStructure(project);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should detect duplicate filenames in same directory', () => {
      const project: ExtractedProject = {
        id: '1',
        name: 'test',
        files: [
          createFile('index.ts', 'src'),
          createFile('index.ts', 'src'),
        ],
        platform: 'unknown',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const validation = validateProjectStructure(project);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });

    it('should warn about very large files', () => {
      const largeContent = 'x'.repeat(1024 * 1024 + 1); // > 1MB
      const project: ExtractedProject = {
        id: '1',
        name: 'test',
        files: [createFile('large.bin', '', largeContent)],
        platform: 'unknown',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const validation = validateProjectStructure(project);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('generateTreeView', () => {
    it('should generate readable tree structure', () => {
      const files = [
        createFile('index.ts', 'src'),
        createFile('App.tsx', 'src/components'),
      ];

      const structure = buildProjectStructure(files);
      const tree = generateTreeView(structure);

      expect(tree).toContain('root');
      expect(tree.length).toBeGreaterThan(0);
    });
  });
});
