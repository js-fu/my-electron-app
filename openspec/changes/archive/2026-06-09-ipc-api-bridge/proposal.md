## Why

The current todo-list demo uses MSW (Mock Service Worker) in the renderer process to intercept `fetch()` calls — this works in development but MSW service workers cannot run under `file://` origins in a packaged Electron app. When connecting to a real remote REST API, the renderer would face CORS restrictions because Chromium enforces same-origin policy even inside Electron. Routing API calls through the Electron main process (Node.js) sidesteps both problems: Node.js has no CORS restrictions, and credentials/API keys stay out of the renderer context.

## What Changes

- **BREAKING**: Remove MSW from the renderer entry point (`renderer.tsx` no longer calls `worker.start()`)
- **BREAKING**: Remove `src/mocks/` directory (MSW handlers, browser setup, in-memory db)
- Add `contextBridge` in `preload.ts` to expose a typed `electronAPI` object to the renderer
- Add `ipcMain.handle()` calls in `main.ts` for all four CRUD operations (list, create, update, delete)
- Add dev-mode in-memory mock inside `main.ts` (activated when `NODE_ENV=development` and no `API_BASE_URL` is set)
- Replace `fetch()` calls in `src/features/todos/api.ts` with `window.electronAPI.todos.*` calls
- Add `src/electron.d.ts` to declare the `Window['electronAPI']` TypeScript interface
- API base URL read from `process.env.API_BASE_URL` in main process

## Capabilities

### New Capabilities

- `ipc-bridge`: contextBridge + ipcMain wiring that exposes typed todo CRUD operations from renderer to main process
- `main-process-api-client`: Node.js fetch client in main process, reads `API_BASE_URL` from env, includes dev-mode mock fallback

### Modified Capabilities

<!-- No existing spec-level requirements change — the UI behavior (loading states, CRUD, filters) is unchanged -->

## Impact

- `src/preload.ts` — rewritten from empty stub to full contextBridge definition
- `src/main.ts` — adds four `ipcMain.handle()` registrations and optional dev mock
- `src/features/todos/api.ts` — replaces `fetch()` with `window.electronAPI.todos.*`
- `src/renderer.tsx` — removes `worker.start()` wrapper, renders immediately
- `src/electron.d.ts` — new file (TypeScript ambient declaration)
- `src/mocks/` — deleted
- `public/mockServiceWorker.js` — deleted
- No changes to `useTodos.ts`, components, or CSS
- New dev dependency: none (Node.js built-in `fetch` available since Node 18; Electron 42 ships Node 20+)
