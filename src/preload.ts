import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  todos: {
    list: () => ipcRenderer.invoke('todos:list'),
    create: (title: string) => ipcRenderer.invoke('todos:create', title),
    update: (id: string, patch: { completed: boolean }) =>
      ipcRenderer.invoke('todos:update', id, patch),
    delete: (id: string) => ipcRenderer.invoke('todos:delete', id),
  },
});
