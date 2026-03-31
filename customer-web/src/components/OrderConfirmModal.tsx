"use client";

import type { CartItem } from "@/lib/types";
import { getTotalAmount } from "@/lib/cart";

interface Props {
  items: CartItem[];
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function OrderConfirmModal({
  items,
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  const total = getTotalAmount(items);

  return (
    <div
      data-testid="order-confirm-modal"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="주문 확인"
    >
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold mb-4">주문을 확정하시겠습니까?</h2>

        <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.menu_id}
              className="flex justify-between text-sm text-gray-700"
            >
              <span>
                {item.menu_name} × {item.quantity}
              </span>
              <span>{(item.unit_price * item.quantity).toLocaleString()}원</span>
            </li>
          ))}
        </ul>

        <div className="border-t pt-3 mb-4 flex justify-between font-bold">
          <span>총 금액</span>
          <span>{total.toLocaleString()}원</span>
        </div>

        <div className="flex gap-3">
          <button
            data-testid="order-confirm-cancel"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 min-h-[44px] hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            data-testid="order-confirm-submit"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold min-h-[44px] hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "주문 중..." : "주문 확정"}
          </button>
        </div>
      </div>
    </div>
  );
}
