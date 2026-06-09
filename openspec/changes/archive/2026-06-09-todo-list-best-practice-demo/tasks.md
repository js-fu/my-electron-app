## 1. Dependencies & Config

- [x] 1.1 Install React dependencies: `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`
- [x] 1.2 Install MSW: `msw`
- [x] 1.3 Add `"jsx": "react-jsx"` to `tsconfig.json` compilerOptions
- [x] 1.4 Update `vite.renderer.config.ts` to add `@vitejs/plugin-react` plugin
- [x] 1.5 Add `<div id="root"></div>` to `index.html` and update the script `src` to point to `./src/renderer.tsx`

## 2. MSW Mock API

- [x] 2.1 Initialize MSW: run `npx msw init public/ --save` to copy the service worker file to `public/`
- [x] 2.2 Create `src/mocks/db.ts` — in-memory store with 3 seeded todos (varied `completed` states) and CRUD helper functions
- [x] 2.3 Create `src/mocks/handlers.ts` — define MSW request handlers for GET, POST, PATCH, DELETE `/api/todos` and `/api/todos/:id` with 400–800 ms simulated delay
- [x] 2.4 Create `src/mocks/browser.ts` — set up the MSW `setupWorker` with the handlers and export a `worker` instance

## 3. Types & API Service

- [x] 3.1 Create `src/features/todos/types.ts` — define `Todo` interface `{ id: string; title: string; completed: boolean }`
- [x] 3.2 Create `src/features/todos/api.ts` — typed async functions: `fetchTodos()`, `createTodo(title)`, `updateTodo(id, patch)`, `deleteTodo(id)` — all using `fetch` against `/api/todos`

## 4. React Hook

- [x] 4.1 Create `src/features/todos/useTodos.ts` — custom hook that manages `todos`, `loading`, `error` state and exposes `addTodo`, `toggleTodo`, `removeTodo` action handlers with optimistic updates

## 5. UI Components

- [x] 5.1 Create `src/features/todos/TodoInput.tsx` — controlled input + submit button; blocks empty titles with inline validation
- [x] 5.2 Create `src/features/todos/TodoItem.tsx` — renders one todo row with checkbox (toggles completion) and delete button; applies strikethrough style when completed
- [x] 5.3 Create `src/features/todos/TodoFilter.tsx` — "All / Active / Completed" filter button group
- [x] 5.4 Create `src/features/todos/TodoList.tsx` — orchestrates `useTodos`, `TodoInput`, `TodoFilter`, and `TodoItem`; renders loading spinner, error message, and empty state as appropriate
- [x] 5.5 Create `src/App.tsx` — root component that renders `<TodoList />` with a page title

## 6. Entry Point

- [x] 6.1 Replace `src/renderer.ts` with `src/renderer.tsx` — awaits `worker.start()` then calls `ReactDOM.createRoot(document.getElementById('root')).render(<App />)`

## 7. Styling

- [x] 7.1 Update `src/index.css` with minimal base styles: centered layout, clean todo item rows, strikethrough for completed items, active filter button highlight

## 8. Verification

- [x] 8.1 Run `npm start` and confirm the app loads with seeded todos, no console errors
- [x] 8.2 Verify add, toggle, and delete operations work with visible loading/optimistic states
- [x] 8.3 Verify filter controls correctly show All / Active / Completed subsets
- [x] 8.4 Confirm MSW intercepts are logged in the DevTools Network tab (requests show as `(service worker)`)
