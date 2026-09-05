import Link from "next/link";
import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel — skill.id",
    template: "%s | Admin — skill.id",
  },
};

const adminMenuItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/skills", label: "Kelola Skills", icon: "📦" },
  { href: "/admin/generate", label: "Prompt Builder / Skill Creator", icon: "✨" },
  { href: "/admin/users", label: "Pengguna & Role", icon: "👥" },
  { href: "/admin/profile", label: "Profil Admin & Password", icon: "👤" },
  { href: "/admin/settings", label: "Pengaturan Site", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--color-background)" }} suppressHydrationWarning>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          borderRight: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 40,
        }}
        className="hidden md:flex"
      >
        <div>
          {/* Logo */}
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, var(--color-primary), #0891B2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "700",
                color: "white",
                flexShrink: 0,
              }}
            >
              AI
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>Admin Panel</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>skill.id</div>
            </div>
          </div>

          {/* Menu items */}
          <nav style={{ padding: "16px 0" }}>
            <div style={{ padding: "0 20px 8px", fontSize: "10px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Menu Utama
            </div>
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Widget */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)" }}>
          <Link
            href="/admin/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              color: "var(--color-text-primary)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
                color: "#0A0E12",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              AU
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                Admin Utama
              </div>
              <div style={{ fontSize: "11px", color: "var(--color-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                Edit Profil Admin →
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          minHeight: "100vh",
          backgroundColor: "var(--color-background)",
        }}
        className="md:ml-60"
      >
        {/* Top bar with Profile Dropdown & Back to Public Site */}
        <AdminHeader />

        {/* Page content */}
        <div style={{ padding: "32px 24px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
