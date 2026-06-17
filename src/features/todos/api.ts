import type { Todo } from './types';

function ipcError(raw: unknown): never {
  const msg = (raw as { message?: string })?.message ?? String(raw);
  throw new Error(msg);
}

const request = window.electronAPI.request;

export const fetchTodos = (): Promise<Todo[]> =>
  request<Todo[]>('GET', '/todos').catch(ipcError);

export const createTodo = (title: string): Promise<Todo> =>
  request<Todo>('POST', '/todos', { title }).catch(ipcError);

export const updateTodo = (
  id: string,
  patch: { completed: boolean },
): Promise<Todo> =>
  request<Todo>('PATCH', `/todos/${id}`, patch).catch(ipcError);

export const deleteTodo = (id: string): Promise<void> =>
  request<void>('DELETE', `/todos/${id}`).catch(ipcError);
