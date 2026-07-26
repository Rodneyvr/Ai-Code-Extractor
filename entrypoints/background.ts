import * as storage from '@storage/index';
import { eventBus } from '@shared/events';

export default defineBackground(() => {
  console.log('AI Code Extractor Pro background service worker started.');

  // Initialize storage on background load
  storage.initializeStorage().catch((error) => {
    console.error('Failed to initialize storage:', error);
  });

  // Listen for messages from content scripts and popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);

    handleMessage(request, sender)
      .then((response) => {
        sendResponse({ success: true, data: response });
      })
      .catch((error) => {
        console.error('Error handling message:', error);
        sendResponse({ success: false, error: error.message });
      });

    // Keep the message channel open for async response
    return true;
  });

  // Listen to storage changes and emit events
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      if (changes.ace_settings) {
        eventBus.emit('settings:changed', changes.ace_settings.newValue || {});
      }
      if (changes.ace_projects) {
        // Emit generic update event
        console.log('Projects updated');
      }
    }
  });
});

interface MessagePayload {
  type: string;
  payload?: unknown;
}

/**
 * Handle incoming messages from content scripts and popup
 */
async function handleMessage(
  request: MessagePayload,
  sender: chrome.runtime.MessageSender
): Promise<unknown> {
  const { type, payload } = request;

  switch (type) {
    case 'GET_PROJECTS':
      return await storage.getAllProjects();

    case 'GET_PROJECT':
      return await storage.getProjectById(payload as string);

    case 'SAVE_PROJECT':
      await storage.saveProject(payload as any);
      eventBus.emit('project:created', { projectId: (payload as any).id });
      return { success: true };

    case 'DELETE_PROJECT':
      await storage.deleteProject(payload as string);
      eventBus.emit('project:deleted', { projectId: payload as string });
      return { success: true };

    case 'GET_SETTINGS':
      return await storage.getSettings();

    case 'UPDATE_SETTINGS':
      return await storage.updateSettings(payload as any);

    case 'GET_STORAGE_STATS':
      return await storage.getStorageStats();

    case 'CLEAR_ALL_DATA':
      await storage.clearAllData();
      return { success: true };

    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}
