"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface HistoryEntry {
  id: string;
  order_data: {
    order_number: string;
    total_amount: number;
    items: { menu_name: string; quantity: number; subtotal: number }[];
  };
  completed_at: string;
}

interface Props {
  storeId: string;
  tableId: string;
  tableNumber: number;
  onClose: () => void;
}

export default function OrderHistoryModal({ storeId, tableId, tableNumber, onClose }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ store_id: storeId, table_id: tableId });
        if (dateFilter) params.set("date", dateFilter);
        const data = await api.get<HistoryEntry[]>(`/orders/history?${params}`);
        setHistory(data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [storeId, tableId, dateFilter]);

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="order-history-modal">
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>테이블 {tableNumber} 과거 주문 내역</h2>
          <button onClick={onClose} className="btn-close" data-testid="order-history-close">✕</button>
        </div>
        <div className="modal-filter">
          <label htmlFor="historyDate">날짜 필터</label>
          <input
            id="historyDate"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            data-testid="order-history-date-filter"
          />
        </div>
        <div className="modal-body">
          {loading && <p>로딩 중...</p>}
          {!loading && history.length === 0 && <p>과거 주문 내역이 없습니다.</p>}
          {history.map((entry) => (
            <div key={entry.id} className="history-card" data-testid={`history-${entry.id}`}>
              <div className="history-header">
                <span>{entry.order_data.order_number}</span>
                <span className="text-muted">
                  이용 완료: {new Date(entry.completed_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <ul>
                {entry.order_data.items.map((item, i) => (
                  <li key={i}>
                    {item.menu_name} x{item.quantity} — {item.subtotal.toLocaleString()}원
                  </li>
                ))}
              </ul>
              <div className="history-total">
                합계: {entry.order_data.total_amount.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
