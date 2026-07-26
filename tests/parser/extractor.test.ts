import { describe, it, expect } from 'vitest';
import {
  parseMarkdownCodeBlocks,
  parseFencedCodeBlocks,
  detectFilenameFromContext,
  getExtensionForLanguage,
  ExtractionEngine,
} from '@parser/extractor';

describe('Extraction Engine', () => {
  describe('parseMarkdownCodeBlocks', () => {
    it('should parse basic markdown code blocks', () => {
      const text = 'Here is code:\n```typescript\nconst x = 1;\n```';
      const blocks = parseMarkdownCodeBlocks(text);
      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBe('typescript');
      expect(blocks[0].content).toBe('const x = 1;');
    });

    it('should handle multiple code blocks', () => {
      const text = '```js\nvar a = 1;\n```\n\n```py\nprint(1)\n```';
      const blocks = parseMarkdownCodeBlocks(text);
      expect(blocks).toHaveLength(2);
      expect(blocks[0].language).toBe('js');
      expect(blocks[1].language).toBe('py');
    });

    it('should handle code blocks without language', () => {
      const text = '```\nplain text code\n```';
      const blocks = parseMarkdownCodeBlocks(text);
      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBeUndefined();
    });
  });

  describe('detectFilenameFromContext', () => {
    it('should detect filename from "File:" pattern', () => {
      const context = 'File: src/index.ts';
      const filename = detectFilenameFromContext(context);
      expect(filename).toBe('src/index.ts');
    });

    it('should detect filename in parentheses', () => {
      const context = 'Here is the code (src/App.tsx)';
      const filename = detectFilenameFromContext(context);
      expect(filename).toBe('src/App.tsx');
    });

    it('should detect filename in angle brackets', () => {
      const context = '<src/utils/helper.js>';
      const filename = detectFilenameFromContext(context);
      expect(filename).toBe('src/utils/helper.js');
    });

    it('should return undefined for invalid patterns', () => {
      const context = 'Just some random text';
      const filename = detectFilenameFromContext(context);
      expect(filename).toBeUndefined();
    });
  });

  describe('getExtensionForLanguage', () => {
    it('should return correct extension for typescript', () => {
      expect(getExtensionForLanguage('typescript')).toBe('.ts');
      expect(getExtensionForLanguage('typescript-react')).toBe('.tsx');
    });

    it('should return correct extension for javascript', () => {
      expect(getExtensionForLanguage('javascript')).toBe('.js');
      expect(getExtensionForLanguage('jsx')).toBe('.jsx');
    });

    it('should be case insensitive', () => {
      expect(getExtensionForLanguage('TypeScript')).toBe('.ts');
      expect(getExtensionForLanguage('PYTHON')).toBe('.py');
    });

    it('should return empty string for unknown language', () => {
      expect(getExtensionForLanguage('unknown')).toBe('');
    });
  });

  describe('ExtractionEngine.extract', () => {
    it('should extract and process code blocks', () => {
      const text = `
        Here is some code:
        
        File: utils.ts
        \`\`\`typescript
        export function helper() {
          return 42;
        }
        \`\`\`
      `;

      const result = ExtractionEngine.extract(text);
      expect(result.files).toHaveLength(1);
      expect(result.files[0].language).toBe('typescript');
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle extraction errors gracefully', () => {
      const text = '```invalid\ncode\n```';
      const result = ExtractionEngine.extract(text);
      expect(Array.isArray(result.files)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });
});
