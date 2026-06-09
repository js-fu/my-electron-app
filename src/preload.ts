import { contextBridge, ipcRenderer } from 'electron';

type UpdateStatusCallback = (data: { status: string; percent?: number }) => void;

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateStatus: (callback: UpdateStatusCallback) => {
    const listener = (_event: Electron.IpcRendererEvent, data: { status: string; percent?: number }) => {
      callback(data);
    };
    ipcRenderer.on('update-status', listener);
    // Return a cleanup function to remove the listener
    return () => ipcRenderer.removeListener('update-status', listener);
  },
  installUpdate: () => {
    ipcRenderer.send('install-update');
  },
});
