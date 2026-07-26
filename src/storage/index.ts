/**
 * Storage abstraction layer for AI Code Extractor Pro
 * Provides a unified interface for Chrome storage API
 */

import type { ExtractedProject, ExtensionSettings } from '@types/index';

const STORAGE_KEYS = {
  PROJECTS: 'ace_projects',
  SETTINGS: 'ace_settings',
  LAST_EXTRACTION: 'ace_last_extraction',
} as const;

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabledPlatforms: [
    'chatgpt',
    'claude',
    'gemini',
    'deepseek',
    'devin',
    'grok',
    'perplexity',
    'copilot',
  ],
  autoMergeSplitFiles: true,
  includeTreeVisualization: true,
};

/**
 * Initialize storage with default settings if not already present
 */
export async function initializeStorage(): Promise<void> {
  const existing = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
  if (!existing[STORAGE_KEYS.SETTINGS]) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS,
      [STORAGE_KEYS.PROJECTS]: [],
    });
  }
}

/**
 * Get all projects from storage
 */
export async function getAllProjects(): Promise<ExtractedProject[]> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.PROJECTS]);
  return result[STORAGE_KEYS.PROJECTS] || [];
}

/**
 * Get a specific project by ID
 */
export async function getProjectById(projectId: string): Promise<ExtractedProject | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.id === projectId) || null;
}

/**
 * Save a new project
 */
export async function saveProject(project: ExtractedProject): Promise<void> {
  const projects = await getAllProjects();
  const existingIndex = projects.findIndex((p) => p.id === project.id);

  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }

  await chrome.storage.local.set({ [STORAGE_KEYS.PROJECTS]: projects });
}

/**
 * Delete a project by ID
 */
export async function deleteProject(projectId: string): Promise<void> {
  const projects = await getAllProjects();
  const filtered = projects.filter((p) => p.id !== projectId);
  await chrome.storage.local.set({ [STORAGE_KEYS.PROJECTS]: filtered });
}

/**
 * Get all settings
 */
export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
  return result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
}

/**
 * Update settings (partial update)
 */
export async function updateSettings(
  updates: Partial<ExtensionSettings>
): Promise<ExtensionSettings> {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: updated });
  return updated;
}

/**
 * Get last extraction metadata
 */
export async function getLastExtraction(): Promise<{ projectId: string; timestamp: number } | null> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.LAST_EXTRACTION]);
  return result[STORAGE_KEYS.LAST_EXTRACTION] || null;
}

/**
 * Set last extraction metadata
 */
export async function setLastExtraction(projectId: string): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.LAST_EXTRACTION]: {
      projectId,
      timestamp: Date.now(),
    },
  });
}

/**
 * Clear all data (for testing or reset)
 */
export async function clearAllData(): Promise<void> {
  await chrome.storage.local.clear();
  await initializeStorage();
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats(): Promise<{
  projectCount: number;
  totalSize: number;
  maxSize: number;
}> {
  const projects = await getAllProjects();
  const data = await chrome.storage.local.get(null);
  const dataStr = JSON.stringify(data);
  const totalSize = new Blob([dataStr]).size;

  return {
    projectCount: projects.length,
    totalSize,
    maxSize: 10 * 1024 * 1024, // 10MB limit for chrome.storage.local
  };
}
