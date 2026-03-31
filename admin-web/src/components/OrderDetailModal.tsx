"use client";

import StatusButtons from "./StatusButtons";
import DeleteOrderButton from "./DeleteOrderButton";

interface OrderItem {
  id: string;
  menu_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  status: "PENDING" | "PREPARING" | "COMPLETED";
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

interface Props {
  tableNumber: number;
  orders: Order[];
  onClose: () => void;
  onRefresh: () => void;
}

export default function OrderDetailModal({ tableNumber, orders, onClose, onRefresh }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose} data-testid="order-detail-modal">
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>테이블 {tableNumber} 주문 상세</h2>
          <button onClick={onClose} className="btn-close" data-testid="order-detail-close">
            ✕
          </button>
        </div>
        <div className="modal-body">
          {orders.length === 0 && <p>주문이 없습니다.</p>}
          {orders.map((order) => (
            <div key={order.id} className="order-card" data-testid={`order-${order.id}`}>
              <div className="order-header">
                <span className="order-number">{order.order_number}</span>
                <span className="order-time">
                  {new Date(order.created_at).toLocaleTimeString("ko-KR")}
                </span>
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.menu_name} x{item.quantity} — {item.subtotal.toLocaleString()}원
                  </li>
                ))}
              </ul>
              <div className="order-footer">
                <span className="order-total">{order.total_amount.toLocaleString()}원</span>
                <StatusButtons orderId={order.id} status={order.status} onUpdated={onRefresh} />
                <DeleteOrderButton orderId={order.id} onDeleted={onRefresh} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
