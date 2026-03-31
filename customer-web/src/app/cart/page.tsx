"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { createOrder, ApiError } from "@/lib/api";
import CartItemComponent from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import OrderConfirmModal from "@/components/OrderConfirmModal";
import BottomNav from "@/components/BottomNav";

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount, updateItemQuantity, removeItem, clear } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleOrder() {
    setLoading(true);
    setError("");
    try {
      const order = await createOrder({
        items: items.map((i) => ({ menu_id: i.menu_id, quantity: i.quantity })),
      });
      clear();
      router.push(`/order-success?order_number=${encodeURIComponent(order.order_number)}`);
    } catch (err) {
      setShowConfirm(false);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("주문에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-4">🛒</span>
          <p>장바구니가 비어있습니다.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-3">
        <h1 className="text-lg font-bold">장바구니</h1>

        {error && (
          <div
            data-testid="cart-error"
            role="alert"
            className="bg-red-50 text-red-600 text-sm p-3 rounded-lg"
          >
            {error}
          </div>
        )}

        {items.map((item) => (
          <CartItemComponent
            key={item.menu_id}
            item={item}
            onUpdateQuantity={updateItemQuantity}
            onRemove={removeItem}
          />
        ))}

        <CartSummary totalAmount={totalAmount} />

        <div className="flex gap-3 pt-2">
          <button
            data-testid="cart-clear-button"
            onClick={clear}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 min-h-[44px] hover:bg-gray-50 transition-colors"
          >
            비우기
          </button>
          <button
            data-testid="cart-order-button"
            onClick={() => setShowConfirm(true)}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold min-h-[44px] hover:bg-blue-700 transition-colors"
          >
            주문하기
          </button>
        </div>
      </div>

      {showConfirm && (
        <OrderConfirmModal
          items={items}
          onConfirm={handleOrder}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}

      <BottomNav />
    </div>
  );
}
