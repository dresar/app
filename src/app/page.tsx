import Link from "next/link";
import { TopNav, BottomNav } from "@/components/layout/Navigation";
import { LightfallWrapper as Lightfall } from "@/components/visual/LightfallWrapper";
import { CursorGridWrapper as CursorGrid } from "@/components/visual/CursorGridWrapper";
import { MaskedHeadingWrapper as MaskedHeading } from "@/components/visual/MaskedHeadingWrapper";
import { MagicBentoWrapper as MagicBento } from "@/components/visual/MagicBentoWrapper";
import ScrollStack, { ScrollStackItem } from "@/components/visual/ScrollStack";

const agentBadges = [
  { slug: "claude-code", name: "Claude Code", color: "#D4A853" },
  { slug: "cursor", name: "Cursor", color: "#A78BFA" },
  { slug: "codex-cli", name: "Codex CLI", color: "#34D399" },
  { slug: "antigravity", name: "Antigravity", color: "#06B6D4" },
  { slug: "gemini-cli", name: "Gemini CLI", color: "#6B7885", legacy: true },
];

export default function HomePage() {
  return (
    <>
      <TopNav />

      {/* Global Subtle Interactive CursorGrid Background Layer */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <CursorGrid
          cellSize={65}
          color="#06B6D4"
          radius={160}
          falloff="smooth"
          holdTime={350}
          fadeDuration={700}
          lineWidth={1.2}
          maxOpacity={0.5}
          fillOpacity={0.06}
          gridOpacity={0.04}
          cellRadius={6}
          clickPulse={true}
          pulseSpeed={700}
        />
      </div>

      <main style={{ position: "relative", zIndex: 1, paddingTop: "64px", paddingBottom: "80px" }}>
        {/* ── 1. Hero Section ────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "600px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Lightfall WebGL vibrant ambient background */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Lightfall
              colors={["#06B6D4", "#00F0FF", "#3B82F6", "#A855F7"]}
              backgroundColor="#0A0E12"
              speed={0.6}
              streakCount={6}
              streakWidth={1.2}
              streakLength={1.5}
              glow={1.4}
              density={0.7}
              twinkle={1.0}
              zoom={2.2}
              backgroundGlow={0.6}
              opacity={0.7}
              mouseInteraction={true}
              mouseStrength={0.8}
              mouseRadius={0.8}
            />
          </div>

          {/* Dark gradient overlay for contrast */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at center, rgba(10,14,18,0.3) 0%, rgba(10,14,18,0.85) 100%)",
              pointerEvents: "none",
            }}
          />

          <div className="container-main" style={{ position: "relative", zIndex: 1, paddingTop: "64px", paddingBottom: "64px" }}>
            {/* Agent support badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
              {agentBadges.map((agent) => (
                <span
                  key={agent.slug}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "600",
                    border: `1px solid ${agent.color}50`,
                    backgroundColor: `${agent.color}20`,
                    color: agent.legacy ? "var(--color-text-muted)" : agent.color,
                    fontFamily: "JetBrains Mono, monospace",
                    backdropFilter: "blur(6px)",
                    boxShadow: `0 2px 10px ${agent.color}20`,
                  }}
                >
                  {agent.name}
                  {agent.legacy && " (legacy)"}
                </span>
              ))}
            </div>

            {/* Bright High-Contrast Masked Heading Component */}
            <div style={{ maxWidth: "880px", marginBottom: "20px" }}>
              <MaskedHeading
                text="AI Coding Skill Library Bahasa Indonesia"
                tag="h1"
                mediaType="image"
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop"
                fillScale={1.3}
                parallax={24}
                brightness={1.8}
                saturation={1.6}
                reveal="rise"
                trigger="mount"
                align="left"
                weight={800}
                textScale={0.08}
                lineHeight={1.08}
                tracking={-0.03}
              />
            </div>

            <p
              style={{
                fontSize: "18px",
                color: "var(--color-text-secondary)",
                maxWidth: "640px",
                marginBottom: "36px",
                lineHeight: "1.7",
                fontWeight: "400",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              Platform open-source untuk menemukan dan menggunakan AI coding skills tervalidasi — siap pakai untuk Claude Code, Cursor, Antigravity, dan AI Agent lainnya.
            </p>

            {/* Premium Search Box Form */}
            <form action="/skills" method="GET" style={{ maxWidth: "600px", marginBottom: "36px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "6px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(18, 24, 31, 0.85)",
                  border: "1px solid rgba(6, 182, 212, 0.4)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(6, 182, 212, 0.15)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <input
                  type="search"
                  name="q"
                  placeholder="Cari skill... (contoh: nextjs error boundary, drizzle setup)"
                  style={{
                    flex: 1,
                    padding: "12px 18px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "var(--color-text-primary)",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "12px 28px",
                    borderRadius: "var(--radius-sm)",
                    background: "linear-gradient(135deg, #06B6D4, #0891B2)",
                    color: "#0A0E12",
                    fontWeight: "700",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 14px rgba(6, 182, 212, 0.35)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  🔍 Cari Skill
                </button>
              </div>
            </form>

            {/* Premium Action Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <Link
                href="/skills"
                style={{
                  padding: "14px 28px",
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, #06B6D4 0%, #00F0FF 100%)",
                  color: "#0A0E12",
                  fontWeight: "700",
                  fontSize: "15px",
                  textDecoration: "none",
                  boxShadow: "0 4px 24px rgba(6, 182, 212, 0.45)",
                  transition: "all var(--transition-fast)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📦</span> Jelajahi Skill Library
              </Link>

              <Link
                href="/docs"
                style={{
                  padding: "14px 28px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: "15px",
                  textDecoration: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(10px)",
                  transition: "all var(--transition-fast)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📖</span> Baca Dokumentasi
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. MagicBento Grid Section ───────────────────────────────────── */}
        <section className="container-main" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px" }}>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-primary)", letterSpacing: "0.1em" }}>
                INTERACTIVE BENTO GRID
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "4px" }}>
                Kategori Skill Utama
              </h2>
            </div>
            <Link href="/categories" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              Lihat Semua Kategori →
            </Link>
          </div>

          {/* MagicBento Component */}
          <MagicBento
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={320}
            particleCount={10}
            glowColor="6, 182, 212"
          />
        </section>

        {/* ── 3. ScrollStack Feature Cards Section ─────────────────────────── */}
        <section
          style={{
            backgroundColor: "rgba(18, 24, 31, 0.4)",
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
            paddingTop: "80px",
            paddingBottom: "80px",
          }}
        >
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-primary)", letterSpacing: "0.1em" }}>
                STACKED FEATURE SHOWCASE
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", marginTop: "4px" }}>
                Mengapa Menggunakan AI Skill dari skill.id?
              </h2>
            </div>

            {/* ScrollStack Component */}
            <ScrollStack useWindowScroll={true} itemDistance={60} baseScale={0.92} itemScale={0.03}>
              <ScrollStackItem>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ fontSize: "40px" }}>⚡</div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px", color: "var(--color-primary)" }}>
                      Instalasi 1 Perintah CLI
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "15px", lineHeight: "1.6" }}>
                      Install skill langsung ke folder agent kesayangan kamu dalam hitungan detik via <code>npx skill-id add &lt;name&gt;</code>.
                    </p>
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ fontSize: "40px" }}>🛡️</div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px", color: "var(--color-primary)" }}>
                      Tervalidasi & Lolos Pemindaian Keamanan
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "15px", lineHeight: "1.6" }}>
                      Setiap skill melewati Zod schema check ketat, pengetesan performa, dan 20+ poin pemindaian potensi kelemahan keamanan.
                    </p>
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ fontSize: "40px" }}>🤖</div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px", color: "var(--color-primary)" }}>
                      Kompatibilitas Multi-Agent Universal
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "15px", lineHeight: "1.6" }}>
                      Format JSON & SKILL.md terstandarisasi yang siap dipakai di Claude Code, Cursor, Antigravity, Codex CLI, dan Gemini.
                    </p>
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ fontSize: "40px" }}>🇮🇩</div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px", color: "var(--color-primary)" }}>
                      Instruksi Bahasa Indonesia Natural
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "15px", lineHeight: "1.6" }}>
                      Didesain khusus dalam Bahasa Indonesia yang alami agar AI Agent dapat memproses instruksi dengan tingkat presisi maksimal.
                    </p>
                  </div>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid var(--color-border)", marginTop: "64px", padding: "32px 0" }}>
          <div className="container-main" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700" }}>
              skill<span style={{ color: "var(--color-primary)" }}>.id</span> — Open-Source AI Coding Skills
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              © 2026 AI Skill Factory Indonesia · Standar Terbuka Agent Skills
            </div>
          </div>
        </footer>
      </main>

      <BottomNav />
    </>
  );
}
