import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};

const dashboardCards = [
  { label: "Total Skill", value: "8", icon: "📦", color: "var(--color-primary)", href: "/admin/skills" },
  { label: "Dipublikasikan", value: "5", icon: "✅", color: "var(--color-success)", href: "/admin/skills?status=published" },
  { label: "Review / Draft", value: "3", icon: "🔍", color: "#818CF8", href: "/admin/skills?status=review" },
  { label: "Total Pengguna", value: "7", icon: "👥", color: "var(--color-warning)", href: "/admin/users" },
];

const recentActions = [
  { action: "Platform diinisialisasi untuk skill.id", time: "Baru saja", icon: "🚀" },
  { action: "Database Neon PostgreSQL (33 tabel) siap digunakan", time: "Baru saja", icon: "🗄️" },
  { action: "8 AI Skills tervalidasi tersimpan di database", time: "Baru saja", icon: "📦" },
];

const quickLinks = [
  { href: "/generate", label: "✨ Prompt Builder / Skill Creator", primary: true },
  { href: "/admin/skills", label: "📦 Kelola Skills" },
  { href: "/admin/users", label: "👥 Kelola Pengguna" },
  { href: "/admin/settings", label: "⚙️ Pengaturan Site" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "6px" }}>
          Dashboard Admin
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
          Selamat datang di Admin Panel skill.id — Manajemen AI Coding Skills
        </p>
      </div>

      {/* Stats cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {dashboardCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            style={{ textDecoration: "none" }}
          >
            <div
              className="card-surface"
              style={{
                padding: "20px",
                transition: "all var(--transition-fast)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>{card.icon}</span>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{card.label}</span>
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: card.color,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {card.value}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", alignItems: "start" }}>
        {/* Recent activity */}
        <div className="card-surface" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "20px" }}>
            Aktivitas Terbaru
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {recentActions.map((action, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px 0",
                  borderBottom: i < recentActions.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{action.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", color: "var(--color-text-primary)", marginBottom: "2px" }}>
                    {action.action}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                    {action.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card-surface" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "20px" }}>
            Aksi Cepat
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: link.primary ? "var(--color-primary)" : "transparent",
                  color: link.primary ? "#0A0E12" : "var(--color-text-secondary)",
                  fontWeight: link.primary ? "700" : "500",
                  fontSize: "13px",
                  textDecoration: "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
