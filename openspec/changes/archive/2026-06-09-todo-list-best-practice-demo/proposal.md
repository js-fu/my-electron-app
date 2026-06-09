## Why

This Electron app currently has only boilerplate renderer code with no meaningful UI. A best-practice todo-list demo will serve as a reference implementation demonstrating idiomatic React patterns, async data fetching from a mock API, and clean component architecture within this Electron + Vite + TypeScript stack.

## What Changes

- Add React and ReactDOM as dependencies (renderer layer)
- Add MSW (Mock Service Worker) for in-process mock API endpoints
- Replace the placeholder `renderer.ts` with a React entry point (`renderer.tsx`)
- Introduce a `src/features/todos/` module with full CRUD capability backed by mock API responses
- Add loading, error, and empty states for all async operations

## Capabilities

### New Capabilities

- `todo-list-ui`: Interactive todo list UI — create, read, update (toggle complete), delete todos with optimistic UI updates
- `todo-mock-api`: In-process mock API layer using MSW that intercepts `fetch` calls for `/api/todos`, simulating realistic latency and error states
- `react-setup`: React + ReactDOM integration into the Electron Vite renderer, replacing the vanilla TS boilerplate

### Modified Capabilities

<!-- No existing spec-level capabilities are being changed -->

## Impact

- `src/renderer.ts` → replaced by `src/renderer.tsx` (React entry point)
- `index.html` → updated script reference to point at new renderer entry
- New dependencies: `react`, `react-dom`, `msw`, `@types/react`, `@types/react-dom`
- Vite renderer config updated to handle `.tsx` and React JSX transform
- No changes to `main.ts`, `preload.ts`, or Electron main-process logic
