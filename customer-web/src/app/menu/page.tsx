"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, getMenus } from "@/lib/api";
import { getStoreId, isAuthenticated } from "@/lib/auth";
import type { Category, Menu } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import CategoryNav from "@/components/CategoryNav";
import MenuGrid from "@/components/MenuGrid";
import CartFloatingButton from "@/components/CartFloatingButton";
import BottomNav from "@/components/BottomNav";

export default function MenuPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const storeId = getStoreId();
    if (!storeId) return;

    async function load() {
      try {
        const cats = await getCategories(storeId!);
        setCategories(cats);
        const items = await getMenus(storeId!);
        setMenus(items);
      } catch {
        // handle error silently for now
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  useEffect(() => {
    const storeId = getStoreId();
    if (!storeId) return;

    async function loadMenus() {
      try {
        const items = await getMenus(storeId!, selectedCategory ?? undefined);
        setMenus(items);
      } catch {
        // handle error silently
      }
    }
    loadMenus();
  }, [selectedCategory]);

  function handleAdd(menu: Menu) {
    addItem(menu.id, menu.name, menu.price);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-400">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      <CategoryNav
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <MenuGrid menus={menus} onAdd={handleAdd} />
      <CartFloatingButton />
      <BottomNav />
    </div>
  );
}
