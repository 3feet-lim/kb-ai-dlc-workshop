"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: "📋" },
  { href: "/tables", label: "테이블 관리", icon: "🪑" },
  { href: "/menus", label: "메뉴 관리", icon: "🍽️" },
];

export default function SideNav({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="sidenav" data-testid="side-nav">
      <div className="sidenav-brand">Admin</div>
      <ul className="sidenav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`sidenav-link ${pathname === item.href ? "active" : ""}`}
              data-testid={`sidenav-link-${item.href.slice(1)}`}
            >
              <span className="sidenav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="sidenav-logout"
        onClick={onLogout}
        data-testid="sidenav-logout-button"
      >
        로그아웃
      </button>
    </nav>
  );
}
