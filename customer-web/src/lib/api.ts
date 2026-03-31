import { getToken } from "./auth";
import type {
  Category,
  Menu,
  Order,
  TableLoginRequest,
  TableLoginResponse,
  CreateOrderRequest,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail || "요청에 실패했습니다.");
  }

  return res.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Auth
export function tableLogin(data: TableLoginRequest): Promise<TableLoginResponse> {
  return request("/auth/table-login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Categories
export function getCategories(storeId: string): Promise<Category[]> {
  return request(`/categories?store_id=${storeId}`);
}

// Menus
export function getMenus(storeId: string, categoryId?: string): Promise<Menu[]> {
  let path = `/menus?store_id=${storeId}`;
  if (categoryId) path += `&category_id=${categoryId}`;
  return request(path);
}

// Orders
export function createOrder(data: CreateOrderRequest): Promise<Order> {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getOrders(
  storeId: string,
  tableId: string,
  sessionId: string
): Promise<Order[]> {
  return request(
    `/orders?store_id=${storeId}&table_id=${tableId}&session_id=${sessionId}`
  );
}

// SSE URL
export function getSSEUrl(storeId: string, tableId: string): string {
  return `${API_URL}/sse/orders?store_id=${storeId}&table_id=${tableId}`;
}
