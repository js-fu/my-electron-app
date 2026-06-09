## ADDED Requirements

### Requirement: API base URL from environment variable
The main process SHALL read the remote API base URL from `process.env.API_BASE_URL` (no trailing slash). If the variable is absent and `NODE_ENV` is `development`, the dev mock SHALL activate. If absent in production (`app.isPackaged` is true), all handlers SHALL throw `{ message: 'API_BASE_URL is not configured' }`.

#### Scenario: Production with API_BASE_URL set
- **WHEN** the packaged app starts with `API_BASE_URL=https://api.example.com`
- **THEN** all IPC handlers issue real HTTP requests to `https://api.example.com/todos`

#### Scenario: Development without API_BASE_URL
- **WHEN** `npm start` is run with no `API_BASE_URL` in environment
- **THEN** the dev mock activates and IPC handlers return seeded in-memory data

#### Scenario: Production without API_BASE_URL
- **WHEN** a packaged app runs without `API_BASE_URL`
- **THEN** every IPC handler rejects with `{ message: 'API_BASE_URL is not configured' }`

### Requirement: GET /todos via Node.js fetch
The main process `todos:list` handler SHALL fetch `GET {API_BASE_URL}/todos` using Node.js built-in `fetch` and return the parsed JSON array.

#### Scenario: Successful fetch
- **WHEN** the remote API returns HTTP 200 with a JSON array
- **THEN** the handler returns that array as the IPC result

#### Scenario: Non-2xx response becomes error
- **WHEN** the remote API returns HTTP 4xx or 5xx
- **THEN** the handler throws `{ message: 'HTTP <status>' }`

### Requirement: POST /todos via Node.js fetch
The main process `todos:create` handler SHALL POST `{ title }` to `{API_BASE_URL}/todos` and return the created todo from the 201 response body.

#### Scenario: Successful create
- **WHEN** the remote API returns HTTP 201 with a todo object
- **THEN** the handler returns that object as the IPC result

### Requirement: PATCH /todos/:id via Node.js fetch
The main process `todos:update` handler SHALL PATCH `{ completed }` to `{API_BASE_URL}/todos/:id` and return the updated todo.

#### Scenario: Successful update
- **WHEN** the remote API returns HTTP 200 with the updated todo
- **THEN** the handler returns that object as the IPC result

### Requirement: DELETE /todos/:id via Node.js fetch
The main process `todos:delete` handler SHALL send DELETE to `{API_BASE_URL}/todos/:id` and return `undefined` on HTTP 204.

#### Scenario: Successful delete
- **WHEN** the remote API returns HTTP 204
- **THEN** the handler returns `undefined` as the IPC result

### Requirement: Dev mock in main process
When `API_BASE_URL` is absent and `NODE_ENV === 'development'`, all four IPC handlers SHALL operate against a seeded in-memory store (`src/main-mock.ts`) with the same data shape and CRUD semantics as the remote API, but with no network calls and no artificial latency.

#### Scenario: Dev mock serves seeded data
- **WHEN** the app starts in development mode without `API_BASE_URL`
- **THEN** `ipcRenderer.invoke('todos:list')` returns at least 3 pre-seeded todos

#### Scenario: Dev mock CRUD is consistent
- **WHEN** a todo is created via `todos:create` in dev mode
- **THEN** a subsequent `todos:list` call includes the newly created todo
