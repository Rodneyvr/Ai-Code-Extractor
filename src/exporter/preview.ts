/**
 * File preview component and utilities
 */

import type { ExtractedFile } from '@types/index';

export interface PreviewOptions {
  maxLength?: number; // Max chars to display
  highlightLanguage?: boolean;
}

/**
 * Get preview text for a file
 */
export function getFilePreview(
  file: ExtractedFile,
  options: PreviewOptions = {}
): string {
  const { maxLength = 500 } = options;

  if (file.content.length <= maxLength) {
    return file.content;
  }

  return file.content.substring(0, maxLength) + '\n... (truncated)';
}

/**
 * Check if file content is readable text
 */
export function isReadableText(file: ExtractedFile): boolean {
  // Try to detect if content is binary
  const sample = file.content.substring(0, 512);
  const nonAsciiCount = (sample.match(/[^\x00-\x7F]/g) || []).length;
  return nonAsciiCount / sample.length < 0.1; // Less than 10% non-ASCII
}

/**
 * Get syntax highlighting class for a language
 */
export function getSyntaxHighlightClass(language: string): string {
  const classMap: Record<string, string> = {
    typescript: 'language-typescript',
    'typescript-react': 'language-typescript',
    javascript: 'language-javascript',
    jsx: 'language-javascript',
    python: 'language-python',
    java: 'language-java',
    cpp: 'language-cpp',
    c: 'language-c',
    'c#': 'language-csharp',
    ruby: 'language-ruby',
    go: 'language-go',
    rust: 'language-rust',
    php: 'language-php',
    sql: 'language-sql',
    html: 'language-html',
    css: 'language-css',
    scss: 'language-scss',
    json: 'language-json',
    xml: 'language-xml',
    yaml: 'language-yaml',
  };
  return classMap[language.toLowerCase()] || `language-${language.toLowerCase()}`;
}

/**
 * Get icon for file type
 */
export function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const iconMap: Record<string, string> = {
    ts: '📘',
    tsx: '⚛️',
    js: '📕',
    jsx: '⚛️',
    py: '🐍',
    java: '☕',
    cpp: '⚙️',
    c: '⚙️',
    cs: '⚙️',
    rb: '💎',
    go: '🐹',
    rs: '🦀',
    php: '🐘',
    sql: '🗄️',
    html: '🌐',
    css: '🎨',
    scss: '🎨',
    json: '📄',
    xml: '📄',
    yaml: '📄',
    md: '📝',
    txt: '📄',
    sh: '🐚',
  };
  return iconMap[ext] || '📄';
}
