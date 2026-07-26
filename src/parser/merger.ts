/**
 * Split file detection and merging
 * Detects when code blocks are fragments of the same file
 */

import type { ExtractedFile } from '@types/index';

export interface MergeResult {
  merged: ExtractedFile[];
  unchanged: ExtractedFile[];
  mergedPairs: Array<{ primary: string; fragments: string[] }>;
}

/**
 * Merge split/fragmented files
 */
export function mergeFragmentedFiles(files: ExtractedFile[]): MergeResult {
  const merged: ExtractedFile[] = [];
  const unchanged: ExtractedFile[] = [];
  const mergedPairs: Array<{ primary: string; fragments: string[] }> = [];
  const processed = new Set<string>();

  files.forEach((file) => {
    if (processed.has(file.id)) {
      return;
    }

    // Find potential fragments of this file
    const fragments = files.filter(
      (other) =>
        other.id !== file.id &&
        !processed.has(other.id) &&
        isLikelyFragment(file, other)
    );

    if (fragments.length > 0) {
      // Merge this file with its fragments
      const mergedFile = mergeFiles(file, fragments);
      merged.push(mergedFile);
      mergedPairs.push({
        primary: file.filename,
        fragments: fragments.map((f) => f.filename),
      });

      // Mark all as processed
      processed.add(file.id);
      fragments.forEach((f) => processed.add(f.id));
    } else {
      unchanged.push(file);
      processed.add(file.id);
    }
  });

  return {
    merged: [...merged, ...unchanged],
    unchanged,
    mergedPairs,
  };
}

/**
 * Detect if two files are likely fragments of the same file
 */
function isLikelyFragment(file1: ExtractedFile, file2: ExtractedFile): boolean {
  // Same filename and path
  if (file1.filename === file2.filename && file1.path === file2.path) {
    return true;
  }

  // Check for "Part 1", "Part 2" patterns
  const part1Match = file1.filename.match(/[Pp]art\s*([0-9]+)/i);
  const part2Match = file2.filename.match(/[Pp]art\s*([0-9]+)/i);

  if (part1Match && part2Match) {
    const baseName1 = file1.filename.replace(/[Pp]art\s*([0-9]+)/i, '').trim();
    const baseName2 = file2.filename.replace(/[Pp]art\s*([0-9]+)/i, '').trim();
    if (baseName1 === baseName2 && baseName1.length > 0) {
      return true;
    }
  }

  // Check for continuation patterns ("...continued", "[continued]")
  if (
    (file2.filename.toLowerCase().includes('continued') ||
      file2.filename.toLowerCase().includes('...')) &&
    file1.language === file2.language
  ) {
    return true;
  }

  return false;
}

/**
 * Merge multiple file fragments into a single file
 */
function mergeFiles(primary: ExtractedFile, fragments: ExtractedFile[]): ExtractedFile {
  // Sort fragments by extraction order (extractedAt timestamp)
  const allFiles = [primary, ...fragments].sort((a, b) => a.extractedAt - b.extractedAt);

  // Concatenate content with appropriate spacing
  const content = allFiles
    .map((f) => f.content)
    .join('\n\n')
    .trim();

  return {
    ...primary,
    content,
    isFragment: true,
  };
}

/**
 * Detect duplicate files
 */
export function deduplicateFiles(
  files: ExtractedFile[]
): { unique: ExtractedFile[]; duplicates: string[] } {
  const seen = new Map<string, ExtractedFile>();
  const unique: ExtractedFile[] = [];
  const duplicates: string[] = [];

  files.forEach((file) => {
    // Create a hash of content + filename
    const key = `${file.path}/${file.filename}:${file.content.length}`;
    const contentHash = simpleHash(file.content);
    const fullKey = `${key}:${contentHash}`;

    if (seen.has(fullKey)) {
      duplicates.push(file.filename);
    } else {
      unique.push(file);
      seen.set(fullKey, file);
    }
  });

  return { unique, duplicates };
}

/**
 * Simple hash function for duplicate detection
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
