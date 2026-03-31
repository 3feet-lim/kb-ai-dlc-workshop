"use client";

import { api } from "@/lib/api";

interface Menu {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
}

interface Props {
  menu: Menu;
  onEdit: () => void;
  onRefresh: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function MenuItem({ menu, onEdit, onRefresh }: Props) {
  const handleDelete = async () => {
    if (!confirm(`"${menu.name}" 메뉴를 삭제하시겠습니까?`)) return;
    try {
      await api.delete(`/menus/${menu.id}`);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "메뉴 삭제 실패");
    }
  };

  return (
    <div className="menu-item" data-testid={`menu-item-${menu.id}`}>
      {menu.image_url && (
        <img
          src={`${API_BASE}${menu.image_url}`}
          alt={menu.name}
          className="menu-thumbnail"
        />
      )}
      <div className="menu-info">
        <span className="menu-name">{menu.name}</span>
        <span className="menu-price">{menu.price.toLocaleString()}원</span>
      </div>
      <div className="menu-actions">
        <button onClick={onEdit} className="btn-small" data-testid={`menu-edit-${menu.id}`}>
          수정
        </button>
        <button onClick={handleDelete} className="btn-small btn-delete" data-testid={`menu-delete-${menu.id}`}>
          삭제
        </button>
      </div>
    </div>
  );
}
