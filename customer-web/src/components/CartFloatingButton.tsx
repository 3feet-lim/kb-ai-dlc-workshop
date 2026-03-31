"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartFloatingButton() {
  const { totalCount, totalAmount } = useCart();

  if (totalCount === 0) return null;

  return (
    <Link
      href="/cart"
      data-testid="cart-floating-button"
      className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto bg-blue-600 text-white rounded-2xl py-4 px-6 flex items-center justify-between shadow-lg hover:bg-blue-700 transition-colors z-40"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">🛒</span>
        <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      </div>
      <span className="font-bold">{totalAmount.toLocaleString()}원 주문하기</span>
    </Link>
  );
}
