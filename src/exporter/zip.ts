/**
 * ZIP export functionality using JSZip
 */

import JSZip from 'jszip';
import type { ExtractedProject, ExtractedFile } from '@types/index';

export interface ExportOptions {
  includeTreeFile?: boolean;
  includeMetadata?: boolean;
  compressionLevel?: number; // 0-9, default 6
}

export interface ExportProgress {
  current: number;
  total: number;
  percentage: number;
  currentFile?: string;
}

type ProgressCallback = (progress: ExportProgress) => void;

/**
 * Export project to ZIP file
 */
export async function exportProjectToZip(
  project: ExtractedProject,
  options: ExportOptions = {},
  onProgress?: ProgressCallback
): Promise<Blob> {
  const zip = new JSZip();
  const { includeTreeFile = true, includeMetadata = true, compressionLevel = 6 } = options;

  const total = project.files.length + (includeTreeFile ? 1 : 0) + (includeMetadata ? 1 : 0);
  let current = 0;

  const updateProgress = (currentFile?: string) => {
    current++;
    onProgress?.({
      current,
      total,
      percentage: Math.round((current / total) * 100),
      currentFile,
    });
  };

  // Add all project files
  project.files.forEach((file) => {
    const path = file.path ? `${file.path}/${file.filename}` : file.filename;
    zip.file(path, file.content);
    updateProgress(path);
  });

  // Add tree file (file structure visualization)
  if (includeTreeFile) {
    const treeContent = generateTreeFile(project);
    zip.file('_PROJECT_STRUCTURE.txt', treeContent);
    updateProgress('_PROJECT_STRUCTURE.txt');
  }

  // Add metadata file
  if (includeMetadata) {
    const metadata = generateMetadataFile(project);
    zip.file('_METADATA.json', metadata);
    updateProgress('_METADATA.json');
  }

  // Generate ZIP blob with specified compression
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: compressionLevel },
  });

  return blob;
}

/**
 * Generate tree file content
 */
function generateTreeFile(project: ExtractedProject): string {
  const lines: string[] = [];
  lines.push(`Project: ${project.name}`);
  lines.push(`Platform: ${project.platform}`);
  lines.push(`Files: ${project.files.length}`);
  lines.push(`Created: ${new Date(project.createdAt).toISOString()}`);
  lines.push('');
  lines.push('='.repeat(60));
  lines.push('');

  // Group files by directory
  const directories = new Map<string, ExtractedFile[]>();

  project.files.forEach((file) => {
    const dir = file.path || '(root)';
    if (!directories.has(dir)) {
      directories.set(dir, []);
    }
    directories.get(dir)!.push(file);
  });

  // Sort directories and files
  const sortedDirs = Array.from(directories.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  sortedDirs.forEach(([dir, files]) => {
    lines.push(`\n${dir}/`);
    files.sort((a, b) => a.filename.localeCompare(b.filename)).forEach((file) => {
      lines.push(`  - ${file.filename} (${formatBytes(file.content.length)})`);
    });
  });

  return lines.join('\n');
}

/**
 * Generate metadata file
 */
function generateMetadataFile(project: ExtractedProject): string {
  const totalSize = project.files.reduce((sum, f) => sum + f.content.length, 0);

  const metadata = {
    id: project.id,
    name: project.name,
    description: project.description || '',
    platform: project.platform,
    fileCount: project.files.length,
    totalSize: totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    createdAt: new Date(project.createdAt).toISOString(),
    updatedAt: new Date(project.updatedAt).toISOString(),
    files: project.files.map((f) => ({
      filename: f.filename,
      path: f.path,
      language: f.language,
      size: f.content.length,
    })),
  };

  return JSON.stringify(metadata, null, 2);
}

/**
 * Download ZIP file to user's computer
 */
export async function downloadZip(
  project: ExtractedProject,
  options: ExportOptions = {},
  onProgress?: ProgressCallback
): Promise<void> {
  const blob = await exportProjectToZip(project, options, onProgress);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitizeFilename(project.name)}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sanitize filename for download
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Batch export multiple projects
 */
export async function exportMultipleProjects(
  projects: ExtractedProject[],
  options: ExportOptions = {},
  onProgress?: ProgressCallback
): Promise<Blob> {
  const zip = new JSZip();
  const { compressionLevel = 6 } = options;

  const total = projects.length;
  let current = 0;

  for (const project of projects) {
    const projectZip = await exportProjectToZip(project, { ...options, includeTreeFile: false }, undefined);
    const projectName = sanitizeFilename(project.name);

    // Extract the project ZIP and add its contents to the main ZIP under a folder
    const extractedZip = await JSZip.loadAsync(projectZip);
    extractedZip.forEach((relativePath, file) => {
      zip.file(`${projectName}/${relativePath}`, file);
    });

    current++;
    onProgress?.({
      current,
      total,
      percentage: Math.round((current / total) * 100),
      currentFile: project.name,
    });
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: compressionLevel },
  });

  return blob;
}
