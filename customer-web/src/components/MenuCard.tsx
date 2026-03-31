"use client";

import type { Menu } from "@/lib/types";

interface Props {
  menu: Menu;
  onAdd: (menu: Menu) => void;
}

export default function MenuCard({ menu, onAdd }: Props) {
  return (
    <div
      data-testid={`menu-card-${menu.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
    >
      {menu.image_url && (
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={menu.image_url}
            alt={menu.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!menu.image_url && (
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center text-4xl text-gray-300">
          🍽️
        </div>
      )}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm truncate">{menu.name}</h3>
        {menu.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {menu.description}
          </p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-bold text-blue-600">
            {menu.price.toLocaleString()}원
          </span>
          <button
            data-testid={`menu-add-${menu.id}`}
            onClick={() => onAdd(menu)}
            className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label={`${menu.name} 장바구니에 추가`}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
