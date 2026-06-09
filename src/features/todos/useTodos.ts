import { useState, useEffect, useCallback } from 'react';
import type { Todo } from './types';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';

interface UseTodosResult {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = useCallback(async (title: string) => {
    const optimisticTodo: Todo = {
      id: `optimistic-${Date.now()}`,
      title,
      completed: false,
    };
    setTodos((prev) => [optimisticTodo, ...prev]);
    try {
      const created = await createTodo(title);
      setTodos((prev) =>
        prev.map((t) => (t.id === optimisticTodo.id ? created : t)),
      );
    } catch (e: unknown) {
      setTodos((prev) => prev.filter((t) => t.id !== optimisticTodo.id));
      setError((e as Error).message);
    }
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
    try {
      const current = todos.find((t) => t.id === id);
      if (!current) return;
      const updated = await updateTodo(id, { completed: !current.completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e: unknown) {
      // revert
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
      setError((e as Error).message);
    }
  }, [todos]);

  const removeTodo = useCallback(async (id: string) => {
    const snapshot = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
    } catch (e: unknown) {
      if (snapshot) setTodos((prev) => [snapshot, ...prev]);
      setError((e as Error).message);
    }
  }, [todos]);

  return { todos, loading, error, addTodo, toggleTodo, removeTodo };
}
