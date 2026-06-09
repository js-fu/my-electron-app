interface ElectronAPI {
  onUpdateStatus(callback: (data: { status: string; percent?: number }) => void): () => void;
  installUpdate(): void;
}

interface Window {
  electronAPI: ElectronAPI;
}
