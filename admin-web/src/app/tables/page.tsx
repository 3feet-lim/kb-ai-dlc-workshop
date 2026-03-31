"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import SideNav from "@/components/SideNav";
import TableList from "@/components/TableList";
import TableSetupForm from "@/components/TableSetupForm";

interface Table {
  id: string;
  table_number: number;
  created_at: string;
}

export default function TablesPage() {
  const { storeId, loading: authLoading, logout } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);

  const fetchTables = useCallback(async () => {
    if (!storeId) return;
    try {
      const data = await api.get<Table[]>(`/tables?store_id=${storeId}`);
      setTables(data);
    } catch { /* handled by api client */ }
  }, [storeId]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  if (authLoading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="admin-layout">
      <SideNav onLogout={logout} />
      <main className="main-content" data-testid="tables-page">
        <h1>테이블 관리</h1>
        {storeId && <TableSetupForm storeId={storeId} onCreated={fetchTables} />}
        <TableList tables={tables} />
      </main>
    </div>
  );
}
