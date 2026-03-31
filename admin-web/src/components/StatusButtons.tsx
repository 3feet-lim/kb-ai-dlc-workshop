"use client";

import { api } from "@/lib/api";

type OrderStatus = "PENDING" | "PREPARING" | "COMPLETED";

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  PENDING: "PREPARING",
  PREPARING: "COMPLETED",
  COMPLETED: null,
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "대기중",
  PREPARING: "준비중",
  COMPLETED: "완료",
};

interface Props {
  orderId: string;
  status: OrderStatus;
  onUpdated: () => void;
}

export default function StatusButtons({ orderId, status, onUpdated }: Props) {
  const next = STATUS_FLOW[status];

  const handleChange = async () => {
    if (!next) return;
    try {
      await api.patch(`/orders/${orderId}/status`, { status: next });
      onUpdated();
    } catch (err) {
      alert(err instanceof Error ? err.message : "상태 변경 실패");
    }
  };

  return (
    <div className="status-buttons" data-testid="status-buttons">
      <span className={`status-badge status-${status.toLowerCase()}`}>
        {STATUS_LABELS[status]}
      </span>
      {next && (
        <button
          onClick={handleChange}
          className="btn-status"
          data-testid={`status-change-${orderId}`}
        >
          → {STATUS_LABELS[next]}
        </button>
      )}
    </div>
  );
}
