## 1. Author AGENTS.md

- [x] 1.1 Create `AGENTS.md` at the repo root with a project overview (Electron desktop app) and tech stack (Electron 42, Electron Forge 7, Vite 5, TypeScript 4.5)
- [x] 1.2 Document the three-process model with a file map: main → `src/main.ts`, preload → `src/preload.ts`, renderer → `src/renderer.ts` (+ `index.html`, `src/index.css`)
- [x] 1.3 Document the Vite/Forge wiring: `forge.config.ts` entries and the three Vite configs (`vite.main.config.ts`, `vite.preload.config.ts`, `vite.renderer.config.ts`); note `.vite/` build output and `out/` package output
- [x] 1.4 Document the Forge-injected globals (`MAIN_WINDOW_VITE_DEV_SERVER_URL`, `MAIN_WINDOW_VITE_NAME`) and where they are declared (`forge.env.d.ts`)
- [x] 1.5 List commands with descriptions: `npm start`, `npm run package`, `npm run make`, `npm run publish`, `npm run lint`
- [x] 1.6 Document conventions and security defaults: context isolation, exposing renderer APIs via the preload bridge instead of `nodeIntegration`, and the Electron Fuses in `forge.config.ts`
- [x] 1.7 Add links out to Electron, Electron Forge, and Vite docs rather than duplicating them

## 2. Verify

- [x] 2.1 Cross-check every file path, script name, and global referenced in `AGENTS.md` against the actual repo
- [x] 2.2 Run `npm run lint` to confirm no project changes broke; confirm `AGENTS.md` renders correctly as Markdown
