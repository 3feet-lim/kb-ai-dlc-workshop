"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSSE } from "@/hooks/useSSE";
import { api } from "@/lib/api";
import SideNav from "@/components/SideNav";
import TableFilter from "@/components/TableFilter";
import TableGrid from "@/components/TableGrid";
import OrderDetailModal from "@/components/OrderDetailModal";
import CompleteSessionModal from "@/components/CompleteSessionModal";
import OrderHistoryModal from "@/components/OrderHistoryModal";

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
  table_id: string;
  items: OrderItem[];
}

interface Table {
  id: string;
  table_number: number;
}

export default function DashboardPage() {
  const { storeId, loading: authLoading, logout } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterTableId, setFilterTableId] = useState<string | null>(null);
  const [newOrderTableIds, setNewOrderTableIds] = useState<Set<string>>(new Set());

  // Modal states
  const [selectedTable, setSelectedTable] = useState<{ id: string; number: number } | null>(null);
  const [completeTable, setCompleteTable] = useState<{ id: string; number: number } | null>(null);
  const [historyTable, setHistoryTable] = useState<{ id: string; number: number } | null>(null);

  const fetchData = useCallback(async () => {
    if (!storeId) return;
    try {
      const [t, o] = await Promise.all([
        api.get<Table[]>(`/tables?store_id=${storeId}`),
        api.get<Order[]>(`/orders?store_id=${storeId}`),
      ]);
      setTables(t);
      setOrders(o);
    } catch { /* handled by api client */ }
  }, [storeId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useSSE({
    storeId,
    onEvent: (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_order" || data.type === "status_changed" || data.type === "order_deleted" || data.type === "session_ended") {
          fetchData();
        }
        if (data.type === "new_order" && data.table_id) {
          setNewOrderTableIds((prev) => new Set(prev).add(data.table_id));
          setTimeout(() => {
            setNewOrderTableIds((prev) => {
              const next = new Set(prev);
              next.delete(data.table_id);
              return next;
            });
          }, 5000);
        }
      } catch { /* ignore parse errors */ }
    },
  });

  if (authLoading) return <div className="loading">로딩 중...</div>;

  const filteredTables = filterTableId
    ? tables.filter((t) => t.id === filterTableId)
    : tables;

  return (
    <div className="admin-layout">
      <SideNav onLogout={logout} />
      <main className="main-content" data-testid="dashboard-page">
        <h1>주문 모니터링</h1>
        <TableFilter tables={tables} selected={filterTableId} onChange={setFilterTableId} />
        <TableGrid
          tables={filteredTables}
          orders={orders}
          newOrderTableIds={newOrderTableIds}
          onSelectTable={(id, num) => setSelectedTable({ id, number: num })}
          onCompleteSession={(id, num) => setCompleteTable({ id, number: num })}
          onShowHistory={(id, num) => setHistoryTable({ id, number: num })}
        />

        {selectedTable && (
          <OrderDetailModal
            tableNumber={selectedTable.number}
            orders={orders.filter((o) => o.table_id === selectedTable.id)}
            onClose={() => setSelectedTable(null)}
            onRefresh={fetchData}
          />
        )}

        {completeTable && (
          <CompleteSessionModal
            tableId={completeTable.id}
            tableNumber={completeTable.number}
            onClose={() => setCompleteTable(null)}
            onCompleted={fetchData}
          />
        )}

        {historyTable && storeId && (
          <OrderHistoryModal
            storeId={storeId}
            tableId={historyTable.id}
            tableNumber={historyTable.number}
            onClose={() => setHistoryTable(null)}
          />
        )}
      </main>
    </div>
  );
}
