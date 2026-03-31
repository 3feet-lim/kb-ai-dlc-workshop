export interface Category {
  id: string;
  store_id: string;
  name: string;
  sort_order: number;
}

export interface Menu {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_available: boolean;
}

export interface CartItem {
  menu_id: string;
  menu_name: string;
  unit_price: number;
  quantity: number;
}

export type OrderStatus = "PENDING" | "PREPARING" | "COMPLETED";

export interface OrderItem {
  id: string;
  menu_id: string;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  store_id: string;
  table_id: string;
  session_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export interface TableLoginRequest {
  store_code: string;
  table_number: number;
  password: string;
}

export interface TableLoginResponse {
  access_token: string;
  store_id: string;
  table_id: string;
}

export interface CreateOrderRequest {
  items: { menu_id: string; quantity: number }[];
}

export interface SSEEvent {
  event: string;
  data: {
    type: "new_order" | "status_changed" | "order_deleted" | "session_ended";
    order_id?: string;
    order?: Order;
    status?: OrderStatus;
  };
}
