## Why

用户需要手动下载并安装新版本，体验繁琐且容易错过重要更新。通过集成自动更新机制，应用可在后台静默检测和安装新版本，提升用户体验并确保安全补丁及时生效。

## What Changes

- 集成 `electron-updater`（来自 `electron-builder`）作为自动更新引擎，支持 GitHub Releases 作为更新源
- 新增 `@electron-forge/publisher-github` 以支持将构建产物发布到 GitHub Releases
- 在主进程中添加自动更新逻辑：启动时检查更新、下载可用更新、提示用户安装
- 在渲染进程中展示更新状态通知（有可用更新、下载进度、安装提示）
- 通过 IPC 在主进程与渲染进程之间传递更新事件

## Capabilities

### New Capabilities

- `auto-update`: 应用启动后自动检查 GitHub Releases 上的新版本，后台下载，并在下载完成后提示用户重启以完成安装

### Modified Capabilities

<!-- 暂无已有 spec 需修改 -->

## Impact

- **依赖新增**: `electron-updater`（runtime），`@electron-forge/publisher-github`（devDependency）
- **主进程**: `src/main.ts` 新增更新检查与事件处理逻辑
- **预加载脚本**: `src/preload.ts` 暴露更新相关 IPC 接口
- **渲染进程**: 新增更新通知 UI 组件（`src/renderer/`）
- **构建配置**: `forge.config.ts` 新增 publisher 配置
- **发布流程**: 需配置 `GITHUB_TOKEN` 环境变量用于 CI 发布
