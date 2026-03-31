import fc from "fast-check";
import type { CartItem, Menu, Category } from "@/lib/types";

/** PBT-07: Domain generator for CartItem */
export const cartItemArb: fc.Arbitrary<CartItem> = fc.record({
  menu_id: fc.uuid(),
  menu_name: fc.string({ minLength: 1, maxLength: 100 }),
  unit_price: fc.integer({ min: 0, max: 1_000_000 }),
  quantity: fc.integer({ min: 1, max: 99 }),
});

/** PBT-07: Domain generator for Menu */
export const menuArb: fc.Arbitrary<Menu> = fc.record({
  id: fc.uuid(),
  store_id: fc.uuid(),
  category_id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  price: fc.integer({ min: 0, max: 1_000_000 }),
  description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
  image_url: fc.option(fc.webUrl(), { nil: null }),
  sort_order: fc.integer({ min: 0, max: 1000 }),
  is_available: fc.boolean(),
});

/** PBT-07: Domain generator for Category */
export const categoryArb: fc.Arbitrary<Category> = fc.record({
  id: fc.uuid(),
  store_id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  sort_order: fc.integer({ min: 0, max: 100 }),
});

/** Generate a list of CartItems with unique menu_ids */
export const uniqueCartItemsArb: fc.Arbitrary<CartItem[]> = fc
  .uniqueArray(cartItemArb, { comparator: (a, b) => a.menu_id === b.menu_id, minLength: 1, maxLength: 20 });
