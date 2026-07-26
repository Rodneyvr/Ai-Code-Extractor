/**
 * File editor and validation utilities
 */

import type { ExtractedFile, ExtractedProject } from '@types/index';

/**
 * Validate file content
 */
export function validateFile(file: ExtractedFile): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty content
  if (!file.content || file.content.trim().length === 0) {
    errors.push('File content is empty');
  }

  // Check for suspicious content
  if (file.content.includes('<script>') && file.language !== 'html') {
    warnings.push('File contains script tags outside of HTML file');
  }

  // Check for very long lines
  const lines = file.content.split('\n');
  const longLines = lines.filter((line) => line.length > 200);
  if (longLines.length > 0) {
    warnings.push(`${longLines.length} lines exceed 200 characters`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate project
 */
export function validateProject(project: ExtractedProject): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check project name
  if (!project.name || project.name.trim().length === 0) {
    errors.push('Project name is empty');
  }

  // Check files
  if (project.files.length === 0) {
    errors.push('Project has no files');
  }

  // Validate each file
  project.files.forEach((file) => {
    const validation = validateFile(file);
    errors.push(...validation.errors.map((e) => `${file.filename}: ${e}`));
    warnings.push(...validation.warnings.map((w) => `${file.filename}: ${w}`));
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Edit file content
 */
export function editFile(file: ExtractedFile, newContent: string): ExtractedFile {
  return {
    ...file,
    content: newContent,
  };
}

/**
 * Rename file
 */
export function renameFile(file: ExtractedFile, newName: string): ExtractedFile {
  return {
    ...file,
    filename: newName,
  };
}

/**
 * Move file to different path
 */
export function moveFile(file: ExtractedFile, newPath: string): ExtractedFile {
  return {
    ...file,
    path: newPath,
  };
}
