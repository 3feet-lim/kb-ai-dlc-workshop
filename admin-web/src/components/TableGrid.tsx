"use client";

import TableCard from "./TableCard";

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

interface Props {
  tables: Table[];
  orders: Order[];
  newOrderTableIds: Set<string>;
  onSelectTable: (tableId: string, tableNumber: number) => void;
  onCompleteSession: (tableId: string, tableNumber: number) => void;
  onShowHistory: (tableId: string, tableNumber: number) => void;
}

export default function TableGrid({
  tables,
  orders,
  newOrderTableIds,
  onSelectTable,
  onCompleteSession,
  onShowHistory,
}: Props) {
  return (
    <div className="table-grid" data-testid="table-grid">
      {tables.map((table) => {
        const tableOrders = orders.filter((o) => o.table_id === table.id);
        return (
          <TableCard
            key={table.id}
            tableId={table.id}
            tableNumber={table.table_number}
            orders={tableOrders}
            isNew={newOrderTableIds.has(table.id)}
            onClick={() => onSelectTable(table.id, table.table_number)}
            onCompleteSession={() => onCompleteSession(table.id, table.table_number)}
            onShowHistory={() => onShowHistory(table.id, table.table_number)}
          />
        );
      })}
    </div>
  );
}
