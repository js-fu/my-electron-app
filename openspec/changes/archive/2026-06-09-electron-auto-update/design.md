## Context

当前项目是基于 Electron Forge + Vite 构建的桌面应用，使用 `maker-squirrel`（Windows）、`maker-deb`/`maker-rpm`（Linux）、`maker-zip`（跨平台）进行打包。目前没有任何自动更新机制，用户需要手动下载并安装新版本。

`electron-squirrel-startup` 已作为依赖存在，负责处理 Windows Squirrel 安装/卸载事件。

## Goals / Non-Goals

**Goals:**
- 应用启动时自动检查 GitHub Releases 上的新版本
- 检测到新版本后后台静默下载
- 下载完成后通过 UI 通知用户，并提供"立即重启安装"选项
- 支持 macOS 和 Windows 平台（主要目标）
- 发布流程与 Electron Forge 的 `publish` 命令集成

**Non-Goals:**
- Linux 平台的自动更新（`.deb`/`.rpm` 包更新由系统包管理器负责）
- 强制更新（不允许用户跳过）
- 差量更新 / 增量补丁
- 自建更新服务器（使用 GitHub Releases 作为唯一更新源）

## Decisions

### 1. 使用 `electron-updater` 而非 Electron 内置 `autoUpdater`

**选择**: `electron-updater`（`electron-builder` 生态）

**理由**:
- Electron 内置 `autoUpdater` 在 macOS 上依赖 Squirrel.Mac，配置复杂且需要代码签名
- `electron-updater` 支持 macOS、Windows、Linux，API 统一
- 支持 GitHub Releases 作为更新源，开箱即用
- 社区生态成熟，文档完善

**替代方案**: `update-electron-app`（Electron 官方维护）—— 更简单但功能受限，不支持自定义更新逻辑和进度展示

### 2. 使用 GitHub Releases 作为更新源

**选择**: GitHub Releases + `@electron-forge/publisher-github`

**理由**:
- 项目已托管在 GitHub，无需额外基础设施
- `electron-updater` 原生支持 GitHub Releases 的 `latest.yml` / `latest-mac.yml` 文件格式
- Electron Forge 提供 `publisher-github` 插件，`npm run publish` 即可完成发布

### 3. 更新通知通过 IPC 传递到渲染进程

**选择**: 主进程监听 `electron-updater` 事件，通过 `ipcMain` → `preload contextBridge` → 渲染进程展示通知

**理由**:
- 符合 Electron 安全最佳实践（启用 contextIsolation，禁止 nodeIntegration）
- 渲染进程无法直接访问 `electron-updater`，必须通过 IPC 桥接
- 与项目现有的 preload 模式一致

### 4. 更新 UI：轻量通知条

**选择**: 在渲染层顶部展示一个固定通知条（toast/banner），而非模态弹窗

**理由**:
- 不打断用户当前操作
- 提供下载进度百分比和"重启安装"按钮
- 实现简单，无需引入额外 UI 库

## Risks / Trade-offs

- **代码签名要求** → macOS 的自动更新要求应用具有有效的代码签名证书。未签名的开发版本无法触发自动更新（可通过环境变量 `ELECTRON_UPDATER_ALLOW_UNSIGNED_BUILDS=true` 在开发环境绕过）
- **Windows Squirrel 冲突** → `electron-squirrel-startup` 已处理 Squirrel 生命周期事件，`electron-updater` 使用 NSIS 而非 Squirrel（对 Windows），需将 `maker-squirrel` 改为 `maker-nsis`，或保持 Squirrel 并使用 `electron-updater` 的 Squirrel 模式 → 优先使用 NSIS，更简单可靠
- **GitHub Token 泄露** → CI 发布需要 `GITHUB_TOKEN`，不得硬编码 → 通过 GitHub Actions secrets 管理
- **首次发布配置** → `electron-updater` 需要 `package.json` 中的 `build.publish` 配置，或 `app-update.yml` 文件 → 在 `forge.config.ts` 和 `package.json` 中统一配置

## Migration Plan

1. 安装依赖：`electron-updater`、`@electron-forge/publisher-github`
2. 更新 `forge.config.ts`：添加 publisher 配置、将 Windows maker 切换为 NSIS
3. 在 `src/main.ts` 中集成 `autoUpdater` 事件处理
4. 更新 `src/preload.ts`：通过 `contextBridge` 暴露更新 API
5. 在渲染进程添加更新通知 UI
6. 配置 GitHub Actions 用于自动发布
7. 发布 v1.0.1 版本验证更新流程

**回滚**: 删除 `electron-updater` 集成代码，还原 `forge.config.ts`，不影响现有功能

## Open Questions

- 是否需要支持预发布（pre-release / beta）版本的更新通道？
- CI/CD 是否已有 GitHub Actions 工作流，还是需要新建？
- macOS 代码签名证书是否已准备好？
