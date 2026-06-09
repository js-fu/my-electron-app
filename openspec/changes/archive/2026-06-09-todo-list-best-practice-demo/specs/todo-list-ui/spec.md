## ADDED Requirements

### Requirement: Display todo list
The system SHALL fetch and display all todos from the API on initial render, showing each todo's title and completion status.

#### Scenario: Successful load
- **WHEN** the app mounts
- **THEN** a loading indicator is displayed while fetching
- **AND THEN** the fetched todos are rendered as a list once the response arrives

#### Scenario: Empty state
- **WHEN** the API returns an empty array
- **THEN** an empty-state message ("No todos yet. Add one above!") is displayed

#### Scenario: Fetch error
- **WHEN** the API returns an error response
- **THEN** an error message is shown and the list area does not crash

### Requirement: Add a todo
The system SHALL allow users to create a new todo by entering a title and submitting.

#### Scenario: Successful add
- **WHEN** the user types a non-empty title in the input field and presses Enter or clicks "Add"
- **THEN** a POST request is sent to `/api/todos`
- **AND THEN** the new todo appears at the top of the list without a full page reload

#### Scenario: Empty title blocked
- **WHEN** the user submits the form with an empty or whitespace-only title
- **THEN** no request is sent and the input field is highlighted with a validation message

#### Scenario: Input cleared after add
- **WHEN** a todo is successfully created
- **THEN** the input field is cleared and focused

### Requirement: Toggle todo completion
The system SHALL allow users to mark a todo as complete or incomplete by clicking its checkbox.

#### Scenario: Toggle to complete
- **WHEN** the user clicks the checkbox of an incomplete todo
- **THEN** a PATCH request is sent to `/api/todos/:id` with `{ completed: true }`
- **AND THEN** the todo title is rendered with a strikethrough style

#### Scenario: Toggle to incomplete
- **WHEN** the user clicks the checkbox of a completed todo
- **THEN** a PATCH request is sent to `/api/todos/:id` with `{ completed: false }`
- **AND THEN** the strikethrough style is removed

#### Scenario: Optimistic update
- **WHEN** the user clicks the checkbox
- **THEN** the UI updates immediately without waiting for the API response

### Requirement: Delete a todo
The system SHALL allow users to remove a todo from the list.

#### Scenario: Successful delete
- **WHEN** the user clicks the delete button on a todo item
- **THEN** a DELETE request is sent to `/api/todos/:id`
- **AND THEN** the item is removed from the list

#### Scenario: Optimistic removal
- **WHEN** the user clicks the delete button
- **THEN** the item is removed from the UI immediately without waiting for the API response

### Requirement: Filter todos by status
The system SHALL provide filter controls to view All, Active, or Completed todos.

#### Scenario: Filter active
- **WHEN** the user selects the "Active" filter
- **THEN** only incomplete todos are shown

#### Scenario: Filter completed
- **WHEN** the user selects the "Completed" filter
- **THEN** only completed todos are shown

#### Scenario: Filter all
- **WHEN** the user selects the "All" filter
- **THEN** all todos are shown regardless of status
