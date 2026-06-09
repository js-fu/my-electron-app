## 1. Create src/ipc-handlers.ts

- [x] 1.1 Create `src/ipc-handlers.ts` — move `import { mockDb }`, `const isDev`, `const API_BASE`, `ipcError()`, `apiFetch()`, and `registerIpcHandlers()` from `src/main.ts` verbatim; add `import { ipcMain } from 'electron'`; export `registerIpcHandlers`

## 2. Trim src/main.ts

- [x] 2.1 Remove the moved code from `src/main.ts` (all of: `mockDb` import, `isDev`, `API_BASE`, `ipcError`, `apiFetch`, `registerIpcHandlers`)
- [x] 2.2 Add `import { registerIpcHandlers } from './ipc-handlers'` to `src/main.ts`
- [x] 2.3 Remove `ipcMain` from the `electron` import in `src/main.ts` (no longer needed there)

## 3. Verify

- [x] 3.1 Run `npx tsc --noEmit` — confirm zero errors
