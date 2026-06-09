## 1. 依赖安装与构建配置

- [x] 1.1 安装 `electron-updater` 为 runtime 依赖：`npm install electron-updater`
- [x] 1.2 安装 `@electron-forge/publisher-github` 为 devDependency：`npm install --save-dev @electron-forge/publisher-github`
- [x] 1.3 在 `forge.config.ts` 中添加 `publishers` 配置，指向 GitHub 仓库（owner/repo）并设置 `prerelease: false`
- [x] 1.4 在 `package.json` 的 `build` 字段中添加 `publish` 配置（`provider: github`），供 `electron-updater` 读取更新源

## 2. 主进程自动更新逻辑

- [x] 2.1 在 `src/main.ts` 中导入 `autoUpdater`（来自 `electron-updater`）
- [x] 2.2 在主窗口 `ready-to-show` 事件后，调用 `autoUpdater.checkForUpdatesAndNotify()` 启动更新检查
- [x] 2.3 注册 `autoUpdater.on('update-available', ...)` 事件，通过 `ipcMain` 向渲染进程发送 `update-status` 消息（状态：`available`）
- [x] 2.4 注册 `autoUpdater.on('download-progress', ...)` 事件，向渲染进程转发下载进度（百分比）
- [x] 2.5 注册 `autoUpdater.on('update-downloaded', ...)` 事件，向渲染进程发送下载完成通知（状态：`ready`）
- [x] 2.6 注册 `autoUpdater.on('error', ...)` 事件，向渲染进程发送错误通知（状态：`error`），不崩溃
- [x] 2.7 注册 `ipcMain.on('install-update', ...)` 事件处理器，调用 `autoUpdater.quitAndInstall()`

## 3. Preload 桥接

- [x] 3.1 在 `src/preload.ts` 中通过 `contextBridge.exposeInMainWorld('electronAPI', {...})` 暴露以下方法：
  - `onUpdateStatus(callback)`: 监听主进程的 `update-status` IPC 事件
  - `installUpdate()`: 向主进程发送 `install-update` IPC 消息
- [x] 3.2 确保 preload 中 IPC 监听使用 `ipcRenderer.on` 并在不需要时移除监听器，防止内存泄漏

## 4. 渲染进程更新通知 UI

- [x] 4.1 在 `src/renderer/` 下创建 `UpdateBanner` 组件（HTML/CSS/TS），默认隐藏
- [x] 4.2 在应用初始化时调用 `window.electronAPI.onUpdateStatus(callback)` 订阅更新事件
- [x] 4.3 收到 `available` 状态时，显示"正在下载更新…"文字，隐藏安装按钮
- [x] 4.4 收到 `progress` 状态时，更新显示为"正在下载更新 XX%"
- [x] 4.5 收到 `ready` 状态时，展示"新版本已就绪"文字及"立即重启安装"按钮
- [x] 4.6 "立即重启安装"按钮点击后调用 `window.electronAPI.installUpdate()`
- [x] 4.7 添加关闭/忽略按钮，点击后隐藏 Banner，不影响后台已下载的更新包
- [x] 4.8 收到 `error` 状态时，展示"更新下载失败，请稍后重试"提示，并在 5 秒后自动隐藏

## 5. 开发环境适配

- [x] 5.1 在开发模式下（`app.isPackaged === false`）禁用自动更新检查，避免开发时触发无效请求
- [x] 5.2 添加 `ELECTRON_UPDATER_ALLOW_UNSIGNED_BUILDS` 环境变量支持（用于未签名的测试构建）

## 6. GitHub Actions 发布工作流

- [x] 6.1 创建 `.github/workflows/release.yml`，在推送 `v*` 标签时触发
- [x] 6.2 工作流中运行 `npm run publish`（即 `electron-forge publish`），使用 `GITHUB_TOKEN` secret
- [ ] 6.3 验证发布后 GitHub Releases 中包含 `latest.yml`（macOS 为 `latest-mac.yml`，Windows 为 `latest.yml`）

## 7. 端到端验证

- [ ] 7.1 发布一个测试版本（如 v1.0.1），验证 `latest.yml` 文件已生成
- [ ] 7.2 在旧版本（如 v1.0.0）的已打包应用中触发更新检查，确认能检测到新版本
- [ ] 7.3 确认下载进度在 UI 中正确展示
- [ ] 7.4 点击"立即重启安装"后应用成功更新到新版本

<!-- Tasks 6.3 and 7.x require an actual published GitHub Release and packaged binary — manual verification steps. -->
