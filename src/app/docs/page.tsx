import { TopNav, BottomNav } from "@/components/layout/Navigation";
import type { Metadata } from "next";
import { BorderGlowWrapper as BorderGlow } from "@/components/visual/BorderGlowWrapper";

export const metadata: Metadata = {
  title: "Dokumentasi Platform",
  description: "Panduan lengkap penggunaan, arsitektur, dan integrasi CLI AI Skill Factory Indonesia.",
};

const docSections = [
  {
    title: "Mulai Cepat",
    items: [
      { icon: "🚀", title: "Pengenalan AI Skill Factory", desc: "Apa itu AI Skill dan mengapa platform ini dibuat." },
      { icon: "💻", title: "Cara Menginstall Skill ke Agent", desc: "Panduan instalasi untuk Claude Code, Cursor, Codex CLI, Antigravity." },
      { icon: "⚡", title: "Penggunaan CLI (npx skill-id)", desc: "Perintah CLI untuk pencarian, instalasi, dan sync skill." },
    ],
  },
  {
    title: "Membuat Skill (Generator)",
    items: [
      { icon: "📝", title: "Panduan Form Generator", desc: "Cara mengisi requirement form secara efektif." },
      { icon: "⚙️", title: "Standar Canonical JSON (v1.0.0)", desc: "Spesifikasi schema canonical JSON yang dihasilkan AI." },
      { icon: "🛡️", title: "Security Scanner & Quality Rubric", desc: "Bagaimana skor keamanan 20+ risiko & rubric 12 dimensi dihitung." },
    ],
  },
  {
    title: "Admin & Operations",
    items: [
      { icon: "🔑", title: "Setup AI Provider", desc: "Konfigurasi Anthropic, Gemini, OpenAI, Groq dengan fallback chain." },
      { icon: "👥", title: "Role-Based Access Control (RBAC)", desc: "Hak akses User, Moderator, Admin, Superadmin." },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "80px", paddingBottom: "80px", minHeight: "100vh" }}>
        <div style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "rgba(18, 24, 31, 0.4)", backdropFilter: "blur(12px)" }}>
          <div className="container-main" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-primary)", letterSpacing: "0.1em" }}>
              DOCUMENTATION & GUIDES
            </span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginTop: "4px", marginBottom: "12px" }}>
              Dokumentasi Platform
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "16px", maxWidth: "600px" }}>
              Panduan lengkap penggunaan, arsitektur, dan standar Agent Skills terbuka.
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {docSections.map((sec) => (
              <section key={sec.title}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "18px", color: "var(--color-primary)" }}>
                  {sec.title}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                  {sec.items.map((item) => (
                    <BorderGlow key={item.title} borderRadius={16} glowRadius={35} glowColor="187 92 43">
                      <div style={{ padding: "20px" }}>
                        <div style={{ fontSize: "24px", marginBottom: "10px" }}>{item.icon}</div>
                        <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", color: "var(--color-text-primary)" }}>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                          {item.desc}
                        </p>
                      </div>
                    </BorderGlow>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
