## Why

`src/main.ts` currently contains the Electron app lifecycle, window creation, **and** all four IPC handler registrations plus their helpers (`ipcError`, `apiFetch`, `isDev`, `API_BASE`). This mixes two distinct concerns in one file and makes `main.ts` hard to scan. Extracting the IPC layer into its own module gives each file a single responsibility.

## What Changes

- Extract `ipcError`, `apiFetch`, `isDev`, `API_BASE`, and `registerIpcHandlers` out of `src/main.ts` into a new `src/ipc-handlers.ts`
- Move the `mockDb` import to `src/ipc-handlers.ts` (it's only needed there)
- `src/main.ts` keeps only Electron app lifecycle + window creation; calls `registerIpcHandlers()` via import
- No behaviour changes — this is a pure move refactor

## Capabilities

### New Capabilities

<!-- None — this is a refactor, no new behaviour -->

### Modified Capabilities

<!-- No spec-level requirement changes -->

## Impact

- `src/main.ts` — removes IPC-related code, adds one import
- `src/ipc-handlers.ts` — new file
- Zero runtime behaviour change
