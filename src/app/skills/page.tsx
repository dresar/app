import { TopNav, BottomNav } from "@/components/layout/Navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BorderGlowWrapper as BorderGlow } from "@/components/visual/BorderGlowWrapper";

export const metadata: Metadata = {
  title: "Skill Library",
  description: "Temukan dan unduh AI coding skills berkualitas tinggi untuk Claude Code, Cursor, Codex CLI, Antigravity, dan agent lainnya.",
};

// Mock data — akan diganti ApiSkillRepository di Phase 2
const mockSkills = [
  {
    slug: "nextjs-error-boundary-setup",
    name: "Next.js Error Boundary Setup",
    description: "Gunakan skill ini saat perlu menyiapkan error boundary dan halaman error kustom di aplikasi Next.js App Router.",
    category: "Next.js",
    status: "published",
    qualityScore: 88,
    securityScore: 96,
    downloadCount: 0,
    agents: ["claude-code", "cursor", "antigravity"],
    tags: ["nextjs", "error-handling", "app-router"],
  },
];

const statusLabels: Record<string, string> = {
  published: "Dipublikasikan",
  draft: "Draft",
  review: "Review",
  approved: "Disetujui",
};

const agentColors: Record<string, string> = {
  "claude-code": "#D4A853",
  cursor: "#A78BFA",
  "codex-cli": "#34D399",
  antigravity: "#06B6D4",
  "gemini-cli": "#6B7885",
};

export default function SkillsPage() {
  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "64px", paddingBottom: "80px", minHeight: "100vh" }}>
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <div className="container-main" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "12px" }}>
              Skill Library
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "16px" }}>
              Temukan AI coding skills tervalidasi untuk semua agent — dibuat, diuji, dan dikurasi.
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: "32px" }}>
          <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
            {/* Sidebar Filter */}
            <aside
              style={{
                width: "240px",
                flexShrink: 0,
                display: "none", // hidden on mobile — shown via @media
              }}
              className="hidden md:block"
            >
              <div
                className="card-surface"
                style={{ padding: "24px", position: "sticky", top: "80px" }}
              >
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "16px",
                  }}
                >
                  Filter
                </h3>

                {/* Agent filter */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "10px" }}>Agent</p>
                  {[
                    { slug: "claude-code", name: "Claude Code" },
                    { slug: "cursor", name: "Cursor" },
                    { slug: "codex-cli", name: "Codex CLI" },
                    { slug: "antigravity", name: "Antigravity" },
                    { slug: "gemini-cli", name: "Gemini CLI" },
                  ].map((agent) => (
                    <label
                      key={agent.slug}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 0",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <input type="checkbox" style={{ accentColor: "var(--color-primary)" }} />
                      {agent.name}
                    </label>
                  ))}
                </div>

                {/* Category filter */}
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", marginBottom: "10px" }}>Kategori</p>
                  {[
                    { slug: "framework-nextjs", name: "Next.js" },
                    { slug: "framework-react", name: "React" },
                    { slug: "ai-integration", name: "AI Integration" },
                    { slug: "security", name: "Security" },
                    { slug: "testing-e2e", name: "E2E Testing" },
                    { slug: "devops-docker", name: "Docker" },
                  ].map((cat) => (
                    <label
                      key={cat.slug}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 0",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      <input type="checkbox" style={{ accentColor: "var(--color-primary)" }} />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Search bar */}
              <div style={{ marginBottom: "24px" }}>
                <input
                  type="search"
                  placeholder="Cari skill... (contoh: nextjs error handling)"
                  id="skill-search"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Results count */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
                  {mockSkills.length} skill ditemukan
                </p>
                <select
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  <option>Terbaru</option>
                  <option>Terpopuler</option>
                  <option>Skor Tertinggi</option>
                </select>
              </div>

              {/* Skill Cards Grid */}
              {mockSkills.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {mockSkills.map((skill) => (
                    <Link
                      key={skill.slug}
                      href={`/skills/${skill.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <BorderGlow borderRadius={16} glowRadius={35} glowColor="187 92 43">
                        <article
                          style={{
                            padding: "24px",
                            cursor: "pointer",
                          }}
                        >
                          {/* Status + Category */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "14px",
                            }}
                          >
                            <span
                              className={`badge-${skill.status}`}
                              style={{
                                padding: "2px 10px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              {statusLabels[skill.status] ?? skill.status}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--color-text-muted)",
                                fontFamily: "JetBrains Mono, monospace",
                              }}
                            >
                              {skill.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h2
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "var(--color-text-primary)",
                              marginBottom: "10px",
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {skill.name}
                          </h2>

                          {/* Description */}
                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--color-text-secondary)",
                              lineHeight: "1.6",
                              marginBottom: "20px",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {skill.description}
                          </p>

                          {/* Scores + Agents */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* Scores */}
                            <div style={{ display: "flex", gap: "12px" }}>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-success)",
                                  fontWeight: "600",
                                }}
                              >
                                Q {skill.qualityScore}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "var(--color-primary)",
                                  fontWeight: "600",
                                }}
                              >
                                S {skill.securityScore}
                              </span>
                            </div>

                            {/* Agent badges */}
                            <div style={{ display: "flex", gap: "4px" }}>
                              {skill.agents.slice(0, 3).map((agent) => (
                                <span
                                  key={agent}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    backgroundColor: `${agentColors[agent] ?? "#6B7885"}20`,
                                    border: `1px solid ${agentColors[agent] ?? "#6B7885"}40`,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "8px",
                                    color: agentColors[agent] ?? "#6B7885",
                                    fontWeight: "700",
                                    fontFamily: "JetBrains Mono, monospace",
                                  }}
                                  title={agent}
                                >
                                  {agent[0].toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </article>
                      </BorderGlow>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div
                  style={{
                    textAlign: "center",
                    padding: "80px 24px",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Belum ada skill
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      marginBottom: "24px",
                    }}
                  >
                    Belum ada skill yang cocok dengan filter ini. Coba ubah kata kunci atau kategori.
                  </p>
                  <Link
                    href="/skills"
                    style={{
                      padding: "10px 24px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--color-primary)",
                      color: "#0A0E12",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Reset Filter Pencarian
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
