"use client";

import type { Order, OrderStatus } from "@/lib/types";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "대기중", color: "bg-yellow-100 text-yellow-800" },
  PREPARING: { label: "준비중", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "완료", color: "bg-green-100 text-green-800" },
};

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const status = statusConfig[order.status];
  const time = new Date(order.created_at).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      data-testid={`order-card-${order.id}`}
      className="bg-white rounded-xl shadow-sm p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold">{order.order_number}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <span
          data-testid={`order-status-${order.id}`}
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <ul className="space-y-1 mb-3">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between text-sm text-gray-600"
          >
            <span>
              {item.menu_name} × {item.quantity}
            </span>
            <span>{item.subtotal.toLocaleString()}원</span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-2 flex justify-between font-bold text-sm">
        <span>합계</span>
        <span className="text-blue-600">
          {order.total_amount.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
