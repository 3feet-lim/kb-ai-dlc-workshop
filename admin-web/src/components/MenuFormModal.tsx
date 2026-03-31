"use client";

import { useState, FormEvent } from "react";
import { api } from "@/lib/api";

interface Menu {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

interface Props {
  storeId: string;
  categoryId: string;
  editMenu?: Menu | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function MenuFormModal({ storeId, categoryId, editMenu, onClose, onSaved }: Props) {
  const [name, setName] = useState(editMenu?.name ?? "");
  const [price, setPrice] = useState(editMenu?.price?.toString() ?? "");
  const [description, setDescription] = useState(editMenu?.description ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("가격은 0 이상이어야 합니다.");
      return;
    }
    if (name.length > 100) {
      setError("메뉴명은 100자 이내여야 합니다.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = editMenu?.image_url ?? null;
      if (imageFile) {
        const res = await api.upload<{ url: string }>("/files/upload", imageFile);
        imageUrl = res.url;
      }

      const body = {
        store_id: storeId,
        category_id: categoryId,
        name,
        price: priceNum,
        description: description || null,
        image_url: imageUrl,
      };

      if (editMenu) {
        await api.put(`/menus/${editMenu.id}`, body);
      } else {
        await api.post("/menus", body);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="menu-form-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{editMenu ? "메뉴 수정" : "메뉴 등록"}</h2>
        {error && <p className="error-message" role="alert">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="menuName">메뉴명 *</label>
          <input
            id="menuName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            data-testid="menu-form-name-input"
          />

          <label htmlFor="menuPrice">가격 *</label>
          <input
            id="menuPrice"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            data-testid="menu-form-price-input"
          />

          <label htmlFor="menuDesc">설명</label>
          <textarea
            id="menuDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            data-testid="menu-form-description-input"
          />

          <label htmlFor="menuImage">이미지</label>
          <input
            id="menuImage"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            data-testid="menu-form-image-input"
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" data-testid="menu-form-cancel">
              취소
            </button>
            <button type="submit" disabled={loading} className="btn-primary" data-testid="menu-form-submit">
              {loading ? "저장 중..." : editMenu ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
