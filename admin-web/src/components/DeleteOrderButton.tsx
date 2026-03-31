"use client";

import { api } from "@/lib/api";

interface Props {
  orderId: string;
  onDeleted: () => void;
}

export default function DeleteOrderButton({ orderId, onDeleted }: Props) {
  const handleDelete = async () => {
    if (!confirm("이 주문을 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      onDeleted();
    } catch (err) {
      alert(err instanceof Error ? err.message : "주문 삭제 실패");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn-delete"
      data-testid={`delete-order-${orderId}`}
    >
      삭제
    </button>
  );
}
