"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/useCart";

const tabs = [
  { href: "/menu", label: "메뉴", icon: "🍽️" },
  { href: "/cart", label: "장바구니", icon: "🛒" },
  { href: "/orders", label: "주문내역", icon: "📋" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { totalCount } = useCart();

  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              data-testid={`bottom-nav-${tab.href.slice(1)}`}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-xl relative">
                {tab.icon}
                {tab.href === "/cart" && totalCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </span>
              <span className="text-xs mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
