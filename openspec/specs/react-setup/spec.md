# react-setup

## Purpose

Establish React as the renderer-layer UI framework for the Electron app, including the
React entry point, Vite React plugin, and TypeScript JSX configuration.

## Requirements

### Requirement: React renderer entry point
The system SHALL replace the vanilla `renderer.ts` with a React entry point that mounts the app to a DOM root element.

#### Scenario: React mounts successfully
- **WHEN** Electron loads `index.html` and the script bundle executes
- **THEN** `ReactDOM.createRoot(document.getElementById('root')).render(<App />)` runs without error and the React component tree is visible

#### Scenario: Root element present in HTML
- **WHEN** `index.html` is parsed
- **THEN** a `<div id="root"></div>` element exists as the React mount target

### Requirement: Vite React plugin configured
The Vite renderer config SHALL include `@vitejs/plugin-react` so that JSX and Fast Refresh are supported.

#### Scenario: JSX compiles without error
- **WHEN** `npm start` is run (Electron Forge dev mode)
- **THEN** all `.tsx` files in `src/` compile successfully with no TypeScript or Vite errors

#### Scenario: Hot module replacement works
- **WHEN** a `.tsx` source file is edited during dev mode
- **THEN** the renderer hot-reloads without a full Electron window reload (React Fast Refresh)

### Requirement: TypeScript configured for React JSX
The `tsconfig.json` SHALL include `"jsx": "react-jsx"` so TypeScript understands JSX syntax without requiring explicit React imports.

#### Scenario: No import React needed
- **WHEN** a `.tsx` file uses JSX without `import React from 'react'`
- **THEN** TypeScript compilation succeeds and the output is valid
