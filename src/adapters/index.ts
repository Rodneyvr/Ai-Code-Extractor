/**
 * Platform-specific extraction adapters
 * Each adapter knows how to extract code from a specific AI platform
 */

import type { ExtractedFile } from '@types/index';
import { ExtractionEngine } from './extractor';

export interface PlatformAdapter {
  name: string;
  domains: string[];
  extract(pageContent: string, sourceUrl: string): ExtractedFile[];
}

/**
 * ChatGPT adapter
 */
export const ChatGPTAdapter: PlatformAdapter = {
  name: 'ChatGPT',
  domains: ['chatgpt.com', 'openai.com'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * Claude adapter
 */
export const ClaudeAdapter: PlatformAdapter = {
  name: 'Claude',
  domains: ['claude.ai'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * Gemini adapter
 */
export const GeminiAdapter: PlatformAdapter = {
  name: 'Gemini',
  domains: ['gemini.google.com'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * DeepSeek adapter
 */
export const DeepSeekAdapter: PlatformAdapter = {
  name: 'DeepSeek',
  domains: ['deepseek.com'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * Devin adapter
 */
export const DevinAdapter: PlatformAdapter = {
  name: 'Devin',
  domains: ['devin.ai'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * Grok adapter
 */
export const GrokAdapter: PlatformAdapter = {
  name: 'Grok',
  domains: ['grok.com', 'x.com'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * Perplexity adapter
 */
export const PerplexityAdapter: PlatformAdapter = {
  name: 'Perplexity',
  domains: ['perplexity.ai'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * Microsoft Copilot adapter
 */
export const CopilotAdapter: PlatformAdapter = {
  name: 'Microsoft Copilot',
  domains: ['copilot.microsoft.com'],
  extract(pageContent: string, sourceUrl: string) {
    const result = ExtractionEngine.extract(pageContent, sourceUrl);
    return result.files;
  },
};

/**
 * Registry of all adapters
 */
export const ADAPTERS: PlatformAdapter[] = [
  ChatGPTAdapter,
  ClaudeAdapter,
  GeminiAdapter,
  DeepSeekAdapter,
  DevinAdapter,
  GrokAdapter,
  PerplexityAdapter,
  CopilotAdapter,
];

/**
 * Find adapter for a given URL
 */
export function findAdapterForUrl(url: string): PlatformAdapter | undefined {
  try {
    const hostname = new URL(url).hostname;
    return ADAPTERS.find((adapter) =>
      adapter.domains.some((domain) => hostname.includes(domain))
    );
  } catch {
    return undefined;
  }
}

/**
 * Find adapter by platform name
 */
export function findAdapterByName(name: string): PlatformAdapter | undefined {
  return ADAPTERS.find(
    (adapter) => adapter.name.toLowerCase() === name.toLowerCase()
  );
}
