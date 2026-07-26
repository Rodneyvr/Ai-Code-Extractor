/**
 * Universal code extraction engine
 * Extracts code blocks from various AI platform formats
 */

import { generateId, detectLanguage, parseFilePath } from '@shared/utils';
import type { ExtractedFile } from '@types/index';

export interface CodeBlock {
  content: string;
  language?: string;
  filename?: string;
}

export interface ExtractionResult {
  files: ExtractedFile[];
  failedBlocks: CodeBlock[];
  warnings: string[];
}

/**
 * Main extraction engine - orchestrates parsing and file detection
 */
export class ExtractionEngine {
  /**
   * Extract files from raw text containing code blocks
   */
  static extract(text: string, sourceUrl?: string): ExtractionResult {
    const warnings: string[] = [];
    const failedBlocks: CodeBlock[] = [];
    const files: ExtractedFile[] = [];

    // Parse markdown code blocks
    const markdownBlocks = parseMarkdownCodeBlocks(text);
    console.log(`Found ${markdownBlocks.length} markdown code blocks`);

    // Parse fenced code blocks (generic)
    const genericBlocks = parseFencedCodeBlocks(text);
    console.log(`Found ${genericBlocks.length} generic fenced code blocks`);

    const allBlocks = [...markdownBlocks, ...genericBlocks];

    // Process each code block
    allBlocks.forEach((block, index) => {
      try {
        const file = this.processCodeBlock(block, index, sourceUrl);
        if (file) {
          files.push(file);
        }
      } catch (error) {
        console.error(`Failed to process block ${index}:`, error);
        warnings.push(`Failed to process code block ${index}: ${(error as Error).message}`);
        failedBlocks.push(block);
      }
    });

    return {
      files,
      failedBlocks,
      warnings,
    };
  }

  /**
   * Process a single code block into an ExtractedFile
   */
  private static processCodeBlock(
    block: CodeBlock,
    index: number,
    sourceUrl?: string
  ): ExtractedFile | null {
    // Skip empty blocks
    if (!block.content || block.content.trim().length === 0) {
      return null;
    }

    // Detect or generate filename
    let filename = block.filename || `code-${index}`;
    let path = '';

    // Try to extract path from filename patterns
    if (filename.includes('/')) {
      const parsed = parseFilePath(filename);
      path = parsed.dir;
      filename = parsed.filename;
    }

    // Add extension if missing
    const language = block.language || detectLanguage(filename);
    if (!filename.includes('.')) {
      const ext = getExtensionForLanguage(language);
      if (ext) {
        filename += ext;
      }
    }

    return {
      id: generateId('file'),
      filename,
      path,
      language,
      content: block.content,
      isFragment: false,
      sourceUrl,
      extractedAt: Date.now(),
    };
  }
}

/**
 * Parse markdown-style code blocks (```language ... ```)
 */
export function parseMarkdownCodeBlocks(text: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```([a-zA-Z0-9_+-]*)?\n?([\s\S]*?)```/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const language = match[1]?.trim() || undefined;
    const content = match[2]?.trim() || '';

    // Check for filename in the line before the code block
    const beforeBlock = text.substring(0, match.index);
    const lastLine = beforeBlock.split('\n').pop() || '';
    const filename = detectFilenameFromContext(lastLine);

    blocks.push({
      content,
      language,
      filename,
    });
  }

  return blocks;
}

/**
 * Parse generic fenced code blocks (various AI formats)
 */
export function parseFencedCodeBlocks(text: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];

  // Try various fence patterns
  const patterns = [
    { regex: /```\s*([\s\S]*?)```/g, name: 'triple-backtick' },
    { regex: /~~~\s*([\s\S]*?)~~~/g, name: 'triple-tilde' },
    { regex: /<pre>\s*<code[^>]*>\s*([\s\S]*?)<\/code>\s*<\/pre>/g, name: 'html-pre-code' },
  ];

  patterns.forEach(({ regex, name }) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const content = match[1]?.trim() || '';
      if (content && !blocks.some((b) => b.content === content)) {
        // Avoid duplicates
        blocks.push({
          content,
          language: undefined,
        });
      }
    }
  });

  return blocks;
}

/**
 * Detect filename from surrounding context
 */
export function detectFilenameFromContext(contextLine: string): string | undefined {
  // Look for patterns like:
  // - "File: src/index.ts"
  // - "(src/index.ts)"
  // - "<src/index.ts>"
  // - "src/index.ts:"

  const patterns = [
    /[Ff]ile\s*(?:name)?\s*[:\s=]+([\S]+)/,
    /\(([^()]*\.[a-zA-Z0-9]+)\)/,
    /<([^<>]*\.[a-zA-Z0-9]+)>/,
    /^((?:[a-zA-Z0-9._/-]+\/)*)([a-zA-Z0-9._-]+\.[a-zA-Z0-9]+):?$/,
  ];

  for (const pattern of patterns) {
    const match = contextLine.match(pattern);
    if (match) {
      const filename = match[match.length - 1]?.trim();
      if (filename && filename.length > 0 && filename.length < 256) {
        return filename;
      }
    }
  }

  return undefined;
}

/**
 * Get file extension for a given language
 */
export function getExtensionForLanguage(language: string): string {
  const extensionMap: Record<string, string> = {
    typescript: '.ts',
    'typescript-react': '.tsx',
    javascript: '.js',
    jsx: '.jsx',
    python: '.py',
    java: '.java',
    cpp: '.cpp',
    c: '.c',
    'c#': '.cs',
    csharp: '.cs',
    ruby: '.rb',
    go: '.go',
    rust: '.rs',
    php: '.php',
    sql: '.sql',
    html: '.html',
    css: '.css',
    scss: '.scss',
    json: '.json',
    xml: '.xml',
    yaml: '.yaml',
    markdown: '.md',
    shell: '.sh',
    bash: '.bash',
    text: '.txt',
  };

  return extensionMap[language.toLowerCase()] || '';
}
