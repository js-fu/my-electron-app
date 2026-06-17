import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { HttpMethod } from './ipc-handlers';

contextBridge.exposeInMainWorld('electronAPI', {
  request: (method: HttpMethod, path: string, body?: unknown) =>
    ipcRenderer.invoke('api:request', { method, path, body }),

  // 文件上传单独走一条通道:在隔离层把 File 解析成绝对路径,
  // 只把路径(字符串)送过 IPC,文件本体不进进程间序列化。
  upload: (path: string, file: File, fieldName = 'file') =>
    ipcRenderer.invoke('api:upload', {
      path,
      fieldName,
      filePath: webUtils.getPathForFile(file),
      name: file.name,
      type: file.type,
    }),
});
