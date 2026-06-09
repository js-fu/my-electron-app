## Context

The project is an Electron 42 app using Vite as its bundler (via `@electron-forge/plugin-vite`) and TypeScript. The renderer process currently has a vanilla `renderer.ts` with no UI framework. There is no existing component architecture, state management, or data-fetching layer.

The goal is to add a self-contained todo-list demo that demonstrates best practices for the stack: React for the UI, a typed service layer for API communication, and MSW for realistic mock API responses — all without altering the main process or preload bridge.

## Goals / Non-Goals

**Goals:**
- Introduce React to the renderer process with minimal Vite config changes
- Implement a todo CRUD UI with proper loading, error, and empty states
- Provide a mock API that behaves like a real REST API (latency, error simulation) using MSW browser mode
- Keep the component tree shallow and co-located with the feature (`src/features/todos/`)
- Type-safe throughout: typed API responses, typed component props

**Non-Goals:**
- Persistent storage (no IPC to main process, no SQLite, no localStorage)
- Authentication or user management
- Complex global state management library (Zustand/Redux); local `useState` + `useReducer` suffices for this scope
- Server-side rendering or SSR patterns
- Testing infrastructure (out of scope for a demo)

## Decisions

### 1. React over Vue or Svelte

**Decision**: Use React with the Vite `@vitejs/plugin-react` transform.

**Rationale**: React is the most widely understood framework for best-practice reference code. The Vite ecosystem has first-class React support. Vue/Svelte would require more unfamiliar boilerplate for readers.

**Alternative**: Vanilla TypeScript with custom DOM manipulation — rejected because it can't demonstrate component composition patterns.

### 2. MSW (browser mode) over `json-server` or `fetch` monkey-patching

**Decision**: Use MSW's service worker (browser mode) to intercept `fetch` calls at the network layer.

**Rationale**: MSW intercepts at the network boundary without modifying production code paths. It gives realistic HTTP semantics (status codes, headers) and allows simulating latency. In Electron, the renderer runs in a Chromium context so service workers are supported.

**Alternative**: A simple `fetch` wrapper that returns hardcoded data — rejected because it doesn't model real async failure modes and tightly couples mock logic to the service layer.

**Alternative**: `json-server` (separate process) — rejected because it adds dev-time process management complexity for a self-contained demo.

### 3. Feature-folder structure (`src/features/todos/`)

**Decision**: Co-locate components, hooks, types, and API service under `src/features/todos/`.

**Rationale**: Feature folders keep related code together and scale naturally. The alternative (flat `src/components/` and `src/services/`) splits related code across unrelated directories and doesn't demonstrate idiomatic modern React project structure.

### 4. Custom `useTodos` hook for data-fetching state

**Decision**: Encapsulate all fetch logic in a `useTodos` hook returning `{ todos, loading, error, actions }`.

**Rationale**: Keeps the component layer thin and testable. Avoids prop drilling. Does not introduce a library dependency for a demo that doesn't need cache invalidation, deduplication, or pagination.

**Alternative**: React Query / SWR — considered but excluded to keep the dependency surface minimal and keep the data-fetching logic visible for educational purposes.

## Risks / Trade-offs

- **MSW service worker registration in Electron** → Electron's renderer uses a custom `app://` protocol by default with Vite dev server on `localhost`. MSW service workers register on `localhost` fine in dev mode. For production builds, the `app://` protocol may not support service workers; this demo is dev-mode only, which is acceptable. Mitigation: document clearly in code comments.
- **`renderer.ts` → `renderer.tsx` rename** → The existing file is boilerplate only. No logic is lost. Mitigation: the rename is the first step in the task list.
- **React adds ~150 KB to the renderer bundle** → Acceptable for a desktop Electron app demo; no bundle size budget exists.
