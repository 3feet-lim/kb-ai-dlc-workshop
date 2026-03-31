"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface Props {
  tableId: string;
  tableNumber: number;
  onClose: () => void;
  onCompleted: () => void;
}

export default function CompleteSessionModal({ tableId, tableNumber, onClose, onCompleted }: Props) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.post(`/tables/${tableId}/complete-session`);
      onCompleted();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "이용 완료 처리 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="complete-session-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>이용 완료 확인</h2>
        <p>테이블 {tableNumber}의 이용을 완료하시겠습니까?</p>
        <p className="text-muted">현재 주문 내역이 과거 이력으로 이동됩니다.</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary" data-testid="complete-session-cancel">
            취소
          </button>
          <button
            onClick={handleComplete}
            disabled={loading}
            className="btn-primary"
            data-testid="complete-session-confirm"
          >
            {loading ? "처리 중..." : "이용 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
