import { TodoList } from './features/todos/TodoList';

export function App() {
  return (
    <main className="app">
      <h1 className="app__title">Todo List</h1>
      <TodoList />
    </main>
  );
}
