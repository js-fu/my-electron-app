import { ipcMain } from "electron";
import { app } from "electron";
import { mockDb } from "./main-mock";

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
const API_BASE = process.env.API_BASE_URL;

function ipcError(message: string): never {
  throw { message };
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    ipcError(body.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function registerIpcHandlers() {
  const useMock = isDev && !API_BASE;

  ipcMain.handle("todos:list", async () => {
    console.log("🚀 ~ ipc-handlers.ts ~ 'todos:list'");
    try {
      if (useMock) return mockDb.list();
      if (!API_BASE) ipcError("API_BASE_URL is not configured");
      return await apiFetch(`${API_BASE}/todos`);
    } catch (e) {
      throw { message: (e as { message: string }).message ?? String(e) };
    }
  });

  ipcMain.handle("todos:create", async (_event, title: string) => {
    console.log("🚀 ~ ipc-handlers.ts ~ 'todos:create':", { title });
    try {
      if (!title?.trim()) ipcError("Title is required");
      if (useMock) return mockDb.create(title.trim());
      if (!API_BASE) ipcError("API_BASE_URL is not configured");
      return await apiFetch(`${API_BASE}/todos`, {
        method: "POST",
        body: JSON.stringify({ title: title.trim() }),
      });
    } catch (e) {
      throw { message: (e as { message: string }).message ?? String(e) };
    }
  });

  ipcMain.handle("todos:update", async (_event, id: string, patch: { completed: boolean }) => {
    console.log("🚀 ~ ipc-handlers.ts ~ 'todos:update':", { id, patch });
    try {
      if (useMock) {
        const updated = mockDb.update(id, patch);
        if (!updated) ipcError("Todo not found");
        return updated;
      }
      if (!API_BASE) ipcError("API_BASE_URL is not configured");
      return await apiFetch(`${API_BASE}/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    } catch (e) {
      throw { message: (e as { message: string }).message ?? String(e) };
    }
  });

  ipcMain.handle("todos:delete", async (_event, id: string) => {
    console.log("🚀 ~ ipc-handlers.ts ~ 'todos:delete':", { id });
    try {
      if (useMock) {
        if (!mockDb.delete(id)) ipcError("Todo not found");
        return undefined;
      }
      if (!API_BASE) ipcError("API_BASE_URL is not configured");
      return await apiFetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
    } catch (e) {
      throw { message: (e as { message: string }).message ?? String(e) };
    }
  });
}
