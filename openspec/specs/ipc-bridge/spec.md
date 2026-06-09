# ipc-bridge

## Purpose

The secure IPC bridge between the Electron renderer and main process. A preload
script exposes a typed `window.electronAPI.todos` surface via `contextBridge`,
backed by `todos:*` IPC channels handled in the main process, with TypeScript
declarations so the renderer is typed without importing Electron modules.

## Requirements

### Requirement: contextBridge exposes typed todo API
The preload script SHALL expose `window.electronAPI.todos` via `contextBridge.exposeInMainWorld`, providing the four methods: `list`, `create`, `update`, `delete`.

#### Scenario: API surface available in renderer
- **WHEN** the renderer accesses `window.electronAPI.todos`
- **THEN** it is a non-null object with `list`, `create`, `update`, `delete` as callable functions

#### Scenario: Isolation enforced
- **WHEN** the renderer tries to access `require('electron')` or Node.js built-ins directly
- **THEN** access is denied (contextIsolation remains true, nodeIntegration remains false)

### Requirement: IPC channel todos:list
The main process SHALL handle the `todos:list` IPC channel and return an array of todos.

#### Scenario: Returns todo array
- **WHEN** `ipcRenderer.invoke('todos:list')` is called
- **THEN** the main process returns a JSON-serialisable array of `{ id, title, completed }` objects

#### Scenario: Error propagates to renderer
- **WHEN** the underlying fetch fails or `API_BASE_URL` is unconfigured in production
- **THEN** the IPC handler re-throws a plain `{ message: string }` object
- **AND THEN** the renderer receives a rejected promise with that message

### Requirement: IPC channel todos:create
The main process SHALL handle the `todos:create` IPC channel, accepting a title string and returning the created todo.

#### Scenario: Creates and returns new todo
- **WHEN** `ipcRenderer.invoke('todos:create', 'Buy milk')` is called
- **THEN** the main process returns a `{ id, title: 'Buy milk', completed: false }` object with a unique id

#### Scenario: Rejects empty title
- **WHEN** `ipcRenderer.invoke('todos:create', '')` is called
- **THEN** the handler returns a rejected promise with `{ message: 'Title is required' }`

### Requirement: IPC channel todos:update
The main process SHALL handle the `todos:update` IPC channel, accepting an id and a patch object, and returning the updated todo.

#### Scenario: Updates completed field
- **WHEN** `ipcRenderer.invoke('todos:update', '1', { completed: true })` is called
- **THEN** the main process returns the todo with `completed: true`

#### Scenario: Unknown id returns error
- **WHEN** `ipcRenderer.invoke('todos:update', 'nonexistent', { completed: true })` is called
- **THEN** the handler returns a rejected promise with `{ message: 'Todo not found' }`

### Requirement: IPC channel todos:delete
The main process SHALL handle the `todos:delete` IPC channel, accepting an id and returning undefined on success.

#### Scenario: Deletes existing todo
- **WHEN** `ipcRenderer.invoke('todos:delete', '1')` is called
- **THEN** the main process removes the todo and returns `undefined`

#### Scenario: Unknown id returns error
- **WHEN** `ipcRenderer.invoke('todos:delete', 'nonexistent')` is called
- **THEN** the handler returns a rejected promise with `{ message: 'Todo not found' }`

### Requirement: TypeScript type declaration for electronAPI
A `src/electron.d.ts` ambient declaration file SHALL extend the global `Window` interface so that `window.electronAPI` is typed in the renderer without importing Electron modules.

#### Scenario: Renderer typechecks without Electron imports
- **WHEN** `api.ts` calls `window.electronAPI.todos.list()`
- **THEN** TypeScript resolves the return type as `Promise<Todo[]>` with no import of `electron` or `ipcRenderer`
