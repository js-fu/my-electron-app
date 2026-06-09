## Context

The todo-list demo renderer currently calls `fetch('/api/todos')` which is intercepted by an MSW service worker running inside Chromium. This approach has two production blockers: (1) Chromium service workers cannot register on `file://` origins used by packaged Electron apps, and (2) even if they could, fetching a real remote API from the renderer would trigger CORS. The fix is to route all external HTTP through the main process (Node.js), which is not subject to either constraint.

The app already has `contextIsolation: true` and `nodeIntegration: false` set in `BrowserWindow`, which is the correct secure baseline. The preload script bridge (`contextBridge`) is the canonical Electron-approved mechanism to expose a controlled API surface to the renderer.

## Goals / Non-Goals

**Goals:**
- Remove MSW from the renderer process entirely
- Add a typed `contextBridge` exposing `window.electronAPI.todos.{list, create, update, delete}`
- Implement `ipcMain` handlers that call a remote API via Node.js `fetch`
- Support `API_BASE_URL` environment variable to configure the remote endpoint
- Preserve a dev-mode mock inside `main.ts` (activated when `API_BASE_URL` is absent in development) so the app runs without a real backend
- Keep `useTodos.ts` and all UI components unchanged

**Non-Goals:**
- Authentication / token management (out of scope for this change)
- Retry logic or request queuing
- Offline support or request caching
- Web (non-Electron) compatibility

## Decisions

### 1. contextBridge shape: namespaced object

**Decision**: Expose `window.electronAPI.todos.list()` (namespaced) rather than `window.todos_list()` (flat).

**Rationale**: Namespacing groups related handlers, avoids global namespace pollution, and scales cleanly when more domains (settings, auth, etc.) are added. One `exposeInMainWorld` call with a structured object is also more readable than multiple flat calls.

### 2. IPC channel naming: `todos:<operation>`

**Decision**: Channels named `todos:list`, `todos:create`, `todos:update`, `todos:delete`.

**Rationale**: Colon-separated namespacing is the conventional Electron pattern. It's easy to grep and avoids collision with Electron's own internal channels.

### 3. Error serialization: plain object throw

**Decision**: `ipcMain` handlers catch all errors and re-throw `{ message: string }` plain objects rather than `Error` instances.

**Rationale**: IPC uses the structured clone algorithm. `Error` objects lose their `message` property in transit (only `name` and `stack` may survive, depending on Electron version). Re-throwing a plain `{ message }` object guarantees the renderer always receives a readable error. The renderer's `api.ts` wraps this back into a real `Error` before passing it up to `useTodos`.

**Alternative rejected**: Encoding errors as successful IPC responses with an `{ ok: false, error: string }` discriminated union — more verbose and requires every call site to check `ok`.

### 4. Dev mock location: main process, not renderer

**Decision**: The in-memory mock data lives in `src/main-mock.ts` (imported by `main.ts` in dev mode), not in the renderer.

**Rationale**: This exactly mirrors the production code path — the renderer always calls IPC, always gets data back via IPC. Only the `ipcMain` handler implementation differs. This means a developer can test the full IPC round-trip even without a real backend, and switching to production requires only setting `API_BASE_URL`.

**Alternative rejected**: Keeping MSW in renderer for development — inconsistent code path, service workers still won't work in packaged `file://` builds.

### 5. API_BASE_URL without trailing slash

**Decision**: Handlers append path segments directly: `` `${API_BASE}/todos` ``. `API_BASE_URL` must not end with `/`.

**Rationale**: Simpler string concatenation, matches the most common convention. Documented in the env var description.

## Risks / Trade-offs

- **IPC overhead** → Each API call adds one IPC round-trip (~1 ms on localhost). Negligible for a todo app; not suitable for high-frequency data streams. Mitigation: none needed at this scale.
- **`API_BASE_URL` not set in production** → The mock activates only in `NODE_ENV=development`. In a packaged app (`app.isPackaged` is `true`) without `API_BASE_URL`, all handlers will throw a clear `"API_BASE_URL is not configured"` error. Mitigation: explicit error message surfaces the misconfiguration immediately.
- **Type drift between preload and main** → `electron.d.ts` in the renderer must stay in sync with the actual `contextBridge` definition. Mitigation: the TypeScript compiler will catch mismatches in the renderer; the main process types are validated by its own compilation.

## Migration Plan

1. Delete `src/mocks/` and `public/mockServiceWorker.js`
2. Rewrite `src/preload.ts` with `contextBridge`
3. Add `ipcMain` handlers and mock to `src/main.ts`
4. Rewrite `src/features/todos/api.ts` to call `window.electronAPI`
5. Strip `worker.start()` from `src/renderer.tsx`
6. Add `src/electron.d.ts`
7. Verify: `npm start` with no `API_BASE_URL` → dev mock serves data; with `API_BASE_URL` set → real API called

Rollback: revert commits touching the six files above; MSW files are recoverable from git.
