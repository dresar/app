import { TopNav, BottomNav } from "@/components/layout/Navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap Publik",
  description: "Rencana pengembangan AI Skill Factory Indonesia — 11 fase dari project setup hingga deployment production.",
};

const phases = [
  {
    num: 0,
    name: "Project Setup",
    status: "selesai",
    items: ["Init Next.js 15 + TypeScript + Tailwind CSS v4", "Drizzle ORM + Neon PostgreSQL", "33 tabel database", "Seed data: 16 kategori, 5 agent, 22 prompt template", "shadcn/ui + design system", ".env.example + file open-source"],
  },
  {
    num: 1,
    name: "Design System + Public Shell",
    status: "selesai",
    items: ["Design tokens (warna, tipografi, spacing, radius)", "Komponen dasar (Button, Card, Badge, Tabs)", "Top nav desktop + bottom nav mobile", "Halaman beranda, about, roadmap, changelog"],
  },
  {
    num: 2,
    name: "Skill Library + Detail",
    status: "rencana",
    items: ["Halaman /skills dengan filter & search", "Halaman /skills/[slug] dengan tab detail", "MockSkillRepository + ApiSkillRepository", "Halaman /categories, /search"],
  },
  {
    num: 3,
    name: "Admin Shell",
    status: "partial",
    items: ["Layout /admin + sidebar nav", "Admin dashboard dengan stats", "Tabel admin + card list (mobile)"],
  },
  {
    num: 4,
    name: "Database + Auth",
    status: "partial",
    items: ["✅ Neon + Drizzle migrasi selesai", "✅ Seed data awal", "⬜ Auth.js email/password + Google + GitHub", "⬜ RBAC (user, moderator, admin, superadmin)"],
  },
  {
    num: 5,
    name: "Generation UI",
    status: "rencana",
    items: ["/generate/* form wizard", "Generation Timeline UI", "Polling status job", "ApiGenerationRepository"],
  },
  {
    num: 6,
    name: "AI Orchestrator",
    status: "rencana",
    items: ["AiOrchestratorService + Vercel AI SDK", "ai_providers CRUD di admin", "Fallback chain (Claude → Gemini → OpenAI)"],
  },
  {
    num: 7,
    name: "Canonical JSON + Compiler",
    status: "rencana",
    items: ["Schema penuh (skill/prd/workflow/agent-kit)", "ValidationService + Zod schema", "CompilerService (SKILL.md, README, AGENTS, ZIP)"],
  },
  {
    num: 8,
    name: "Security + Quality",
    status: "rencana",
    items: ["SecurityScanService (20+ kategori risiko)", "QualityEvalService (rubric 12 dimensi)", "Integrasi ke pipeline generation"],
  },
  {
    num: 9,
    name: "Comments + Ratings + Collections",
    status: "rencana",
    items: ["CommentService + RatingService", "CollectionService + BookmarkService", "Moderasi admin + anti-abuse"],
  },
  {
    num: 10,
    name: "Testing + Deployment",
    status: "rencana",
    items: ["Unit + Integration + E2E test suite", "CI/CD (lint, typecheck, test, deploy)", "Deploy production Vercel + Neon branch main"],
  },
];

const statusColor: Record<string, string> = {
  selesai: "var(--color-success)",
  partial: "var(--color-warning)",
  rencana: "var(--color-text-muted)",
};

const statusLabel: Record<string, string> = {
  selesai: "Selesai",
  partial: "Sebagian",
  rencana: "Direncanakan",
};

export default function RoadmapPage() {
  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "64px", paddingBottom: "80px", minHeight: "100vh" }}>
        <div className="container-main" style={{ paddingTop: "64px", maxWidth: "780px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "8px" }}>
            Roadmap Publik
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "48px" }}>
            11 fase implementasi AI Skill Factory Indonesia — dari setup hingga production.
          </p>

          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: "20px",
                top: "0",
                bottom: "0",
                width: "2px",
                backgroundColor: "var(--color-border)",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {phases.map((phase) => (
                <div
                  key={phase.num}
                  style={{
                    display: "flex",
                    gap: "24px",
                    paddingBottom: "32px",
                  }}
                >
                  {/* Circle */}
                  <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        backgroundColor: phase.status === "selesai"
                          ? "rgba(52, 211, 153, 0.15)"
                          : phase.status === "partial"
                          ? "rgba(251, 191, 36, 0.15)"
                          : "var(--color-surface)",
                        border: `2px solid ${statusColor[phase.status]}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "13px",
                        fontFamily: "JetBrains Mono, monospace",
                        color: statusColor[phase.status],
                      }}
                    >
                      {phase.num}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <h2 style={{ fontSize: "16px", fontWeight: "700" }}>
                        Phase {phase.num} — {phase.name}
                      </h2>
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: "600",
                          backgroundColor: `${statusColor[phase.status]}20`,
                          color: statusColor[phase.status],
                          border: `1px solid ${statusColor[phase.status]}40`,
                        }}
                      >
                        {statusLabel[phase.status]}
                      </span>
                    </div>
                    <ul
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        paddingLeft: "0",
                        listStyle: "none",
                      }}
                    >
                      {phase.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            fontSize: "13px",
                            color: "var(--color-text-secondary)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                          }}
                        >
                          <span style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "1px" }}>–</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
