/**
 * Core type definitions for AI Code Extractor Pro
 */

export interface ExtractedFile {
  id: string;
  filename: string;
  path: string;
  language: string;
  content: string;
  isFragment: boolean; // true if part of split code
  fragmentIndex?: number;
  sourceUrl?: string;
  extractedAt: number;
}

export interface ExtractedProject {
  id: string;
  name: string;
  description?: string;
  files: ExtractedFile[];
  platform: 'chatgpt' | 'claude' | 'gemini' | 'deepseek' | 'devin' | 'grok' | 'perplexity' | 'copilot' | 'unknown';
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
}

export interface MessageRequest {
  type: string;
  payload?: unknown;
  id?: string;
}

export interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  id?: string;
}

export interface StorageData {
  projects: ExtractedProject[];
  settings: ExtensionSettings;
}

export interface ExtensionSettings {
  enabledPlatforms: string[];
  autoMergeSplitFiles: boolean;
  includeTreeVisualization: boolean;
  lastExtractedProjectId?: string;
}