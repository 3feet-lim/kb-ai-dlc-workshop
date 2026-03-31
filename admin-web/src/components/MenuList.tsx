"use client";

import MenuItem from "./MenuItem";

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
  menus: Menu[];
  onEdit: (menu: Menu) => void;
  onRefresh: () => void;
}

export default function MenuList({ menus, onEdit, onRefresh }: Props) {
  const sorted = [...menus].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="menu-list" data-testid="menu-list">
      {sorted.length === 0 && <p>이 카테고리에 메뉴가 없습니다.</p>}
      {sorted.map((menu) => (
        <MenuItem
          key={menu.id}
          menu={menu}
          onEdit={() => onEdit(menu)}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
