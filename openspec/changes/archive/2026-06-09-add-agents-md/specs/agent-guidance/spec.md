## ADDED Requirements

### Requirement: Agent guidance document exists at repo root

The repository SHALL provide an `AGENTS.md` file at the repository root that orients AI coding agents and new contributors to the project.

#### Scenario: Agent locates guidance on entry

- **WHEN** an AI agent begins a task in this repository
- **THEN** it finds `AGENTS.md` at the repo root as the authoritative starting point

### Requirement: Project overview and tech stack documented

`AGENTS.md` SHALL describe what the application is and its core technologies (Electron, Electron Forge, Vite, TypeScript) with their roles.

#### Scenario: Agent identifies the stack

- **WHEN** an agent reads `AGENTS.md`
- **THEN** it can identify the app as an Electron desktop application built with Electron Forge, Vite, and TypeScript without inspecting `package.json`

### Requirement: Architecture and source layout documented

`AGENTS.md` SHALL explain Electron's three-process model (main, preload, renderer) and map each to its source file, plus the Vite multi-build configuration.

#### Scenario: Agent locates the correct process file

- **WHEN** an agent needs to modify main-process, preload, or renderer code
- **THEN** `AGENTS.md` tells it which file under `src/` to edit and which Vite config governs it

### Requirement: Build, run, and lint commands documented

`AGENTS.md` SHALL list the available scripts (`start`, `package`, `make`, `publish`, `lint`) and describe what each does.

#### Scenario: Agent runs the app locally

- **WHEN** an agent needs to launch, build, or lint the project
- **THEN** `AGENTS.md` provides the exact command for each task

### Requirement: Conventions and security defaults documented

`AGENTS.md` SHALL document key conventions and security-relevant defaults, including context isolation, the preload bridge pattern, and the Electron Fuses configured at package time.

#### Scenario: Agent preserves security posture

- **WHEN** an agent adds renderer functionality that needs Node or system access
- **THEN** `AGENTS.md` directs it to expose APIs through the preload bridge rather than enabling `nodeIntegration`, preserving the project's security defaults
