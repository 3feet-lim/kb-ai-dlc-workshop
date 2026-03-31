"use client";

import { useState, FormEvent } from "react";
import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface Props {
  storeId: string;
  editCategory?: Category | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ storeId, editCategory, onSaved, onCancel }: Props) {
  const [name, setName] = useState(editCategory?.name ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editCategory) {
        await api.put(`/categories/${editCategory.id}`, { name, store_id: storeId });
      } else {
        await api.post("/categories", { name, store_id: storeId });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form" data-testid="category-form">
      {error && <p className="error-message" role="alert">{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="카테고리명"
        required
        data-testid="category-name-input"
      />
      <button type="submit" disabled={loading} data-testid="category-save-button">
        {loading ? "저장 중..." : editCategory ? "수정" : "추가"}
      </button>
      <button type="button" onClick={onCancel} className="btn-secondary" data-testid="category-cancel-button">
        취소
      </button>
    </form>
  );
}
