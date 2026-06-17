import type { HttpMethod } from './ipc-handlers';

declare global {
  interface Window {
    electronAPI: {
      request: <T = unknown>(
        method: HttpMethod,
        path: string,
        body?: unknown,
      ) => Promise<T>;
      upload: <T = unknown>(
        path: string,
        file: File,
        fieldName?: string,
      ) => Promise<T>;
    };
  }
}

export {};
