import type { CartItem } from "./types";

const CART_KEY = "cart_items";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(
  items: CartItem[],
  menuId: string,
  menuName: string,
  unitPrice: number
): CartItem[] {
  const existing = items.find((item) => item.menu_id === menuId);
  if (existing) {
    return items.map((item) =>
      item.menu_id === menuId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  return [...items, { menu_id: menuId, menu_name: menuName, unit_price: unitPrice, quantity: 1 }];
}

export function removeFromCart(items: CartItem[], menuId: string): CartItem[] {
  return items.filter((item) => item.menu_id !== menuId);
}

export function updateQuantity(
  items: CartItem[],
  menuId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) return removeFromCart(items, menuId);
  return items.map((item) =>
    item.menu_id === menuId ? { ...item, quantity } : item
  );
}

export function clearCart(): CartItem[] {
  return [];
}

export function getTotalAmount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
}

export function getTotalCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
