"use client";

import { useState, FormEvent } from "react";
import { api } from "@/lib/api";

interface Props {
  storeId: string;
  onCreated: () => void;
}

export default function TableSetupForm({ storeId, onCreated }: Props) {
  const [tableNumber, setTableNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/tables", {
        store_id: storeId,
        table_number: Number(tableNumber),
        password,
      });
      setTableNumber("");
      setPassword("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "테이블 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="table-setup-form" data-testid="table-setup-form">
      <h3>테이블 추가</h3>
      {error && <p className="error-message" role="alert">{error}</p>}
      <label htmlFor="tableNumber">테이블 번호</label>
      <input
        id="tableNumber"
        type="number"
        min="1"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        required
        data-testid="table-setup-number-input"
      />
      <label htmlFor="tablePassword">비밀번호</label>
      <input
        id="tablePassword"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        data-testid="table-setup-password-input"
      />
      <button type="submit" disabled={loading} data-testid="table-setup-submit">
        {loading ? "생성 중..." : "테이블 생성"}
      </button>
    </form>
  );
}
