import { TopNav, BottomNav } from "@/components/layout/Navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Platform",
  description: "AI Skill Factory Indonesia — platform open-source berbahasa Indonesia untuk AI coding skills.",
};

export default function AboutPage() {
  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "64px", paddingBottom: "80px", minHeight: "100vh" }}>
        <div className="container-main" style={{ paddingTop: "64px", maxWidth: "780px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "8px" }}>
            Tentang Platform
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "48px", fontSize: "16px" }}>
            AI Skill Factory Indonesia — ekosistem Agent Skills berbahasa Indonesia yang aman, terkurasi, dan open-source.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
                Visi
              </h2>
              <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.8" }}>
                Platform open-source berbahasa Indonesia untuk{" "}
                <strong style={{ color: "var(--color-text-primary)" }}>menemukan, membuat, memvalidasi, mengevaluasi, mengompilasi, dan menggunakan</strong>{" "}
                AI coding skills, PRD, workflows, templates, dan Agent Kits untuk AI coding agent modern —
                Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity, dan agent lain yang mengikuti standar Agent Skills terbuka.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
                Prinsip
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { num: "1", text: "AI menghasilkan DATA, backend melakukan VALIDASI, compiler menghasilkan FILE, frontend menyediakan EXPERIENCE, admin mengontrol QUALITY." },
                  { num: "2", text: "Tidak ada klaim keamanan absolut. Semua hasil scan pakai bahasa 'risiko terdeteksi', bukan 'aman 100%'." },
                  { num: "3", text: "Bahasa Indonesia natural, bukan hasil translate. Istilah teknis resmi tetap bentuk asli." },
                  { num: "4", text: "Semua provider (AI, storage, search, auth) berada di balik abstraction layer. Tidak ada vendor lock-in." },
                  { num: "5", text: "Mobile bukan warga kelas dua. Setiap halaman punya perilaku responsive yang didefinisikan eksplisit." },
                ].map((p) => (
                  <div key={p.num} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(6, 182, 212, 0.1)",
                        border: "1px solid rgba(6, 182, 212, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "var(--color-primary)",
                        flexShrink: 0,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {p.num}
                    </span>
                    <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.7", paddingTop: "4px" }}>
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
                Stack Teknologi
              </h2>
              <div
                className="card-surface"
                style={{ padding: "24px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", lineHeight: "1.8" }}
              >
                {[
                  ["Frontend", "Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui"],
                  ["Database", "Neon PostgreSQL (serverless) + Drizzle ORM"],
                  ["AI Layer", "Vercel AI SDK → Claude / Gemini / OpenAI / Groq"],
                  ["Auth", "Auth.js (NextAuth) — email/password + Google + GitHub OAuth"],
                  ["Storage", "StorageProvider abstraction → Vercel Blob"],
                  ["Search", "PostgreSQL full-text search (tsvector)"],
                  ["Deployment", "Vercel + Neon"],
                  ["License", "MIT — open-source"],
                ].map(([key, val]) => (
                  <div key={key} style={{ display: "flex", gap: "16px" }}>
                    <span style={{ color: "var(--color-primary)", minWidth: "100px" }}>{key}</span>
                    <span style={{ color: "var(--color-text-secondary)" }}>: {val}</span>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ textAlign: "center", padding: "40px", borderTop: "1px solid var(--color-border)" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "12px" }}>
                Open-Source
              </h2>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px" }}>
                Kontribusi welcome! Lihat cara setup lokal dan panduan berkontribusi di GitHub.
              </p>
              <Link
                href="/github"
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                🔗 Lihat di GitHub
              </Link>
            </section>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
