import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getTotalAmount,
  getTotalCount,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";
import { cartItemArb, uniqueCartItemsArb } from "./generators";

describe("Cart PBT (PBT-06: Stateful properties)", () => {
  it("totalAmount == sum(unit_price * quantity) for any cart state", () => {
    fc.assert(
      fc.property(uniqueCartItemsArb, (items) => {
        const expected = items.reduce(
          (sum, i) => sum + i.unit_price * i.quantity,
          0
        );
        expect(getTotalAmount(items)).toBe(expected);
      })
    );
  });

  it("totalCount == sum(quantity) for any cart state", () => {
    fc.assert(
      fc.property(uniqueCartItemsArb, (items) => {
        const expected = items.reduce((sum, i) => sum + i.quantity, 0);
        expect(getTotalCount(items)).toBe(expected);
      })
    );
  });

  it("addToCart then removeFromCart restores original length for new item", () => {
    fc.assert(
      fc.property(uniqueCartItemsArb, cartItemArb, (items, newItem) => {
        // Ensure newItem is not already in cart
        const filtered = items.filter((i) => i.menu_id !== newItem.menu_id);
        const added = addToCart(
          filtered,
          newItem.menu_id,
          newItem.menu_name,
          newItem.unit_price
        );
        const removed = removeFromCart(added, newItem.menu_id);
        expect(removed.length).toBe(filtered.length);
      })
    );
  });

  it("addToCart for existing item increments quantity by 1", () => {
    fc.assert(
      fc.property(uniqueCartItemsArb, (items) => {
        if (items.length === 0) return;
        const target = items[0];
        const result = addToCart(
          items,
          target.menu_id,
          target.menu_name,
          target.unit_price
        );
        const updated = result.find((i) => i.menu_id === target.menu_id);
        expect(updated?.quantity).toBe(target.quantity + 1);
      })
    );
  });

  it("updateQuantity to 0 removes item from cart", () => {
    fc.assert(
      fc.property(uniqueCartItemsArb, (items) => {
        if (items.length === 0) return;
        const target = items[0];
        const result = updateQuantity(items, target.menu_id, 0);
        expect(result.find((i) => i.menu_id === target.menu_id)).toBeUndefined();
      })
    );
  });

  it("clearCart always returns empty array", () => {
    fc.assert(
      fc.property(uniqueCartItemsArb, () => {
        expect(clearCart()).toEqual([]);
      })
    );
  });

  it("total amount is non-negative for any cart", () => {
    fc.assert(
      fc.property(uniqueCartItemsArb, (items) => {
        expect(getTotalAmount(items)).toBeGreaterThanOrEqual(0);
      })
    );
  });
});
