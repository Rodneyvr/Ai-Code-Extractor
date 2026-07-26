/**
 * Project reconstruction - build virtual filesystem from extracted files
 */

import type { ExtractedFile, ExtractedProject } from '@types/index';
import { generateId } from '@shared/utils';

export interface VirtualFileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: VirtualFileNode[];
  file?: ExtractedFile;
}

export interface ProjectStructure {
  root: VirtualFileNode;
  totalFiles: number;
  totalDirectories: number;
}

/**
 * Build a virtual filesystem from extracted files
 */
export function buildProjectStructure(files: ExtractedFile[]): ProjectStructure {
  const root: VirtualFileNode = {
    name: 'root',
    type: 'directory',
    path: '/',
    children: [],
  };

  const directoriesMap = new Map<string, VirtualFileNode>();
  directoriesMap.set('/', root);

  // Sort files by path to ensure directories are created in order
  const sortedFiles = files.sort((a, b) => {
    const aPath = a.path || '';
    const bPath = b.path || '';
    return aPath.localeCompare(bPath);
  });

  let directoryCount = 0;
  let fileCount = 0;

  sortedFiles.forEach((file) => {
    const parts = (file.path || '').split('/').filter((p) => p.length > 0);
    let currentPath = '/';
    let currentNode = root;

    // Create or navigate through directories
    parts.forEach((part) => {
      const nextPath = currentPath === '/' ? `/${part}` : `${currentPath}/${part}`;

      if (!directoriesMap.has(nextPath)) {
        const newDir: VirtualFileNode = {
          name: part,
          type: 'directory',
          path: nextPath,
          children: [],
        };
        currentNode.children?.push(newDir);
        directoriesMap.set(nextPath, newDir);
        directoryCount++;
      }

      currentNode = directoriesMap.get(nextPath)!;
      currentPath = nextPath;
    });

    // Add file to the current directory
    const fileNode: VirtualFileNode = {
      name: file.filename,
      type: 'file',
      path: currentPath === '/' ? `/${file.filename}` : `${currentPath}/${file.filename}`,
      file,
    };
    currentNode.children?.push(fileNode);
    fileCount++;
  });

  return {
    root,
    totalFiles: fileCount,
    totalDirectories: directoryCount,
  };
}

/**
 * Validate project structure for common issues
 */
export function validateProjectStructure(
  project: ExtractedProject
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty project
  if (project.files.length === 0) {
    errors.push('Project contains no files');
  }

  // Check for duplicate filenames in same directory
  const pathMap = new Map<string, string[]>();
  project.files.forEach((file) => {
    const dir = file.path || '/';
    if (!pathMap.has(dir)) {
      pathMap.set(dir, []);
    }
    pathMap.get(dir)!.push(file.filename);
  });

  pathMap.forEach((filenames, dir) => {
    const duplicates = filenames.filter(
      (name, index) => filenames.indexOf(name) !== index
    );
    if (duplicates.length > 0) {
      warnings.push(`Duplicate files in ${dir}: ${duplicates.join(', ')}`);
    }
  });

  // Check for very large files
  project.files.forEach((file) => {
    if (file.content.length > 1024 * 1024) {
      // 1MB
      warnings.push(`Large file detected: ${file.filename} (${file.content.length} bytes)`);
    }
  });

  // Check for suspicious content
  project.files.forEach((file) => {
    if (file.content.length < 10) {
      warnings.push(`Very small file detected: ${file.filename}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate a tree view string of the project structure
 */
export function generateTreeView(structure: ProjectStructure, maxDepth: number = 10): string {
  const lines: string[] = [];

  function traverse(node: VirtualFileNode, depth: number = 0, isLast: boolean = true) {
    if (depth > maxDepth) {
      return;
    }

    const indent = '  '.repeat(depth);
    const prefix = isLast ? '└── ' : '├── ';

    if (depth === 0) {
      lines.push(node.name);
    } else {
      lines.push(`${indent}${prefix}${node.name}`);
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child, index) => {
        const isLastChild = index === node.children!.length - 1;
        traverse(child, depth + 1, isLastChild);
      });
    }
  }

  traverse(structure.root);
  return lines.join('\n');
}
