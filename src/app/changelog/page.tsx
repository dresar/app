import { TopNav, BottomNav } from "@/components/layout/Navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog Platform",
  description: "Catatan rilis dan pembaharuan fitur AI Skill Factory Indonesia.",
};

const releases = [
  {
    version: "v1.0.0",
    date: "8 Agustus 2026",
    title: "Peluncuran Resmi AI Skill Factory Indonesia MVP",
    changes: [
      "33 tabel database tersimpan di Neon PostgreSQL.",
      "Support 5 AI Coding Agent: Claude Code, Cursor, Codex CLI, Antigravity, Gemini CLI.",
      "18-Stage AI Generation Engine dengan Vercel AI SDK.",
      "System Prompt 22 Modul untuk penjaminan kualitas skill.",
      "Design system bertema dark mode dengan HSL cyan glow & responsive layout.",
      "Admin Panel lengkap untuk kelola skill, user, AI provider, dan audit logs.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "64px", paddingBottom: "80px", minHeight: "100vh" }}>
        <div style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <div className="container-main" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "12px" }}>
              Changelog Platform
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "16px" }}>
              Catatan pembaharuan fitur dan rilis resmi platform AI Skill Factory Indonesia.
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: "40px", maxWidth: "780px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {releases.map((rel) => (
              <div key={rel.version} className="card-surface" style={{ padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary)", backgroundColor: "rgba(6, 182, 212, 0.1)", padding: "2px 10px", borderRadius: "999px", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                    {rel.version}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{rel.date}</span>
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
                  {rel.title}
                </h2>

                <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {rel.changes.map((ch, i) => (
                    <li key={i} style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                      {ch}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
