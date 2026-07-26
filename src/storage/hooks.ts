/**
 * React hooks for storage operations (for popup and options UI)
 */

import { useEffect, useState } from 'react';
import type { ExtractedProject, ExtensionSettings } from '@types/index';
import * as storage from './index';
import { listenToStorageChanges } from './observable';

/**
 * Hook to fetch and subscribe to all projects
 */
export function useProjects(): ExtractedProject[] | null {
  const [projects, setProjects] = useState<ExtractedProject[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      const data = await storage.getAllProjects();
      if (mounted) {
        setProjects(data);
      }
    };

    loadProjects();

    const unsubscribe = listenToStorageChanges((changes) => {
      if (changes.ace_projects) {
        const newProjects = changes.ace_projects.newValue || [];
        if (mounted) {
          setProjects(newProjects);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return projects;
}

/**
 * Hook to fetch and subscribe to settings
 */
export function useSettings(): ExtensionSettings | null {
  const [settings, setSettings] = useState<ExtensionSettings | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      const data = await storage.getSettings();
      if (mounted) {
        setSettings(data);
      }
    };

    loadSettings();

    const unsubscribe = listenToStorageChanges((changes) => {
      if (changes.ace_settings) {
        const newSettings = changes.ace_settings.newValue;
        if (mounted) {
          setSettings(newSettings);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return settings;
}

/**
 * Hook to fetch a specific project by ID
 */
export function useProject(projectId: string): ExtractedProject | null {
  const [project, setProject] = useState<ExtractedProject | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProject = async () => {
      const data = await storage.getProjectById(projectId);
      if (mounted) {
        setProject(data);
      }
    };

    loadProject();

    const unsubscribe = listenToStorageChanges((changes) => {
      if (changes.ace_projects) {
        const projects = changes.ace_projects.newValue || [];
        const updated = projects.find((p: ExtractedProject) => p.id === projectId) || null;
        if (mounted) {
          setProject(updated);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [projectId]);

  return project;
}
