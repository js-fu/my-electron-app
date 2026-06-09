interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: '1', title: 'Learn React best practices', completed: true },
  { id: '2', title: 'Set up IPC bridge', completed: true },
  { id: '3', title: 'Connect to real backend', completed: false },
];

let nextId = 4;

export const mockDb = {
  list(): Todo[] {
    return [...todos];
  },
  create(title: string): Todo {
    const todo: Todo = { id: String(nextId++), title, completed: false };
    todos = [todo, ...todos];
    return todo;
  },
  update(id: string, patch: { completed: boolean }): Todo | null {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    todos[idx] = { ...todos[idx], ...patch };
    return todos[idx];
  },
  delete(id: string): boolean {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    todos = todos.filter((t) => t.id !== id);
    return true;
  },
};
