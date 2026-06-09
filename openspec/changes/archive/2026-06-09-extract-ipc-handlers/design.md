## Context

Pure move refactor — no logic changes. All IPC-related identifiers currently in `src/main.ts` move verbatim into `src/ipc-handlers.ts`. The only edit to `main.ts` is replacing the inlined code with a single import + call.

## Goals / Non-Goals

**Goals:**
- `src/main.ts` contains only Electron lifecycle and window creation
- `src/ipc-handlers.ts` owns all IPC logic and its dependencies

**Non-Goals:**
- Changing any handler logic, error handling, or mock behaviour
- Splitting handlers further (e.g. one file per handler)

## Decisions

### What moves to `src/ipc-handlers.ts`

Everything that is not Electron app lifecycle or `BrowserWindow`:

- `import { mockDb }` from `./main-mock`
- `const isDev` and `const API_BASE`
- `function ipcError()`
- `async function apiFetch()`
- `function registerIpcHandlers()` — exported

`ipcMain` is imported inside `ipc-handlers.ts`; `main.ts` no longer needs to import it.

### `main.ts` after the move

```ts
import { registerIpcHandlers } from './ipc-handlers';
// ... rest of lifecycle unchanged
app.on('ready', () => {
  registerIpcHandlers();
  // ...
});
```

## Risks / Trade-offs

- None. Pure move — TypeScript will surface any missed references at compile time.
