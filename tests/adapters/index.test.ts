import { describe, it, expect } from 'vitest';
import {
  findAdapterForUrl,
  findAdapterByName,
  ADAPTERS,
} from '@adapters/index';

describe('Platform Adapters', () => {
  describe('findAdapterForUrl', () => {
    it('should detect ChatGPT', () => {
      const adapter = findAdapterForUrl('https://chatgpt.com/chat');
      expect(adapter?.name).toBe('ChatGPT');
    });

    it('should detect Claude', () => {
      const adapter = findAdapterForUrl('https://claude.ai/chat');
      expect(adapter?.name).toBe('Claude');
    });

    it('should detect Gemini', () => {
      const adapter = findAdapterForUrl('https://gemini.google.com/app');
      expect(adapter?.name).toBe('Gemini');
    });

    it('should detect DeepSeek', () => {
      const adapter = findAdapterForUrl('https://deepseek.com/chat');
      expect(adapter?.name).toBe('DeepSeek');
    });

    it('should detect Perplexity', () => {
      const adapter = findAdapterForUrl('https://perplexity.ai/search');
      expect(adapter?.name).toBe('Perplexity');
    });

    it('should return undefined for unknown domain', () => {
      const adapter = findAdapterForUrl('https://unknown.com');
      expect(adapter).toBeUndefined();
    });
  });

  describe('findAdapterByName', () => {
    it('should find adapter by name', () => {
      const adapter = findAdapterByName('ChatGPT');
      expect(adapter?.name).toBe('ChatGPT');
    });

    it('should be case insensitive', () => {
      const adapter = findAdapterByName('chatgpt');
      expect(adapter?.name).toBe('ChatGPT');
    });
  });

  describe('ADAPTERS registry', () => {
    it('should have all expected adapters', () => {
      const names = ADAPTERS.map((a) => a.name);
      expect(names).toContain('ChatGPT');
      expect(names).toContain('Claude');
      expect(names).toContain('Gemini');
      expect(names).toContain('DeepSeek');
      expect(names).toContain('Perplexity');
    });
  });
});
