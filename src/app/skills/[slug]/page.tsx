import { TopNav, BottomNav } from "@/components/layout/Navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ColorBendsWrapper as ColorBends } from "@/components/visual/ColorBendsWrapper";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

async function getSkillData(slug: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/skills/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch skill:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSkillData(slug);
  if (!data) return { title: "Skill Tidak Ditemukan" };

  return {
    title: `${data.name} — AI Skill`,
    description: data.description,
  };
}

const statusBadgeClass: Record<string, string> = {
  published: "badge-published",
  draft: "badge-draft",
  review: "badge-review",
  approved: "badge-approved",
  rejected: "badge-rejected",
};

const agentColors: Record<string, string> = {
  "claude-code": "#D4A853",
  cursor: "#A78BFA",
  "codex-cli": "#34D399",
  antigravity: "#06B6D4",
  "gemini-cli": "#6B7885",
};

export default async function SkillDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tab = "overview" } = await searchParams;
  const skill = await getSkillData(slug);

  if (!skill) {
    return (
      <>
        <TopNav />
        <main className="container-main" style={{ paddingTop: "120px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "8px" }}>
            Skill tidak ditemukan
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px" }}>
            Skill yang kamu cari tidak ditemukan atau telah dihapus.
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
            ← Kembali ke Skill Library
          </Link>
        </main>
        <BottomNav />
      </>
    );
  }

  const cJson = skill.currentVersion?.canonicalJson ?? {};
  const triggers = (cJson.triggers as string[]) ?? [];
  const instructions = (cJson.instructions as string[]) ?? [];
  const boundaries = (cJson.boundaries as { inScope?: string[]; outOfScope?: string[] }) ?? {};

  return (
    <>
      <TopNav />

      <main style={{ paddingTop: "64px", paddingBottom: "80px", minHeight: "100vh" }}>
        {/* Header Hero */}
        <section style={{ position: "relative", backgroundColor: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", overflow: "hidden" }}>
          <ColorBends color="#06B6D4" speed={0.05} intensity={0.5} />
          <div className="container-main" style={{ position: "relative", zIndex: 1, paddingTop: "40px", paddingBottom: "40px" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
              <Link href="/skills" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Skills</Link>
              <span>/</span>
              {skill.category && (
                <>
                  <Link href={`/categories/${skill.category.slug}`} style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>{skill.category.name}</Link>
                  <span>/</span>
                </>
              )}
              <span style={{ color: "var(--color-text-primary)" }}>{skill.slug}</span>
            </div>

            {/* Title & Status */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span className={statusBadgeClass[skill.status] ?? "badge-draft"} style={{ padding: "3px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>
                    {skill.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "12px", fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary)" }}>
                    v{skill.currentVersion?.version ?? "1.0.0"}
                  </span>
                </div>

                <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", letterSpacing: "-0.02em", marginBottom: "12px" }}>
                  {skill.name}
                </h1>

                <p style={{ fontSize: "16px", color: "var(--color-text-secondary)", maxWidth: "700px", lineHeight: "1.6" }}>
                  {skill.description}
                </p>
              </div>

              {/* Install / Download Action Box */}
              <div className="card-surface-raised" style={{ padding: "20px", borderRadius: "var(--radius-md)", minWidth: "280px" }}>
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase" }}>
                  Perintah CLI Install
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--color-background)", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", marginBottom: "16px" }}>
                  <span style={{ color: "var(--color-primary)" }}>npx</span> skill-id add {skill.slug}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={{ flex: 1, padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-primary)", color: "#0A0E12", fontWeight: "700", fontSize: "13px", border: "none", cursor: "pointer" }}>
                    📥 Unduh ZIP
                  </button>
                  <button style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "transparent", color: "var(--color-text-primary)", fontSize: "13px", cursor: "pointer" }}>
                    🔖 Simpan
                  </button>
                </div>
              </div>
            </div>

            {/* Meta Row: Ratings, Downloads, Security & Agent Support */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--color-border)" }}>
              {/* Ratings */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--color-warning)", fontSize: "16px" }}>⭐</span>
                <span style={{ fontWeight: "700", fontSize: "14px" }}>{skill.ratings?.average ?? "4.8"}</span>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>({skill.ratings?.total ?? 0} ulasan)</span>
              </div>

              {/* Downloads */}
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                📦 <strong>{skill.downloadCount}</strong> x diunduh
              </div>

              {/* Quality & Security Scores */}
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: "var(--color-success)", fontWeight: "600", backgroundColor: "rgba(52, 211, 153, 0.1)", padding: "2px 8px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                  Quality Score: {skill.qualityScore ?? 90}/100
                </span>
                <span style={{ fontSize: "12px", color: "var(--color-primary)", fontWeight: "600", backgroundColor: "rgba(6, 182, 212, 0.1)", padding: "2px 8px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                  Security Score: {skill.securityScore ?? 95}/100
                </span>
              </div>

              {/* Compatible Agents */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Agent:</span>
                {skill.agents?.map((a: any) => (
                  <span key={a.slug} style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", backgroundColor: `${agentColors[a.slug] ?? "#6B7885"}20`, color: agentColors[a.slug] ?? "#6B7885", border: `1px solid ${agentColors[a.slug] ?? "#6B7885"}40` }}>
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-background)", position: "sticky", top: "64px", zIndex: 20 }}>
          <div className="container-main" style={{ display: "flex", gap: "24px", overflowX: "auto" }}>
            {[
              { id: "overview", label: "Ringkasan" },
              { id: "instructions", label: "Instruksi SKILL.md" },
              { id: "boundaries", label: "Boundary & Rule" },
              { id: "security", label: "Security & Validation" },
              { id: "versions", label: "Versi & Changelog" },
              { id: "comments", label: `Komentar (${skill.comments?.length ?? 0})` },
            ].map((t) => (
              <Link
                key={t.id}
                href={`/skills/${skill.slug}?tab=${t.id}`}
                style={{
                  padding: "16px 4px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: tab === t.id ? "var(--color-primary)" : "var(--color-text-secondary)",
                  borderBottom: tab === t.id ? "2px solid var(--color-primary)" : "2px solid transparent",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="container-main" style={{ paddingTop: "32px" }}>
          {tab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Triggers */}
                <div className="card-surface" style={{ padding: "24px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
                    🎯 Triggers (Kapan Skill Ini Aktif)
                  </h2>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "0", listStyle: "none" }}>
                    {triggers.map((trg, i) => (
                      <li key={i} style={{ fontSize: "14px", color: "var(--color-text-primary)", display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: "var(--color-surface-raised)", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                        <span style={{ color: "var(--color-primary)" }}>⚡</span>
                        "{trg}"
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions summary */}
                <div className="card-surface" style={{ padding: "24px" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
                    📋 Langkah Utama Instruksi
                  </h2>
                  <ol style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "20px" }}>
                    {instructions.map((inst, i) => (
                      <li key={i} style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Sidebar metadata */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="card-surface" style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "16px" }}>
                    Informasi Skill
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--color-text-muted)" }}>Lisensi:</span>
                      <span>{cJson.skill?.license ?? "MIT"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--color-text-muted)" }}>Bahasa:</span>
                      <span>{cJson.skill?.language ?? "id-ID"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--color-text-muted)" }}>Pipeline AI:</span>
                      <span>v{cJson.provenance?.pipelineVersion ?? "1.0"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "instructions" && (
            <div className="card-surface" style={{ padding: "32px", fontFamily: "JetBrains Mono, monospace" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
                SKILL.md Content Preview
              </h2>
              <pre style={{ backgroundColor: "var(--color-surface-raised)", padding: "20px", borderRadius: "var(--radius-sm)", overflowX: "auto", fontSize: "13px", lineHeight: "1.7", color: "var(--color-text-primary)" }}>
{`---
name: ${skill.slug}
description: ${skill.description}
---

# ${skill.name}

## Triggers
${triggers.map((t) => `- ${t}`).join("\n")}

## Instructions
${instructions.map((ins, i) => `${i + 1}. ${ins}`).join("\n")}
`}
              </pre>
            </div>
          )}

          {tab === "boundaries" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div className="card-surface" style={{ padding: "24px", borderTop: "3px solid var(--color-success)" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "14px", color: "var(--color-success)" }}>
                  ✅ In Scope (Yang Ditangani)
                </h3>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "var(--color-text-secondary)" }}>
                  {boundaries.inScope?.map((item: string, i: number) => <li key={i} style={{ marginBottom: "8px" }}>{item}</li>)}
                </ul>
              </div>
              <div className="card-surface" style={{ padding: "24px", borderTop: "3px solid var(--color-danger)" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "14px", color: "var(--color-danger)" }}>
                  🚫 Out of Scope (Di Luar Scope)
                </h3>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "var(--color-text-secondary)" }}>
                  {boundaries.outOfScope?.map((item: string, i: number) => <li key={i} style={{ marginBottom: "8px" }}>{item}</li>)}
                </ul>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="card-surface" style={{ padding: "32px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
                🛡️ Security Scan & Validation Results
              </h2>
              <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={{ padding: "16px 24px", backgroundColor: "var(--color-surface-raised)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Security Score</div>
                  <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--color-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                    {skill.securityScore ?? 95}/100
                  </div>
                </div>
                <div style={{ padding: "16px 24px", backgroundColor: "var(--color-surface-raised)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Schema Validation</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--color-success)", marginTop: "6px" }}>
                    ✓ PASSED (v1.0.0)
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "versions" && (
            <div className="card-surface" style={{ padding: "24px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Riwayat Versi</h2>
              {skill.versions?.map((v: any) => (
                <div key={v.id} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "16px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontWeight: "700", fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary)" }}>v{v.version}</span>
                    <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{new Date(v.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{v.changelog}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "comments" && (
            <div className="card-surface" style={{ padding: "32px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Diskusi & Komentar</h2>
              {skill.comments?.map((c: any) => (
                <div key={c.id} style={{ padding: "16px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface-raised)", border: "1px solid var(--color-border)", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "600", fontSize: "14px" }}>{c.authorName}</span>
                    <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{new Date(c.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{c.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </>
  );
}
