import type { Todo } from './features/todos/types';

interface ElectronTodosAPI {
  list: () => Promise<Todo[]>;
  create: (title: string) => Promise<Todo>;
  update: (id: string, patch: { completed: boolean }) => Promise<Todo>;
  delete: (id: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: {
      todos: ElectronTodosAPI;
    };
  }
}

export {};
