# AGENTS.md

Guidance for AI coding agents (and new contributors) working in this repository.
This is the authoritative starting point — read it before making changes.

## Project Overview

`my-electron-app` is a cross-platform **Electron desktop application**, scaffolded
with **Electron Forge** using the **Vite** plugin. It is currently a minimal
starter (a "Hello World" window) and the codebase is intentionally small.

### Tech Stack

| Concern        | Tool                        | Version |
| -------------- | --------------------------- | ------- |
| Desktop shell  | Electron                    | 42      |
| Build/packaging| Electron Forge              | 7       |
| Bundler        | Vite                        | 5       |
| Language       | TypeScript                  | 4.5     |
| Linting        | ESLint + `@typescript-eslint` | 8 / 5 |

## Architecture: Electron's Three Processes

Electron apps run code in distinct processes. Know which one you're editing —
they have different capabilities and security boundaries.

| Process    | Entry file        | Runs in            | Notes |
| ---------- | ----------------- | ------------------ | ----- |
| **Main**   | `src/main.ts`     | Node.js            | App lifecycle, creates `BrowserWindow`, full system/Node access. |
| **Preload**| `src/preload.ts`  | Isolated bridge    | Runs before the renderer loads; the **only** safe place to expose privileged APIs to the UI (currently empty). |
| **Renderer**| `src/renderer.ts`| Browser (Chromium) | The UI. No Node access by default. Entry referenced by `index.html`. |

Supporting files:
- `index.html` — renderer HTML entry; loads `src/renderer.ts` as a module.
- `src/index.css` — renderer styles, imported from `renderer.ts`.

**Rule of thumb:** main-process / system work goes in `src/main.ts`; UI work goes
in `src/renderer.ts`; anything the UI needs from the system is exposed through
`src/preload.ts`.

## Build Wiring (Forge + Vite)

`forge.config.ts` drives everything via the `@electron-forge/plugin-vite` plugin.
It defines three independent builds, each with its own Vite config:

| Target   | Source           | Vite config              |
| -------- | ---------------- | ------------------------ |
| main     | `src/main.ts`    | `vite.main.config.ts`    |
| preload  | `src/preload.ts` | `vite.preload.config.ts` |
| renderer | `index.html` (`main_window`) | `vite.renderer.config.ts` |

Output locations:
- `.vite/` — dev/build output consumed by Electron at runtime (`main` field in `package.json` points at `.vite/build/main.js`).
- `out/` — packaged/distributable apps produced by `package` / `make`.

Both are build artifacts — don't edit them by hand.

### Forge-injected globals

The Vite plugin injects globals that look undefined if you read `main.ts` in
isolation. They are typed via `forge.env.d.ts` (which references
`@electron-forge/plugin-vite/forge-vite-env`):

- `MAIN_WINDOW_VITE_DEV_SERVER_URL` — dev-server URL in development; `undefined` in production builds.
- `MAIN_WINDOW_VITE_NAME` — the renderer name (`main_window`), used to locate the built `index.html` in production.

The naming follows `<RENDERER_NAME>_VITE_*`; if you add another renderer in
`forge.config.ts`, a matching pair of globals is generated for it.

## Commands

```bash
npm start          # Run the app in development (Forge + Vite dev server, HMR)
npm run package    # Package the app into a platform bundle (no installer) → out/
npm run make       # Build distributables/installers (squirrel, zip, deb, rpm) → out/
npm run publish    # Publish distributables via configured Forge publishers
npm run lint       # Lint .ts/.tsx with ESLint
```

There is currently no test runner configured.

## Conventions & Security Defaults

Preserve these defaults unless a task explicitly requires changing them:

- **Context isolation is on** and **`nodeIntegration` is off** (Electron defaults,
  not overridden in `main.ts`). To give the renderer access to Node or system
  APIs, expose a minimal, explicit surface through `src/preload.ts` using
  `contextBridge` — do **not** enable `nodeIntegration`.
- **Electron Fuses** are configured in `forge.config.ts` to harden the packaged
  binary (e.g. `RunAsNode` disabled, cookie encryption on, ASAR integrity
  validation, `OnlyLoadAppFromAsar`). Keep these hardened; loosening a fuse is a
  security-relevant decision.
- **DevTools** auto-open in `main.ts` (`openDevTools()`) — convenient in dev, but
  consider gating it to development before shipping.
- TypeScript across all processes; follow the existing ESLint config
  (`.eslintrc.json`).

## External Documentation

Prefer these over guessing — they reflect the exact tooling here:

- Electron: https://www.electronjs.org/docs/latest
- Electron process model: https://www.electronjs.org/docs/latest/tutorial/process-model
- Electron security: https://www.electronjs.org/docs/latest/tutorial/security
- Electron Forge: https://www.electronforge.io/
- Vite: https://vitejs.dev/
