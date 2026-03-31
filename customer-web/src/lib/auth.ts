const TOKEN_KEY = "table_token";
const STORE_ID_KEY = "store_id";
const TABLE_ID_KEY = "table_id";
const CREDENTIALS_KEY = "table_credentials";

export interface StoredCredentials {
  store_code: string;
  table_number: number;
  password: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token: string, storeId: string, tableId: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STORE_ID_KEY, storeId);
  localStorage.setItem(TABLE_ID_KEY, tableId);
}

export function getStoreId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORE_ID_KEY);
}

export function getTableId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TABLE_ID_KEY);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STORE_ID_KEY);
  localStorage.removeItem(TABLE_ID_KEY);
}

export function saveCredentials(creds: StoredCredentials): void {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
}

export function getCredentials(): StoredCredentials | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CREDENTIALS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
