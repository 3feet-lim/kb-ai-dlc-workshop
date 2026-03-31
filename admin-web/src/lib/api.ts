import { getToken, removeToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

async function request<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { skipAuth, ...init } = opts;
  const headers = new Headers(init.headers);

  if (!skipAuth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<T>(path, { method: "POST", body: form });
  },
  postNoAuth: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    }),
};

export { API_BASE };
