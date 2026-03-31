"use client";

import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryNav({ categories, selectedId, onSelect }: Props) {
  return (
    <nav
      data-testid="category-nav"
      className="flex gap-2 overflow-x-auto py-3 px-4 bg-white sticky top-0 z-10 border-b border-gray-100 scrollbar-hide"
    >
      <button
        data-testid="category-nav-all"
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors ${
          selectedId === null
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          data-testid={`category-nav-${cat.id}`}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium min-h-[44px] transition-colors ${
            selectedId === cat.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}
