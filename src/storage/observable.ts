/**
 * Observable storage layer for reactive updates
 */

import type { ExtractedProject, ExtensionSettings } from '@types/index';

type Listener<T> = (data: T) => void;

/**
 * Simple observable for storage changes
 */
export class StorageObservable<T> {
  private listeners: Set<Listener<T>> = new Set();
  private currentValue: T;

  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    listener(this.currentValue);

    return () => {
      this.listeners.delete(listener);
    };
  }

  publish(value: T): void {
    this.currentValue = value;
    this.listeners.forEach((listener) => listener(value));
  }

  getValue(): T {
    return this.currentValue;
  }
}

/**
 * Storage event listener that syncs across extension contexts
 */
export function listenToStorageChanges(
  callback: (changes: Record<string, chrome.storage.StorageChange>) => void
): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ) => {
    if (areaName === 'local') {
      callback(changes);
    }
  };

  chrome.storage.onChanged.addListener(listener);

  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}
