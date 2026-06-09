## ADDED Requirements

### Requirement: Mock GET /api/todos
The mock API SHALL respond to `GET /api/todos` with a list of seeded todo items.

#### Scenario: Returns seeded data
- **WHEN** the renderer calls `GET /api/todos`
- **THEN** the mock returns HTTP 200 with a JSON array of at least 3 seed todos with varied `completed` states

#### Scenario: Simulated latency
- **WHEN** the renderer calls `GET /api/todos`
- **THEN** the response is delayed by 400–800 ms to simulate network conditions

### Requirement: Mock POST /api/todos
The mock API SHALL handle todo creation requests and return the created resource.

#### Scenario: Creates and returns new todo
- **WHEN** the renderer calls `POST /api/todos` with `{ title: string }`
- **THEN** the mock generates a unique `id`, sets `completed: false`, and returns HTTP 201 with the new todo object

#### Scenario: Rejects empty title
- **WHEN** the renderer calls `POST /api/todos` with an empty or missing `title`
- **THEN** the mock returns HTTP 400 with `{ error: "Title is required" }`

### Requirement: Mock PATCH /api/todos/:id
The mock API SHALL handle partial updates to a todo's `completed` field.

#### Scenario: Toggles completion
- **WHEN** the renderer calls `PATCH /api/todos/:id` with `{ completed: boolean }`
- **THEN** the mock updates the in-memory record and returns HTTP 200 with the full updated todo object

#### Scenario: Unknown id returns 404
- **WHEN** the renderer calls `PATCH /api/todos/:id` with an id that does not exist in the in-memory store
- **THEN** the mock returns HTTP 404 with `{ error: "Todo not found" }`

### Requirement: Mock DELETE /api/todos/:id
The mock API SHALL handle todo deletion requests.

#### Scenario: Deletes existing todo
- **WHEN** the renderer calls `DELETE /api/todos/:id`
- **THEN** the mock removes the record from in-memory state and returns HTTP 204

#### Scenario: Unknown id returns 404
- **WHEN** the renderer calls `DELETE /api/todos/:id` with an id that does not exist
- **THEN** the mock returns HTTP 404 with `{ error: "Todo not found" }`

### Requirement: MSW service worker registration
The mock API SHALL be activated via MSW browser-mode service worker registration before the React tree mounts.

#### Scenario: Worker starts before render
- **WHEN** the app boots in development mode
- **THEN** `worker.start()` resolves before `ReactDOM.createRoot().render()` is called, ensuring no fetch calls escape to the network
