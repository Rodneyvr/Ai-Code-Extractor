/**
 * Integration tests - end-to-end workflows
 */

import { describe, it, expect } from 'vitest';
import { ExtractionEngine } from '@parser/extractor';
import { mergeFragmentedFiles, deduplicateFiles } from '@parser/merger';
import { buildProjectStructure, validateProjectStructure } from '@parser/reconstruct';
import type { ExtractedProject } from '@types/index';

describe('Integration - End-to-End Workflows', () => {
  describe('Full extraction pipeline', () => {
    it('should extract, merge, deduplicate, and structure a project', () => {
      // Simulate ChatGPT response with split files
      const chatGPTResponse = `
Here's a React component split across two messages:

Part 1:
\`\`\`tsx
export interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export function Button({
  label,
  onClick,
}: ButtonProps) {
\`\`\`

Part 2:
\`\`\`tsx
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}
\`\`\`
      `;

      // Step 1: Extract
      const extractionResult = ExtractionEngine.extract(chatGPTResponse);
      expect(extractionResult.files.length).toBeGreaterThan(0);

      // Step 2: Merge fragments
      const mergeResult = mergeFragmentedFiles(extractionResult.files);
      expect(mergeResult.merged.length).toBeGreaterThan(0);

      // Step 3: Deduplicate
      const dedupeResult = deduplicateFiles(mergeResult.merged);
      expect(dedupeResult.unique.length).toBeGreaterThan(0);

      // Step 4: Build structure
      const structure = buildProjectStructure(dedupeResult.unique);
      expect(structure.totalFiles).toBe(dedupeResult.unique.length);

      // Step 5: Validate
      const project: ExtractedProject = {
        id: 'test',
        name: 'Test',
        files: dedupeResult.unique,
        platform: 'chatgpt',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const validation = validateProjectStructure(project);
      expect(validation.valid).toBe(true);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle a full TypeScript project extraction', () => {
      const typescriptProject = `
Here's a complete TypeScript utility library:

File: src/types.ts
\`\`\`typescript
export interface Config {
  apiUrl: string;
  timeout: number;
}

export type Result<T> = { success: true; data: T } | { success: false; error: string };
\`\`\`

File: src/api.ts
\`\`\`typescript
import type { Config, Result } from './types';

export async function fetchData<T>(url: string, config: Config): Promise<Result<T>> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(config.timeout) });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
\`\`\`

File: src/index.ts
\`\`\`typescript
export * from './types';
export * from './api';
\`\`\`
      `;

      const result = ExtractionEngine.extract(typescriptProject);
      expect(result.files.length).toBeGreaterThanOrEqual(3);
      expect(result.warnings.length).toBe(0);
    });
  });
});
