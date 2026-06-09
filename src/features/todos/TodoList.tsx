import { useState } from 'react';
import { useTodos } from './useTodos';
import { TodoInput } from './TodoInput';
import { TodoItem } from './TodoItem';
import { TodoFilter } from './TodoFilter';
import type { FilterValue } from './TodoFilter';

export function TodoList() {
  const { todos, loading, error, addTodo, toggleTodo, removeTodo } = useTodos();
  const [filter, setFilter] = useState<FilterValue>('all');

  const visible = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <section className="todo-list">
      <TodoInput onAdd={addTodo} />
      <TodoFilter current={filter} onChange={setFilter} />

      {loading && (
        <p className="todo-status" role="status">Loading…</p>
      )}
      {error && (
        <p className="todo-status todo-status--error" role="alert">{error}</p>
      )}
      {!loading && !error && visible.length === 0 && (
        <p className="todo-status">No todos yet. Add one above!</p>
      )}

      {!loading && (
        <ul className="todo-items">
          {visible.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={removeTodo}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
