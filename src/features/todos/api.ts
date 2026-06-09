import type { Todo } from './types';

function ipcError(raw: unknown): never {
  const msg = (raw as { message?: string })?.message ?? String(raw);
  throw new Error(msg);
}

export const fetchTodos = (): Promise<Todo[]> =>
  window.electronAPI.todos.list().catch(ipcError);

export const createTodo = (title: string): Promise<Todo> =>
  window.electronAPI.todos.create(title).catch(ipcError);

export const updateTodo = (
  id: string,
  patch: { completed: boolean },
): Promise<Todo> =>
  window.electronAPI.todos.update(id, patch).catch(ipcError);

export const deleteTodo = (id: string): Promise<void> =>
  window.electronAPI.todos.delete(id).catch(ipcError);
