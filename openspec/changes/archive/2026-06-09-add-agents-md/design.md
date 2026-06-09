## Context

The repo is a fresh Electron Forge scaffold (`@electron-forge/cli` 7.11 with `plugin-vite`), TypeScript 4.5, Electron 42. Source is minimal: `src/main.ts` (main process), `src/preload.ts` (empty bridge), `src/renderer.ts` (renderer entry), plus three Vite configs (`vite.main.config.ts`, `vite.preload.config.ts`, `vite.renderer.config.ts`) wired through `forge.config.ts`. There is no contributor or agent documentation. The build output lives in `.vite/` and packaged apps in `out/`. Security defaults are non-trivial: context isolation is on by default, and `FusesPlugin` hardens the packaged binary.

The `AGENTS.md` convention is an emerging cross-tool standard for AI agent instructions, distinct from `CLAUDE.md`. Choosing it keeps the file tool-agnostic.

## Goals / Non-Goals

**Goals:**
- A single root `AGENTS.md` that lets an agent act correctly on first read.
- Accurately reflect the actual scaffold (file paths, scripts, Vite/Forge wiring, fuses) — no aspirational or invented content.
- Keep it concise and scannable.

**Non-Goals:**
- No changes to source, dependencies, or build config.
- Not a substitute for upstream Electron/Forge/Vite docs — link out rather than duplicate.
- No `CLAUDE.md` or other per-tool variants in this change.

## Decisions

- **`AGENTS.md` over `CLAUDE.md`**: tool-agnostic, becoming the common convention. Rationale: this repo already uses OpenSpec and multiple agent tools; a neutral filename avoids lock-in. Alternative considered: `CLAUDE.md` — rejected as tool-specific.
- **Root location**: agents conventionally look at the repo root first. Alternative (`docs/`) rejected for discoverability.
- **Document the process→file mapping explicitly** (main → `src/main.ts`, preload → `src/preload.ts`, renderer → `src/renderer.ts`, each with its Vite config and Forge entry). This is the highest-value content since Electron's three-process split is the main source of agent confusion.
- **Call out the magic globals** (`MAIN_WINDOW_VITE_DEV_SERVER_URL`, `MAIN_WINDOW_VITE_NAME`) injected by the Forge Vite plugin and declared in `forge.env.d.ts`, since they look undefined without context.
- **Capture security defaults** (context isolation, preload bridge, fuses) so agents don't naively enable `nodeIntegration`.

## Risks / Trade-offs

- [Doc drift as the scaffold evolves] → Keep `AGENTS.md` focused on stable structure and commands; defer volatile details to source files it points at.
- [Duplicating upstream docs] → Link to Electron/Forge/Vite docs instead of restating them.
- [Over-long file reduces usefulness] → Keep it scannable with short sections and a file-map table.
