"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import SideNav from "@/components/SideNav";
import CategorySidebar from "@/components/CategorySidebar";
import MenuList from "@/components/MenuList";
import MenuFormModal from "@/components/MenuFormModal";

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface Menu {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

export default function MenusPage() {
  const { storeId, loading: authLoading, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editMenu, setEditMenu] = useState<Menu | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!storeId) return;
    try {
      const data = await api.get<Category[]>(`/categories?store_id=${storeId}`);
      setCategories(data);
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch { /* handled */ }
  }, [storeId, selectedCategoryId]);

  const fetchMenus = useCallback(async () => {
    if (!storeId || !selectedCategoryId) return;
    try {
      const data = await api.get<Menu[]>(
        `/menus?store_id=${storeId}&category_id=${selectedCategoryId}`
      );
      setMenus(data);
    } catch { /* handled */ }
  }, [storeId, selectedCategoryId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  if (authLoading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="admin-layout">
      <SideNav onLogout={logout} />
      <main className="main-content" data-testid="menus-page">
        <h1>메뉴 관리</h1>
        <div className="menus-layout">
          {storeId && (
            <CategorySidebar
              storeId={storeId}
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
              onRefresh={fetchCategories}
            />
          )}
          <div className="menus-content">
            <div className="menus-toolbar">
              <button
                onClick={() => { setEditMenu(null); setShowMenuForm(true); }}
                className="btn-primary"
                data-testid="menu-add-button"
              >
                + 메뉴 등록
              </button>
            </div>
            <MenuList
              menus={menus}
              onEdit={(menu) => { setEditMenu(menu); setShowMenuForm(true); }}
              onRefresh={fetchMenus}
            />
          </div>
        </div>

        {showMenuForm && storeId && selectedCategoryId && (
          <MenuFormModal
            storeId={storeId}
            categoryId={selectedCategoryId}
            editMenu={editMenu}
            onClose={() => setShowMenuForm(false)}
            onSaved={fetchMenus}
          />
        )}
      </main>
    </div>
  );
}
