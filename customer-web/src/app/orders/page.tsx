"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getOrders } from "@/lib/api";
import { getStoreId, getTableId, isAuthenticated } from "@/lib/auth";
import type { Order } from "@/lib/types";
import { useSSE } from "@/hooks/useSSE";
import OrderCard from "@/components/OrderCard";
import BottomNav from "@/components/BottomNav";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    const storeId = getStoreId();
    const tableId = getTableId();
    if (!storeId || !tableId) return;
    try {
      // session_id is embedded in the token, backend resolves it
      const data = await getOrders(storeId, tableId, "");
      setOrders(data);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    loadOrders();
  }, [router, loadOrders]);

  // SSE: reload orders on any order event
  useSSE({
    onNewOrder: () => loadOrders(),
    onStatusChanged: () => loadOrders(),
    onOrderDeleted: () => loadOrders(),
    onSessionEnded: () => {
      setOrders([]);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-3">
        <h1 className="text-lg font-bold">주문 내역</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4">📋</span>
            <p>주문 내역이 없습니다.</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
