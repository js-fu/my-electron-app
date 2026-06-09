## ADDED Requirements

### Requirement: 启动时检查更新
应用主进程 SHALL 在窗口就绪后自动向 GitHub Releases 查询是否有新版本可用。检查过程 SHALL 静默进行，不弹出任何打断用户的对话框。

#### Scenario: 检测到新版本
- **WHEN** 应用启动后成功连接更新服务器，且发现新版本
- **THEN** 主进程开始后台下载，并通过 IPC 通知渲染进程"发现新版本，正在下载"

#### Scenario: 无新版本
- **WHEN** 应用启动后检查更新，当前版本已是最新
- **THEN** 不做任何 UI 提示，检查过程对用户透明

#### Scenario: 网络不可用
- **WHEN** 应用启动时网络不可达或 GitHub 服务不可访问
- **THEN** 静默忽略更新检查错误，不向用户展示任何错误信息，应用正常启动

### Requirement: 后台下载更新包
发现新版本后，应用 SHALL 在后台自动下载更新包，不阻塞用户的正常使用。

#### Scenario: 下载进度通知
- **WHEN** 更新包正在下载
- **THEN** 渲染进程 SHALL 收到下载进度事件（百分比），并在 UI 中展示进度条或进度文本

#### Scenario: 下载完成
- **WHEN** 更新包下载完毕
- **THEN** 渲染进程 SHALL 收到"下载完成"事件，并展示"重启以安装更新"的操作按钮

#### Scenario: 下载失败
- **WHEN** 更新包下载过程中发生网络错误
- **THEN** 渲染进程 SHALL 展示简短错误提示，并提供"稍后重试"选项，不崩溃

### Requirement: 用户确认后安装更新
更新包下载完成后，应用 SHALL 等待用户主动确认后再退出并安装，不得强制重启。

#### Scenario: 用户点击"立即重启"
- **WHEN** 用户点击更新通知中的"立即重启安装"按钮
- **THEN** 应用退出并自动安装新版本，安装完成后自动重新启动

#### Scenario: 用户忽略通知
- **WHEN** 用户关闭或忽略更新通知
- **THEN** 应用继续正常运行，更新包保留在本地，下次启动时直接安装（无需重新下载）

### Requirement: IPC 更新事件桥接
主进程 SHALL 通过 preload 的 `contextBridge` 向渲染进程暴露更新相关的事件监听和触发接口，且 SHALL 遵循 contextIsolation 安全约束。

#### Scenario: 渲染进程监听更新事件
- **WHEN** 渲染进程调用 `window.electronAPI.onUpdateStatus(callback)`
- **THEN** 当更新状态变化（检查中、发现更新、下载进度、下载完成、错误）时，callback 被以事件数据调用

#### Scenario: 渲染进程触发安装
- **WHEN** 渲染进程调用 `window.electronAPI.installUpdate()`
- **THEN** 主进程执行 `autoUpdater.quitAndInstall()`，应用退出并安装更新

### Requirement: 更新通知 UI
渲染进程 SHALL 展示一个非阻断式的通知 UI，用于展示更新状态。

#### Scenario: 展示下载进度
- **WHEN** 收到下载进度事件
- **THEN** UI 中显示"正在下载更新 XX%"的文字或进度条

#### Scenario: 展示安装按钮
- **WHEN** 收到下载完成事件
- **THEN** UI 中显示"新版本已就绪，点击重启安装"及对应按钮

#### Scenario: 可关闭通知
- **WHEN** 用户点击通知的关闭/忽略按钮
- **THEN** 通知从 UI 中消失，应用继续运行，不影响后台已下载的更新包
