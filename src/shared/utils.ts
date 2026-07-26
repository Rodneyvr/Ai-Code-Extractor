/**
 * Shared utility functions
 */

/**
 * Generate a unique ID for projects and files
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Detect programming language from file extension
 */
export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || 'unknown';
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    php: 'php',
    sql: 'sql',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    txt: 'text',
  };
  return languageMap[ext] || ext;
}

/**
 * Sanitize filename to be filesystem-safe
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"|?*/]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Extract file path components from a string like "src/components/Button.tsx"
 */
export function parseFilePath(pathString: string): { dir: string; filename: string } {
  const parts = pathString.split('/');
  const filename = parts.pop() || 'file';
  const dir = parts.join('/');
  return { dir, filename };
}