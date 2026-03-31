import { describe, it, expect } from "vitest";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getTotalAmount,
  getTotalCount,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";

describe("Cart (example-based, PBT-10)", () => {
  const emptyCart: CartItem[] = [];

  const sampleItem: CartItem = {
    menu_id: "menu-1",
    menu_name: "김치찌개",
    unit_price: 8000,
    quantity: 1,
  };

  it("adds a new item to empty cart", () => {
    const result = addToCart(emptyCart, "menu-1", "김치찌개", 8000);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(sampleItem);
  });

  it("increments quantity when adding existing item", () => {
    const cart = [sampleItem];
    const result = addToCart(cart, "menu-1", "김치찌개", 8000);
    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(2);
  });

  it("removes item from cart", () => {
    const cart = [sampleItem];
    const result = removeFromCart(cart, "menu-1");
    expect(result).toHaveLength(0);
  });

  it("updates quantity", () => {
    const cart = [sampleItem];
    const result = updateQuantity(cart, "menu-1", 5);
    expect(result[0].quantity).toBe(5);
  });

  it("removes item when quantity set to 0", () => {
    const cart = [sampleItem];
    const result = updateQuantity(cart, "menu-1", 0);
    expect(result).toHaveLength(0);
  });

  it("clears cart", () => {
    const cart = [sampleItem, { ...sampleItem, menu_id: "menu-2", menu_name: "된장찌개" }];
    expect(clearCart()).toEqual([]);
  });

  it("calculates total amount correctly", () => {
    const cart: CartItem[] = [
      { menu_id: "m1", menu_name: "A", unit_price: 8000, quantity: 2 },
      { menu_id: "m2", menu_name: "B", unit_price: 12000, quantity: 1 },
    ];
    expect(getTotalAmount(cart)).toBe(28000);
  });

  it("calculates total count correctly", () => {
    const cart: CartItem[] = [
      { menu_id: "m1", menu_name: "A", unit_price: 8000, quantity: 2 },
      { menu_id: "m2", menu_name: "B", unit_price: 12000, quantity: 3 },
    ];
    expect(getTotalCount(cart)).toBe(5);
  });

  it("returns 0 for empty cart totals", () => {
    expect(getTotalAmount(emptyCart)).toBe(0);
    expect(getTotalCount(emptyCart)).toBe(0);
  });
});
