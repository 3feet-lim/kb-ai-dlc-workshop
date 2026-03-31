"use client";

interface Order {
  id: string;
  order_number: string;
  status: "PENDING" | "PREPARING" | "COMPLETED";
  total_amount: number;
  created_at: string;
  items: { menu_name: string; quantity: number }[];
}

interface Props {
  tableId: string;
  tableNumber: number;
  orders: Order[];
  isNew: boolean;
  onClick: () => void;
  onCompleteSession: () => void;
  onShowHistory: () => void;
}

export default function TableCard({
  tableNumber,
  orders,
  isNew,
  onClick,
  onCompleteSession,
  onShowHistory,
}: Props) {
  const totalAmount = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;

  return (
    <div
      className={`table-card ${isNew ? "table-card-new" : ""}`}
      data-testid={`table-card-${tableNumber}`}
    >
      <div className="table-card-header" onClick={onClick} role="button" tabIndex={0}>
        <span className="table-number">테이블 {tableNumber}</span>
        <span className="table-total">{totalAmount.toLocaleString()}원</span>
      </div>
      {latestOrder && (
        <div className="table-card-preview" onClick={onClick} role="button" tabIndex={0}>
          <span className="preview-order">{latestOrder.order_number}</span>
          <span className="preview-items">
            {latestOrder.items.map((i) => `${i.menu_name} x${i.quantity}`).join(", ")}
          </span>
        </div>
      )}
      <div className="table-card-actions">
        <button
          onClick={onCompleteSession}
          className="btn-small"
          data-testid={`complete-session-${tableNumber}`}
        >
          이용 완료
        </button>
        <button
          onClick={onShowHistory}
          className="btn-small btn-secondary"
          data-testid={`show-history-${tableNumber}`}
        >
          과거 내역
        </button>
      </div>
    </div>
  );
}
