"use client";

import type { Menu } from "@/lib/types";
import MenuCard from "./MenuCard";

interface Props {
  menus: Menu[];
  onAdd: (menu: Menu) => void;
}

export default function MenuGrid({ menus, onAdd }: Props) {
  if (menus.length === 0) {
    return (
      <div
        data-testid="menu-grid-empty"
        className="flex items-center justify-center py-20 text-gray-400"
      >
        메뉴가 없습니다.
      </div>
    );
  }

  return (
    <div
      data-testid="menu-grid"
      className="grid grid-cols-2 gap-3 p-4"
    >
      {menus.map((menu) => (
        <MenuCard key={menu.id} menu={menu} onAdd={onAdd} />
      ))}
    </div>
  );
}
