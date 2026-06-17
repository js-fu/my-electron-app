import { ipcMain } from "electron";
import { readFile } from "node:fs/promises";

const API_BASE = process.env.API_BASE_URL;

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface ApiRequest {
  method: HttpMethod;
  path: string;
  body?: unknown;
}

interface UploadRequest {
  path: string;
  fieldName: string;
  filePath: string;
  name: string;
  type: string;
}

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

// Allowlist of routes the renderer is permitted to call. Anything not matched
// here is rejected, so this stays a controlled entry point — not a blind proxy.
const ROUTES: { method: HttpMethod; pattern: RegExp }[] = [
  { method: "GET", pattern: /^\/todos$/ },
  { method: "POST", pattern: /^\/todos$/ },
  { method: "PATCH", pattern: /^\/todos\/[^/]+$/ },
  { method: "DELETE", pattern: /^\/todos\/[^/]+$/ },
];

function assertAllowed({ method, path }: ApiRequest) {
  const ok = ROUTES.some((r) => r.method === method && r.pattern.test(path));
  if (!ok) ipcError(`Route not allowed: ${method} ${path}`);
}

// 上传接口的白名单(均为 POST multipart/form-data)。
// TODO: 换成你后端真实的上传路径。
const UPLOAD_ROUTES: RegExp[] = [/^\/uploads$/];

function assertUploadAllowed(path: string) {
  if (!UPLOAD_ROUTES.some((p) => p.test(path))) {
    ipcError(`Upload route not allowed: ${path}`);
  }
}

export function registerIpcHandlers() {
  ipcMain.handle("api:request", async (_event, req: ApiRequest) => {
    console.log("🚀 ~ ipc-handlers.ts ~ 'api:request':", req.method, req.path);
    try {
      assertAllowed(req);
      if (!API_BASE) ipcError("API_BASE_URL is not configured");
      return await apiFetch(`${API_BASE}${req.path}`, {
        method: req.method,
        body: req.body != null ? JSON.stringify(req.body) : undefined,
      });
    } catch (e) {
      throw { message: (e as { message: string }).message ?? String(e) };
    }
  });

  ipcMain.handle("api:upload", async (_event, req: UploadRequest) => {
    console.log("🚀 ~ ipc-handlers.ts ~ 'api:upload':", req.path, req.name);
    try {
      assertUploadAllowed(req.path);
      if (!API_BASE) ipcError("API_BASE_URL is not configured");

      // 在 main 进程内从磁盘读取并组装 multipart;Blob 仅在本进程内构造,不跨 IPC。
      const buf = await readFile(req.filePath);
      const form = new FormData();
      form.append(req.fieldName, new Blob([buf], { type: req.type }), req.name);

      // 不手动设置 Content-Type —— 让 fetch 自动带上 multipart boundary。
      const res = await fetch(`${API_BASE}${req.path}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        ipcError(body.error ?? `HTTP ${res.status}`);
      }
      if (res.status === 204) return undefined;
      return await res.json();
    } catch (e) {
      throw { message: (e as { message: string }).message ?? String(e) };
    }
  });
}
