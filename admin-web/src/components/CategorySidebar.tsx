"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import CategoryForm from "./CategoryForm";

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface Props {
  storeId: string;
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRefresh: () => void;
}

export default function CategorySidebar({ storeId, categories, selectedId, onSelect, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("이 카테고리를 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/categories/${id}`);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "카테고리 삭제 실패");
    }
  };

  return (
    <aside className="category-sidebar" data-testid="category-sidebar">
      <div className="category-header">
        <h3>카테고리</h3>
        <button
          onClick={() => { setEditCategory(null); setShowForm(true); }}
          className="btn-small"
          data-testid="category-add-button"
        >
          + 추가
        </button>
      </div>
      {showForm && (
        <CategoryForm
          storeId={storeId}
          editCategory={editCategory}
          onSaved={() => { setShowForm(false); onRefresh(); }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <ul className="category-list">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`category-item ${selectedId === cat.id ? "active" : ""}`}
            data-testid={`category-item-${cat.id}`}
          >
            <button
              className="category-name"
              onClick={() => onSelect(cat.id)}
              data-testid={`category-select-${cat.id}`}
            >
              {cat.name}
            </button>
            <div className="category-actions">
              <button
                onClick={() => { setEditCategory(cat); setShowForm(true); }}
                className="btn-icon"
                data-testid={`category-edit-${cat.id}`}
                aria-label={`${cat.name} 수정`}
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="btn-icon"
                data-testid={`category-delete-${cat.id}`}
                aria-label={`${cat.name} 삭제`}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
