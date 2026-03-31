"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  loadCart,
  saveCart,
  addToCart as addFn,
  removeFromCart as removeFn,
  updateQuantity as updateFn,
  clearCart as clearFn,
  getTotalAmount,
  getTotalCount,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";
import React from "react";

interface CartContextValue {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
  addItem: (menuId: string, menuName: string, unitPrice: number) => void;
  removeItem: (menuId: string) => void;
  updateItemQuantity: (menuId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback(
    (menuId: string, menuName: string, unitPrice: number) => {
      setItems((prev) => addFn(prev, menuId, menuName, unitPrice));
    },
    []
  );

  const removeItem = useCallback((menuId: string) => {
    setItems((prev) => removeFn(prev, menuId));
  }, []);

  const updateItemQuantity = useCallback(
    (menuId: string, quantity: number) => {
      setItems((prev) => updateFn(prev, menuId, quantity));
    },
    []
  );

  const clear = useCallback(() => {
    setItems(clearFn());
  }, []);

  const value: CartContextValue = {
    items,
    totalAmount: getTotalAmount(items),
    totalCount: getTotalCount(items),
    addItem,
    removeItem,
    updateItemQuantity,
    clear,
  };

  return React.createElement(CartContext.Provider, { value }, children);
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
