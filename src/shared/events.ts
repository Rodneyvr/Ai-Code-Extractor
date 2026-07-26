/**
 * Event system for extension-wide communication
 */

type EventHandler<T> = (data: T) => void;

interface EventMap {
  'extraction:start': { projectName: string };
  'extraction:complete': { projectId: string; fileCount: number };
  'extraction:error': { error: string };
  'project:created': { projectId: string };
  'project:updated': { projectId: string };
  'project:deleted': { projectId: string };
  'settings:changed': Record<string, unknown>;
}

class EventBus {
  private listeners: Map<string, Set<EventHandler<any>>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set());
    }
    this.listeners.get(event as string)!.add(handler);

    return () => {
      this.listeners.get(event as string)?.delete(handler);
    };
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const handlers = this.listeners.get(event as string);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    this.listeners.get(event as string)?.delete(handler);
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
