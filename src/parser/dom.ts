/**
 * Extract code from HTML DOM elements
 * Useful for AI platforms that render code in DOM rather than markdown
 */

import { generateId, detectLanguage } from '@shared/utils';
import type { ExtractedFile } from '@types/index';

export interface DOMCodeBlock {
  element: Element;
  content: string;
  language?: string;
}

/**
 * Extract code blocks from DOM
 */
export function extractCodeFromDOM(): ExtractedFile[] {
  const files: ExtractedFile[] = [];
  const codeBlocks = findCodeBlocksInDOM();

  codeBlocks.forEach((block, index) => {
    const file: ExtractedFile = {
      id: generateId('file'),
      filename: `code-${index}`,
      path: '',
      language: block.language || 'unknown',
      content: block.content,
      isFragment: false,
      sourceUrl: window.location.href,
      extractedAt: Date.now(),
    };

    // Try to infer filename from context
    const filename = inferFilenameFromContext(block.element);
    if (filename) {
      file.filename = filename;
    }

    files.push(file);
  });

  return files;
}

/**
 * Find code blocks in DOM
 */
function findCodeBlocksInDOM(): DOMCodeBlock[] {
  const blocks: DOMCodeBlock[] = [];

  // Common selectors for code blocks across platforms
  const selectors = [
    'pre code',
    'code[class*="language"]',
    'code[class*="hljs"]',
    '[class*="code-block"] code',
    '[class*="prism-code"]',
    '[role="img"][aria-label*="code"]', // For AI platforms that use aria-label
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      const content = element.textContent?.trim() || '';
      if (content && content.length > 0) {
        // Detect language from class name
        const className = element.className || '';
        let language: string | undefined;

        const languageMatch =
          className.match(/language-(\w+)/i) ||
          className.match(/hljs-(\w+)/i) ||
          className.match(/(\w+)(?:\s|$)/i);

        if (languageMatch) {
          language = languageMatch[1];
        }

        blocks.push({
          element,
          content,
          language,
        });
      }
    });
  });

  return blocks;
}

/**
 * Infer filename from DOM context
 */
function inferFilenameFromContext(element: Element): string | undefined {
  // Walk up the DOM tree to find context
  let current = element.parentElement;
  let depth = 0;

  while (current && depth < 5) {
    // Look for common filename patterns in text content
    const text = current.textContent || '';
    const filenameMatch = text.match(
      /(\w[\w./-]*\.(ts|tsx|js|jsx|py|java|cpp|c|cs|rb|go|rs|php|sql|html|css|scss|json|xml|yaml|md|sh|bash))/i
    );

    if (filenameMatch) {
      return filenameMatch[0];
    }

    // Look for "File:" or "Filename:" labels
    const labelMatch = text.match(/(?:File|Filename)\s*[:\s=]+([\S]+)/i);
    if (labelMatch) {
      return labelMatch[1];
    }

    current = current.parentElement;
    depth++;
  }

  return undefined;
}

/**
 * Extract code blocks from a text selection (for copy-paste workflows)
 */
export function extractFromSelection(): ExtractedFile[] {
  const selection = window.getSelection();
  if (!selection || selection.toString().length === 0) {
    return [];
  }

  const files: ExtractedFile[] = [];
  const content = selection.toString();

  // Parse selection as potential markdown or code
  if (content.includes('```')) {
    // Looks like markdown
    const blocks = content.match(/```([a-zA-Z0-9_+-]*)?\n?([\s\S]*?)```/g) || [];
    blocks.forEach((block, index) => {
      const cleaned = block.replace(/^```[a-zA-Z0-9_+-]*\n?|```$/g, '').trim();
      files.push({
        id: generateId('file'),
        filename: `selection-${index}`,
        path: '',
        language: 'unknown',
        content: cleaned,
        isFragment: false,
        sourceUrl: window.location.href,
        extractedAt: Date.now(),
      });
    });
  } else {
    // Raw code block
    files.push({
      id: generateId('file'),
      filename: 'selection',
      path: '',
      language: 'unknown',
      content,
      isFragment: false,
      sourceUrl: window.location.href,
      extractedAt: Date.now(),
    });
  }

  return files;
}
