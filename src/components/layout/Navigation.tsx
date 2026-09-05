"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PillNavWrapper as PillNav } from "./PillNavWrapper";

const navItems = [
  { label: "SKILLS LIBRARY", href: "/skills" },
  { label: "KATEGORI", href: "/categories" },
  { label: "DOKUMENTASI", href: "/docs" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <div style={{ position: "relative", zIndex: 100 }}>
      <PillNav
        items={navItems}
        activeHref={pathname}
        baseColor="#0A0E12"
        pillColor="rgba(18, 24, 31, 0.9)"
        hoveredPillTextColor="#06B6D4"
        pillTextColor="#FFFFFF"
      />
    </div>
  );
}

// Bottom Navigation untuk mobile
export function BottomNav() {
  const pathname = usePathname();

  const mobileNavItems = [
    { href: "/", label: "Beranda", icon: "🏠" },
    { href: "/skills", label: "Skills", icon: "📦" },
    { href: "/categories", label: "Kategori", icon: "🗂️" },
    { href: "/search", label: "Cari", icon: "🔍" },
    { href: "/login", label: "Masuk", icon: "🔑" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "rgba(10, 14, 18, 0.95)",
        backdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      className="md:hidden"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: "60px",
        }}
      >
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                padding: "8px 16px",
                color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                textDecoration: "none",
                transition: "all var(--transition-fast)",
              }}
            >
              <span style={{ fontSize: "20px", lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: "10px", fontWeight: "500" }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
