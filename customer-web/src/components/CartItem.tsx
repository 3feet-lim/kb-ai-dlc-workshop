"use client";

import type { CartItem as CartItemType } from "@/lib/types";

interface Props {
  item: CartItemType;
  onUpdateQuantity: (menuId: string, quantity: number) => void;
  onRemove: (menuId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <div
      data-testid={`cart-item-${item.menu_id}`}
      className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{item.menu_name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.unit_price.toLocaleString()}원
        </p>
      </div>

      <div className="flex items-center gap-2 ml-3">
        <button
          data-testid={`cart-item-decrease-${item.menu_id}`}
          onClick={() => onUpdateQuantity(item.menu_id, item.quantity - 1)}
          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg min-w-[44px] min-h-[44px] hover:bg-gray-100 transition-colors"
          aria-label={`${item.menu_name} 수량 감소`}
        >
          −
        </button>
        <span
          data-testid={`cart-item-quantity-${item.menu_id}`}
          className="w-8 text-center font-medium"
        >
          {item.quantity}
        </span>
        <button
          data-testid={`cart-item-increase-${item.menu_id}`}
          onClick={() => onUpdateQuantity(item.menu_id, item.quantity + 1)}
          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg min-w-[44px] min-h-[44px] hover:bg-gray-100 transition-colors"
          aria-label={`${item.menu_name} 수량 증가`}
        >
          +
        </button>
      </div>

      <div className="flex items-center gap-3 ml-3">
        <span className="font-bold text-sm whitespace-nowrap">
          {(item.unit_price * item.quantity).toLocaleString()}원
        </span>
        <button
          data-testid={`cart-item-remove-${item.menu_id}`}
          onClick={() => onRemove(item.menu_id)}
          className="text-red-400 hover:text-red-600 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
          aria-label={`${item.menu_name} 삭제`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
