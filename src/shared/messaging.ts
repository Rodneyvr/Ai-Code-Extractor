/**
 * Messaging utilities for communicating between extension components
 */

import type { MessageRequest, MessageResponse } from '@types/index';

const MESSAGE_TIMEOUT = 5000; // 5 seconds

/**
 * Send a message from content script to background service worker
 */
export async function sendToBackground(
  message: MessageRequest
): Promise<MessageResponse> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Message timeout'));
    }, MESSAGE_TIMEOUT);

    chrome.runtime.sendMessage(message, (response) => {
      clearTimeout(timer);
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Send a message from background to content script
 */
export async function sendToContent(
  tabId: number,
  message: MessageRequest
): Promise<MessageResponse> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Message timeout'));
    }, MESSAGE_TIMEOUT);

    chrome.tabs.sendMessage(tabId, message, (response) => {
      clearTimeout(timer);
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}