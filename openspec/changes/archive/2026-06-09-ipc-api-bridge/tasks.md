## 1. Remove MSW

- [x] 1.1 Delete `src/mocks/` directory (db.ts, handlers.ts, browser.ts)
- [x] 1.2 Delete `public/mockServiceWorker.js`
- [x] 1.3 Uninstall `msw` package from package.json and node_modules
- [x] 1.4 Remove `"msw"` workerDirectory entry from package.json

## 2. TypeScript Declaration

- [x] 2.1 Create `src/electron.d.ts` — ambient `Window` interface extension declaring `electronAPI.todos.{ list, create, update, delete }` with correct return types referencing the `Todo` type

## 3. Dev Mock (main process)

- [x] 3.1 Create `src/main-mock.ts` — in-memory store with 3 seeded todos and CRUD helper functions (same shape as `src/mocks/db.ts` but without any MSW dependency)

## 4. Main Process IPC Handlers

- [x] 4.1 Add `ipcMain` imports to `src/main.ts`
- [x] 4.2 Add `registerIpcHandlers()` function in `src/main.ts` that reads `API_BASE_URL` and `NODE_ENV`, selects real-fetch vs dev-mock mode
- [x] 4.3 Implement `todos:list` handler — GET `${API_BASE}/todos`, parse JSON array; dev mode returns mock data
- [x] 4.4 Implement `todos:create` handler — POST `${API_BASE}/todos` with `{ title }`, return 201 body; dev mode creates in mock
- [x] 4.5 Implement `todos:update` handler — PATCH `${API_BASE}/todos/:id` with `{ completed }`, return updated todo; dev mode updates mock
- [x] 4.6 Implement `todos:delete` handler — DELETE `${API_BASE}/todos/:id`, return undefined on 204; dev mode deletes from mock
- [x] 4.7 Wrap all handlers in try/catch that re-throws `{ message: string }` plain objects (not Error instances) for safe IPC serialization
- [x] 4.8 Call `registerIpcHandlers()` in the `app.on('ready', ...)` callback

## 5. Preload Bridge

- [x] 5.1 Rewrite `src/preload.ts` — import `contextBridge` and `ipcRenderer` from `electron`, call `contextBridge.exposeInMainWorld('electronAPI', { todos: { list, create, update, delete } })` where each method calls the corresponding `ipcRenderer.invoke` channel

## 6. Renderer API Layer

- [x] 6.1 Rewrite `src/features/todos/api.ts` — replace all `fetch()` calls with `window.electronAPI.todos.*` calls; wrap IPC rejections (plain objects) back into `Error` instances for consistent error handling upstream

## 7. Renderer Entry Point

- [x] 7.1 Rewrite `src/renderer.tsx` — remove `worker.start()` import and wrapper; render `<App />` directly inside `createRoot`

## 8. Verification

- [x] 8.1 Run `npm start` (no `API_BASE_URL`) — confirm dev mock serves the 3 seeded todos with no console errors
- [x] 8.2 Verify add, toggle, delete operations work through IPC round-trip in dev mode
- [x] 8.3 Set `API_BASE_URL=https://nonexistent.example.com` and confirm the app shows an error state (not a crash) when the remote API is unreachable
- [x] 8.4 Run `npx tsc --noEmit` — confirm zero TypeScript errors
