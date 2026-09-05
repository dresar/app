#!/usr/bin/env tsx
// scripts/seed-dummy.ts
// Data dummy LENGKAP untuk AI Skill Factory Indonesia
// Jalankan: npm run db:seed-dummy
//
// 🔑 Admin login: admin@skillid.dev / Admin123!

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Simple password hash untuk demo (pakai argon2/bcrypt di production)
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(password + salt).digest("hex");
  return `sha256$${salt}$${hash}`;
}

function randomDate(daysBack: number): Date {
  return new Date(Date.now() - Math.floor(Math.random() * daysBack) * 24 * 60 * 60 * 1000);
}

async function seedDummy() {
  console.log("🌱 Starting dummy data seed...\n");

  // ─── 1. USERS ───────────────────────────────────────────────────────────────
  console.log("👤 Seeding users...");

  const usersData = [
    { email: "admin@skillid.dev",        password: "Admin123!",        name: "Admin Utama",         role: "admin" as const },
    { email: "superadmin@skillid.dev",   password: "SuperAdmin123!",   name: "Super Administrator", role: "superadmin" as const },
    { email: "moderator@skillid.dev",    password: "Moderator123!",    name: "Moderator Konten",    role: "moderator" as const },
    { email: "dimas@developer.id",       password: "User123!",         name: "Dimas Pratama",       role: "user" as const },
    { email: "sarah@startup.id",         password: "User123!",         name: "Sarah Anggraini",     role: "user" as const },
    { email: "budi@founder.id",          password: "User123!",         name: "Budi Santoso",        role: "user" as const },
    { email: "rani@devrel.id",           password: "User123!",         name: "Rani Maharani",       role: "user" as const },
  ];

  const userMap: Record<string, string> = {};

  for (const u of usersData) {
    const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, u.email)).limit(1);
    let uid: string;
    if (existing.length > 0) {
      uid = existing[0].id;
      console.log(`  ↩ User ${u.email} sudah ada`);
    } else {
      const [inserted] = await db.insert(schema.users).values({
        email: u.email,
        passwordHash: hashPassword(u.password),
        name: u.name,
        avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.name)}`,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning({ id: schema.users.id });
      uid = inserted.id;

      await db.insert(schema.userRoles).values({ userId: uid, role: u.role, createdAt: new Date() }).onConflictDoNothing();
      console.log(`  ✅ ${u.email} (${u.role})`);
    }
    userMap[u.email] = uid;
  }

  const adminId     = userMap["admin@skillid.dev"];
  const sarahId     = userMap["sarah@startup.id"];
  const dimasId     = userMap["dimas@developer.id"];
  const budiId      = userMap["budi@founder.id"];
  const raniId      = userMap["rani@devrel.id"];
  const modId       = userMap["moderator@skillid.dev"];

  // ─── 2. Ambil map categories, agents, tags ──────────────────────────────────
  const catRows = await db.select({ id: schema.categories.id, slug: schema.categories.slug }).from(schema.categories);
  const catMap: Record<string, string> = Object.fromEntries(catRows.map(c => [c.slug, c.id]));

  const agentRows = await db.select({ id: schema.agents.id, slug: schema.agents.slug }).from(schema.agents);
  const agentMap: Record<string, string> = Object.fromEntries(agentRows.map(a => [a.slug, a.id]));

  const tagRows = await db.select({ id: schema.tags.id, slug: schema.tags.slug }).from(schema.tags);
  const tagMap: Record<string, string> = Object.fromEntries(tagRows.map(t => [t.slug, t.id]));

  // ─── 3. SKILLS ──────────────────────────────────────────────────────────────
  console.log("\n📦 Seeding skills...");

  type SkillStatus = "draft" | "generating" | "review" | "approved" | "published" | "archived" | "rejected";

  const skillsData: {
    slug: string; name: string; description: string; categorySlug: string;
    status: SkillStatus; ownerId: string | null; qualityScore: number | null;
    securityScore: number | null; downloadCount: number; version: string;
    agents: string[]; tags: string[]; canonicalJson: Record<string, unknown>;
  }[] = [
    {
      slug: "nextjs-error-boundary-setup",
      name: "Next.js Error Boundary Setup",
      description: "Gunakan skill ini saat perlu menyiapkan error boundary dan halaman error kustom di aplikasi Next.js App Router.",
      categorySlug: "framework-nextjs",
      status: "published",
      ownerId: null,
      qualityScore: 88,
      securityScore: 96,
      downloadCount: 247,
      version: "1.2.0",
      agents: ["claude-code", "cursor", "antigravity", "codex-cli"],
      tags: ["nextjs", "app-router", "error-handling"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "nextjs-error-boundary-setup", version: "1.2.0", language: "id-ID", license: "MIT", category: "framework-nextjs" },
        triggers: ["Pengguna menyebut error.tsx", "Menangani unhandled exception di Next.js"],
        instructions: ["Identifikasi apakah proyek memakai App Router", "Buat error.tsx dengan 'use client'", "Sertakan reset button"],
        boundaries: { inScope: ["error.tsx", "global-error.tsx"], outOfScope: ["Sentry full setup"] },
        security: { scanStatus: "pemeriksaan-otomatis", score: 96, findings: [] },
        quality: { score: 88 },
        provenance: { generatedBy: { provider: "anthropic", model: "claude-sonnet-4-6" }, pipelineVersion: "1.0" },
      },
    },
    {
      slug: "typescript-strict-config",
      name: "TypeScript Strict Config Setup",
      description: "Gunakan skill ini untuk mengonfigurasi TypeScript secara ketat di proyek baru atau yang sudah ada.",
      categorySlug: "framework-react",
      status: "published",
      ownerId: null,
      qualityScore: 92,
      securityScore: 98,
      downloadCount: 183,
      version: "1.0.0",
      agents: ["claude-code", "cursor", "codex-cli", "antigravity", "gemini-cli"],
      tags: ["typescript"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "typescript-strict-config", version: "1.0.0", language: "id-ID", license: "MIT" },
        triggers: ["Pengguna setup TypeScript baru", "Enable strict mode"],
        instructions: ["Periksa tsconfig.json", "Aktifkan strict: true", "Perbaiki error secara bertahap"],
        boundaries: { inScope: ["tsconfig.json"], outOfScope: ["Runtime validation"] },
        security: { scanStatus: "pemeriksaan-otomatis", score: 98, findings: [] },
        quality: { score: 92 },
        provenance: { generatedBy: { provider: "anthropic", model: "claude-sonnet-4-6" }, pipelineVersion: "1.0" },
      },
    },
    {
      slug: "playwright-e2e-setup",
      name: "Playwright E2E Testing Setup",
      description: "Aktifkan skill ini saat pengguna menyebutkan Playwright atau perlu setup E2E testing dari awal.",
      categorySlug: "testing-e2e",
      status: "published",
      ownerId: adminId,
      qualityScore: 85,
      securityScore: 94,
      downloadCount: 312,
      version: "2.0.0",
      agents: ["claude-code", "cursor", "antigravity"],
      tags: ["playwright", "typescript"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "playwright-e2e-setup", version: "2.0.0", language: "id-ID", license: "MIT" },
        triggers: ["Pengguna menyebut Playwright", "Butuh E2E testing"],
        instructions: ["Install @playwright/test", "Buat playwright.config.ts", "Tulis test pertama"],
        boundaries: { inScope: ["Playwright config", "Test structure"], outOfScope: ["CI/CD integration"] },
        security: { scanStatus: "pemeriksaan-otomatis", score: 94, findings: [] },
        quality: { score: 85 },
        provenance: { generatedBy: { provider: "anthropic", model: "claude-sonnet-4-6" }, pipelineVersion: "1.0" },
      },
    },
    {
      slug: "drizzle-orm-postgresql-setup",
      name: "Drizzle ORM + PostgreSQL Setup",
      description: "Aktifkan saat pengguna ingin setup Drizzle ORM dengan PostgreSQL (Neon, Supabase, atau self-hosted).",
      categorySlug: "database-postgresql",
      status: "published",
      ownerId: null,
      qualityScore: 91,
      securityScore: 95,
      downloadCount: 528,
      version: "1.1.0",
      agents: ["claude-code", "cursor", "codex-cli", "antigravity"],
      tags: ["drizzle", "typescript", "nodejs"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "drizzle-orm-postgresql-setup", version: "1.1.0", language: "id-ID", license: "MIT" },
        triggers: ["Pengguna menyebut Drizzle", "Setup database PostgreSQL"],
        instructions: ["Install drizzle-orm", "Buat schema file", "Konfigurasi drizzle.config.ts", "Jalankan migrasi"],
        boundaries: { inScope: ["Schema", "Migrations", "Basic queries"], outOfScope: ["Complex optimization"] },
        security: { scanStatus: "pemeriksaan-otomatis", score: 95, findings: [] },
        quality: { score: 91 },
        provenance: { generatedBy: { provider: "anthropic", model: "claude-sonnet-4-6" }, pipelineVersion: "1.0" },
      },
    },
    {
      slug: "docker-compose-dev-setup",
      name: "Docker Compose Development Setup",
      description: "Gunakan skill ini saat perlu membuat docker-compose.yml untuk environment development lokal.",
      categorySlug: "devops-docker",
      status: "published",
      ownerId: null,
      qualityScore: 87,
      securityScore: 88,
      downloadCount: 194,
      version: "1.0.0",
      agents: ["claude-code", "cursor", "antigravity"],
      tags: ["typescript", "nodejs"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "docker-compose-dev-setup", version: "1.0.0", language: "id-ID", license: "MIT" },
        triggers: ["Perlu Docker Compose", "Containerize untuk dev"],
        instructions: ["Buat docker-compose.yml", "Definisikan service", "Tambahkan volume"],
        boundaries: { inScope: ["docker-compose.yml", "Development"], outOfScope: ["Production Kubernetes"] },
        security: { scanStatus: "pemeriksaan-otomatis", score: 88, findings: [{ category: "shell-exposure", severity: "low", detail: "Volume mount permission" }] },
        quality: { score: 87 },
        provenance: { generatedBy: { provider: "anthropic", model: "claude-sonnet-4-6" }, pipelineVersion: "1.0" },
      },
    },
    {
      slug: "vercel-ai-sdk-chat-setup",
      name: "Vercel AI SDK Chat Integration",
      description: "Aktifkan saat pengguna ingin mengintegrasikan AI chat ke aplikasi Next.js menggunakan Vercel AI SDK.",
      categorySlug: "ai-integration",
      status: "review",
      ownerId: sarahId,
      qualityScore: 79,
      securityScore: 90,
      downloadCount: 0,
      version: "0.9.0",
      agents: ["claude-code", "cursor", "antigravity"],
      tags: ["api", "typescript", "nodejs"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "vercel-ai-sdk-chat-setup", version: "0.9.0", language: "id-ID", license: "MIT" },
        triggers: ["Pengguna ingin AI chat", "Menyebut Vercel AI SDK"],
        instructions: ["Install 'ai' package", "Buat route handler /api/chat", "Implement useChat hook"],
        boundaries: { inScope: ["Route handler", "useChat"], outOfScope: ["Multi-agent orchestration"] },
        security: { scanStatus: "pemeriksaan-otomatis", score: 90, findings: [] },
        quality: { score: 79 },
        provenance: { generatedBy: { provider: "google", model: "gemini-2.0-flash" }, pipelineVersion: "1.0" },
      },
    },
    {
      slug: "auth-nextjs-credentials",
      name: "Auth.js Credentials Provider Setup",
      description: "Gunakan skill ini untuk setup autentikasi email/password dengan Auth.js (NextAuth v5) di Next.js.",
      categorySlug: "security",
      status: "draft",
      ownerId: dimasId,
      qualityScore: null,
      securityScore: null,
      downloadCount: 0,
      version: "0.1.0",
      agents: ["claude-code"],
      tags: ["authentication", "typescript", "nodejs"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "auth-nextjs-credentials", version: "0.1.0", language: "id-ID", license: "MIT" },
        triggers: ["Pengguna menyebut NextAuth", "Perlu autentikasi email/password"],
        instructions: ["Install next-auth@beta", "Buat auth.ts", "Setup API route", "Tambahkan middleware"],
        boundaries: { inScope: ["Credentials provider", "Session"], outOfScope: ["OAuth (skill terpisah)"] },
        security: { scanStatus: "belum-dipindai", score: null, findings: [] },
        quality: { score: null },
        provenance: { generatedBy: null, pipelineVersion: "1.0" },
      },
    },
    {
      slug: "github-actions-nextjs-ci",
      name: "GitHub Actions CI/CD untuk Next.js",
      description: "Aktifkan untuk membuat GitHub Actions workflow: lint, typecheck, test, build, dan deploy ke Vercel.",
      categorySlug: "devops-ci-cd",
      status: "approved",
      ownerId: null,
      qualityScore: 90,
      securityScore: 92,
      downloadCount: 89,
      version: "1.0.0",
      agents: ["claude-code", "cursor", "codex-cli", "antigravity"],
      tags: ["typescript", "vercel"],
      canonicalJson: {
        schemaVersion: "1.0.0", artifactType: "skill",
        skill: { name: "github-actions-nextjs-ci", version: "1.0.0", language: "id-ID", license: "MIT" },
        triggers: ["Perlu CI/CD", "GitHub Actions", "Deploy ke Vercel"],
        instructions: ["Buat .github/workflows/ci.yml", "Definisikan jobs: lint, test, build", "Deploy ke Vercel"],
        boundaries: { inScope: ["GitHub Actions", "Vercel deploy"], outOfScope: ["AWS/GCP deploy"] },
        security: { scanStatus: "pemeriksaan-otomatis", score: 92, findings: [] },
        quality: { score: 90 },
        provenance: { generatedBy: { provider: "anthropic", model: "claude-sonnet-4-6" }, pipelineVersion: "1.0" },
      },
    },
  ];

  const skillMap: Record<string, string> = {};

  for (const sd of skillsData) {
    const existing = await db.select({ id: schema.skills.id }).from(schema.skills).where(eq(schema.skills.slug, sd.slug)).limit(1);
    if (existing.length > 0) {
      skillMap[sd.slug] = existing[0].id;
      console.log(`  ↩ Skill '${sd.slug}' sudah ada`);
      continue;
    }

    // 1. Buat skill dulu TANPA currentVersionId
    const [skill] = await db.insert(schema.skills).values({
      slug: sd.slug,
      name: sd.name,
      description: sd.description,
      categoryId: catMap[sd.categorySlug] ?? null,
      currentVersionId: null, // akan diupdate setelah version dibuat
      status: sd.status,
      ownerId: sd.ownerId,
      qualityScore: sd.qualityScore,
      securityScore: sd.securityScore,
      downloadCount: sd.downloadCount,
      createdAt: randomDate(60),
      updatedAt: new Date(),
    }).returning({ id: schema.skills.id });

    // 2. Buat version dengan skillId yang benar
    const [sv] = await db.insert(schema.skillVersions).values({
      skillId: skill.id,
      version: sd.version,
      canonicalJson: sd.canonicalJson,
      changelog: `Versi ${sd.version} — rilis awal.`,
      publishedAt: sd.status === "published" ? randomDate(30) : null,
      createdAt: new Date(),
    }).returning({ id: schema.skillVersions.id });

    // 3. Update skill dengan currentVersionId
    await db.update(schema.skills).set({ currentVersionId: sv.id }).where(eq(schema.skills.id, skill.id));

    skillMap[sd.slug] = skill.id;

    // 4. Assign agents
    for (const agentSlug of sd.agents) {
      const agentId = agentMap[agentSlug];
      if (agentId) {
        await db.insert(schema.skillAgents).values({ skillId: skill.id, agentId, compatibilityStatus: "verified" }).onConflictDoNothing();
      }
    }

    // 5. Assign tags
    for (const tagSlug of sd.tags) {
      const tagId = tagMap[tagSlug];
      if (tagId) {
        await db.insert(schema.skillTags).values({ skillId: skill.id, tagId }).onConflictDoNothing();
      }
    }

    console.log(`  ✅ ${sd.slug} (${sd.status})`);
  }

  // ─── 4. PRDs ────────────────────────────────────────────────────────────────
  console.log("\n📋 Seeding PRDs...");

  type ContentStatus = "draft" | "generating" | "review" | "approved" | "published" | "archived" | "rejected";

  const prdsData: {
    slug: string; name: string; description: string; status: ContentStatus;
    ownerId: string | null; downloadCount: number; canonicalJson: Record<string, unknown>;
  }[] = [
    {
      slug: "prd-ai-skill-factory-v1",
      name: "PRD: AI Skill Factory Indonesia v1.0",
      description: "PRD lengkap platform AI Skill Factory Indonesia — MVP: Skill Library, Generator, Admin, Auth, Search.",
      status: "published", ownerId: null, downloadCount: 48,
      canonicalJson: { schemaVersion: "1.0.0", artifactType: "prd", title: "AI Skill Factory Indonesia PRD", sections: [
        { title: "Executive Summary", content: "Platform open-source AI coding skills berbahasa Indonesia." },
        { title: "Problem Statement", content: "Fragmentasi skill, tidak ada standar kualitas, barrier bahasa." },
        { title: "MVP Features", content: "Skill Library, Generator, Admin, Auth, Search, CLI." },
      ]},
    },
    {
      slug: "prd-saas-starter-nextjs",
      name: "PRD: SaaS Starter dengan Next.js",
      description: "PRD untuk SaaS starter kit: Next.js 15, Drizzle, Neon, Auth.js, Stripe.",
      status: "published", ownerId: adminId, downloadCount: 31,
      canonicalJson: { schemaVersion: "1.0.0", artifactType: "prd", title: "SaaS Starter Next.js", sections: [
        { title: "Stack", content: "Next.js 15 + TypeScript + Drizzle + Neon + Auth.js + Stripe" },
      ]},
    },
    {
      slug: "prd-ecommerce-headless",
      name: "PRD: Headless E-Commerce Indonesia",
      description: "PRD e-commerce headless dengan payment gateway lokal (QRIS, GoPay, Midtrans).",
      status: "draft", ownerId: null, downloadCount: 0,
      canonicalJson: { schemaVersion: "1.0.0", artifactType: "prd", title: "Headless E-Commerce ID", sections: [
        { title: "Payment", content: "Midtrans, Xendit, DOKU" },
      ]},
    },
  ];

  const prdMap: Record<string, string> = {};
  for (const pd of prdsData) {
    const existing = await db.select({ id: schema.prds.id }).from(schema.prds).where(eq(schema.prds.slug, pd.slug)).limit(1);
    if (existing.length > 0) { prdMap[pd.slug] = existing[0].id; console.log(`  ↩ PRD '${pd.slug}' sudah ada`); continue; }

    const [prd] = await db.insert(schema.prds).values({
      slug: pd.slug, name: pd.name, description: pd.description, status: pd.status,
      ownerId: pd.ownerId, currentVersionId: null, downloadCount: pd.downloadCount,
      createdAt: randomDate(45), updatedAt: new Date(),
    }).returning({ id: schema.prds.id });

    const [pv] = await db.insert(schema.prdVersions).values({
      prdId: prd.id, version: "1.0.0", canonicalJson: pd.canonicalJson, changelog: "Rilis pertama.",
      publishedAt: pd.status === "published" ? new Date() : null, createdAt: new Date(),
    }).returning({ id: schema.prdVersions.id });

    await db.update(schema.prds).set({ currentVersionId: pv.id }).where(eq(schema.prds.id, prd.id));
    prdMap[pd.slug] = prd.id;
    console.log(`  ✅ PRD: ${pd.slug}`);
  }

  // ─── 5. WORKFLOWS ───────────────────────────────────────────────────────────
  console.log("\n🔄 Seeding workflows...");

  const workflowsData: { slug: string; name: string; description: string; status: ContentStatus; }[] = [
    { slug: "workflow-nextjs-feature-dev", name: "Feature Development Next.js", description: "Workflow standar: plan → branch → implement → test → PR → merge.", status: "published" },
    { slug: "workflow-code-review-ai", name: "AI-Assisted Code Review", description: "Review kode dengan AI: security, performance, accessibility, maintainability.", status: "published" },
    { slug: "workflow-deploy-vercel-neon", name: "Deploy ke Vercel + Neon", description: "Deployment production: migration check, env setup, preview, production deploy.", status: "draft" },
  ];

  for (const wd of workflowsData) {
    const existing = await db.select({ id: schema.workflows.id }).from(schema.workflows).where(eq(schema.workflows.slug, wd.slug)).limit(1);
    if (existing.length > 0) { console.log(`  ↩ Workflow '${wd.slug}' sudah ada`); continue; }

    const [wf] = await db.insert(schema.workflows).values({
      slug: wd.slug, name: wd.name, description: wd.description, status: wd.status,
      currentVersionId: null, downloadCount: Math.floor(Math.random() * 50),
      createdAt: randomDate(30), updatedAt: new Date(),
    }).returning({ id: schema.workflows.id });

    const [wv] = await db.insert(schema.workflowVersions).values({
      workflowId: wf.id, version: "1.0.0",
      canonicalJson: { schemaVersion: "1.0.0", artifactType: "workflow", name: wd.name, steps: [] },
      publishedAt: wd.status === "published" ? new Date() : null, createdAt: new Date(),
    }).returning({ id: schema.workflowVersions.id });

    await db.update(schema.workflows).set({ currentVersionId: wv.id }).where(eq(schema.workflows.id, wf.id));
    console.log(`  ✅ Workflow: ${wd.slug}`);
  }

  // ─── 6. AGENT KITS ──────────────────────────────────────────────────────────
  console.log("\n🚀 Seeding agent kits...");

  const agentKitsData: { slug: string; name: string; description: string; status: ContentStatus; }[] = [
    { slug: "kit-nextjs-fullstack-starter", name: "Next.js Full-Stack Starter Kit", description: "Kit lengkap: Next.js 15, Drizzle, Neon, Auth.js, Vercel Blob, Tailwind CSS.", status: "published" },
    { slug: "kit-laravel-vue-inertia", name: "Laravel + Vue + Inertia.js Kit", description: "Laravel API + Vue 3 + Inertia.js, Sanctum auth, PostgreSQL, Railway deploy.", status: "draft" },
  ];

  for (const kd of agentKitsData) {
    const existing = await db.select({ id: schema.agentKits.id }).from(schema.agentKits).where(eq(schema.agentKits.slug, kd.slug)).limit(1);
    if (existing.length > 0) { console.log(`  ↩ Agent Kit '${kd.slug}' sudah ada`); continue; }

    const [ak] = await db.insert(schema.agentKits).values({
      slug: kd.slug, name: kd.name, description: kd.description, status: kd.status,
      currentVersionId: null, downloadCount: Math.floor(Math.random() * 80),
      createdAt: randomDate(20), updatedAt: new Date(),
    }).returning({ id: schema.agentKits.id });

    const [akv] = await db.insert(schema.agentKitVersions).values({
      agentKitId: ak.id, version: "1.0.0",
      canonicalJson: { schemaVersion: "1.0.0", artifactType: "agentKit", name: kd.name, stack: {} },
      publishedAt: kd.status === "published" ? new Date() : null, createdAt: new Date(),
    }).returning({ id: schema.agentKitVersions.id });

    await db.update(schema.agentKits).set({ currentVersionId: akv.id }).where(eq(schema.agentKits.id, ak.id));
    console.log(`  ✅ Agent Kit: ${kd.slug}`);
  }

  // ─── 7. COMMENTS + REACTIONS ────────────────────────────────────────────────
  console.log("\n💬 Seeding comments...");

  const s1 = skillMap["nextjs-error-boundary-setup"];
  const s2 = skillMap["drizzle-orm-postgresql-setup"];
  const s3 = skillMap["playwright-e2e-setup"];

  type CommentStatus = "visible" | "hidden" | "pinned";
  const commentsData = [
    { authorId: dimasId, targetId: s1, body: "Skill ini sangat membantu! Langsung bisa setup error boundary di Next.js dalam 5 menit. Terima kasih! 🙏", status: "visible" as const },
    { authorId: sarahId, targetId: s1, body: "Ada yang bisa bantu? Saya dapat error 'error.tsx must be a Client Component'. Cara debug-nya gimana?", status: "visible" as const },
    { authorId: adminId, targetId: s1, body: "Hai Sarah! Pastikan 'use client' ada di baris PERTAMA, sebelum import manapun. Sering ini jadi penyebabnya.", status: "pinned" as const },
    { authorId: budiId, targetId: s2, body: "Skill terbaik untuk Drizzle! Sudah coba 3 tutorial berbeda — ini yang paling komprehensif dan up-to-date.", status: "visible" as const },
    { authorId: raniId, targetId: s2, body: "Request: bisa tambahkan contoh untuk upsert pattern? Saya sering butuh insert-or-update.", status: "visible" as const },
    { authorId: dimasId, targetId: s3, body: "Playwright setup paling mudah yang pernah saya ikuti. Langsung jalan di GitHub Actions!", status: "visible" as const },
  ].filter(c => c.targetId); // filter jika targetId undefined

  const commentIds: string[] = [];
  for (const cd of commentsData) {
    const [comment] = await db.insert(schema.comments).values({
      authorId: cd.authorId, targetType: "skill", targetId: cd.targetId,
      body: cd.body, status: cd.status,
      createdAt: randomDate(7), updatedAt: new Date(),
    }).returning({ id: schema.comments.id });
    commentIds.push(comment.id);
  }
  console.log(`  ✅ ${commentsData.length} comments`);

  // Reactions
  for (const cid of commentIds.slice(0, 4)) {
    for (const uid of [dimasId, sarahId, budiId]) {
      await db.insert(schema.commentReactions).values({ commentId: cid, userId: uid, type: "upvote", createdAt: new Date() }).onConflictDoNothing();
    }
  }
  console.log("  ✅ Comment reactions");

  // ─── 8. RATINGS ─────────────────────────────────────────────────────────────
  console.log("\n⭐ Seeding ratings...");

  const ratingsData = [
    { userId: dimasId, targetId: s1, score: 5 }, { userId: sarahId, targetId: s1, score: 4 },
    { userId: budiId, targetId: s1, score: 5 },  { userId: raniId, targetId: s1, score: 4 },
    { userId: dimasId, targetId: s2, score: 5 }, { userId: sarahId, targetId: s2, score: 5 },
    { userId: budiId, targetId: s3, score: 4 },  { userId: raniId, targetId: s3, score: 5 },
  ].filter(r => r.targetId);

  for (const rd of ratingsData) {
    await db.insert(schema.ratings).values({
      userId: rd.userId, targetType: "skill", targetId: rd.targetId,
      score: rd.score as any, createdAt: new Date(), updatedAt: new Date(),
    }).onConflictDoNothing();
  }
  console.log(`  ✅ ${ratingsData.length} ratings`);

  // ─── 9. COLLECTIONS ─────────────────────────────────────────────────────────
  console.log("\n📚 Seeding collections...");

  type CollectionVisibility = "private" | "public";
  const collectionsData: {
    ownerId: string; name: string; description: string;
    visibility: CollectionVisibility; isOfficial: boolean; items: string[];
  }[] = [
    {
      ownerId: adminId, name: "Starter Kit Wajib", visibility: "public", isOfficial: true,
      description: "Skill esensial untuk memulai proyek Next.js baru",
      items: ["nextjs-error-boundary-setup", "typescript-strict-config", "drizzle-orm-postgresql-setup"],
    },
    {
      ownerId: adminId, name: "Testing Terbaik 2026", visibility: "public", isOfficial: true,
      description: "Skill untuk testing komprehensif",
      items: ["playwright-e2e-setup"],
    },
    {
      ownerId: dimasId, name: "Favorit Saya", visibility: "private", isOfficial: false,
      description: "Skill yang sering saya pakai",
      items: ["nextjs-error-boundary-setup", "drizzle-orm-postgresql-setup"],
    },
    {
      ownerId: sarahId, name: "Stack Startup Kami", visibility: "public", isOfficial: false,
      description: "Skill untuk tim startup Sarah",
      items: ["drizzle-orm-postgresql-setup", "github-actions-nextjs-ci"],
    },
  ];

  for (const col of collectionsData) {
    const [coll] = await db.insert(schema.collections).values({
      ownerId: col.ownerId, name: col.name, description: col.description,
      visibility: col.visibility, isOfficial: col.isOfficial,
      createdAt: new Date(), updatedAt: new Date(),
    }).returning({ id: schema.collections.id });

    let pos = 0;
    for (const slug of col.items) {
      const sid = skillMap[slug];
      if (sid) {
        await db.insert(schema.collectionItems).values({
          collectionId: coll.id, targetType: "skill", targetId: sid,
          position: pos++, createdAt: new Date(),
        }).onConflictDoNothing();
      }
    }
    console.log(`  ✅ "${col.name}"`);
  }

  // ─── 10. AI PROVIDERS ───────────────────────────────────────────────────────
  console.log("\n🤖 Seeding AI providers...");

  type AIProvider = "anthropic" | "google" | "openai" | "groq" | "openai-compatible";
  const providersData: {
    provider: AIProvider; model: string; apiKeySecretRef: string;
    active: boolean; priority: number; timeoutMs: number; maxTokens: number; displayName: string;
  }[] = [
    { provider: "anthropic", model: "claude-sonnet-4-6", apiKeySecretRef: "ANTHROPIC_API_KEY", active: true, priority: 1, timeoutMs: 30000, maxTokens: 8192, displayName: "Claude Sonnet 4.6 (Primary)" },
    { provider: "google", model: "gemini-2.0-flash", apiKeySecretRef: "GOOGLE_GENERATIVE_AI_API_KEY", active: true, priority: 2, timeoutMs: 25000, maxTokens: 8192, displayName: "Gemini 2.0 Flash (Fallback #1)" },
    { provider: "openai", model: "gpt-4o", apiKeySecretRef: "OPENAI_API_KEY", active: false, priority: 3, timeoutMs: 40000, maxTokens: 8192, displayName: "GPT-4o (Fallback #2, disabled)" },
    { provider: "groq", model: "llama-3.3-70b-versatile", apiKeySecretRef: "GROQ_API_KEY", active: true, priority: 4, timeoutMs: 15000, maxTokens: 4096, displayName: "Groq Llama 3.3 (Fast fallback)" },
  ];

  for (const p of providersData) {
    await db.insert(schema.aiProviders).values({ ...p, createdAt: new Date(), updatedAt: new Date() }).onConflictDoNothing();
    console.log(`  ✅ ${p.displayName}`);
  }

  // ─── 11. GENERATIONS + STEPS ────────────────────────────────────────────────
  console.log("\n✨ Seeding generations...");

  type GenerationStatus = "queued" | "running" | "succeeded" | "failed";
  const gensData: {
    targetType: string; requesterId: string;
    inputJson: Record<string, unknown>; status: GenerationStatus;
  }[] = [
    { targetType: "skill", requesterId: adminId, status: "succeeded", inputJson: { name: "nextjs-error-boundary-setup", goal: "Setup error boundary Next.js", agentTarget: ["claude-code", "cursor"] } },
    { targetType: "skill", requesterId: adminId, status: "succeeded", inputJson: { name: "drizzle-orm-postgresql-setup", goal: "Setup Drizzle ORM dengan Neon", agentTarget: ["claude-code"] } },
    { targetType: "skill", requesterId: sarahId, status: "succeeded", inputJson: { name: "vercel-ai-sdk-chat", goal: "Integrasi Vercel AI SDK untuk chat", agentTarget: ["cursor"] } },
    { targetType: "prd", requesterId: adminId, status: "succeeded", inputJson: { title: "AI Skill Factory PRD" } },
    { targetType: "skill", requesterId: dimasId, status: "failed", inputJson: { name: "auth-nextjs", goal: "Auth.js setup" } },
    { targetType: "workflow", requesterId: adminId, status: "queued", inputJson: { name: "feature-dev-workflow" } },
  ];

  const stepNames = ["USER_REQUIREMENT", "REQUIREMENT_NORMALIZATION", "WEB_RESEARCH", "DOMAIN_ANALYSIS", "SKILL_DESIGN", "RESOURCE_DESIGN", "CANONICAL_JSON_GENERATION", "SCHEMA_VALIDATION", "SECURITY_REVIEW", "QUALITY_REVIEW", "COMPATIBILITY_REVIEW", "BEHAVIORAL_EVALUATION", "NORMALIZATION", "COMPILATION", "FILE_GENERATION", "PACKAGE", "VERSION", "PUBLISH"];

  for (const gd of gensData) {
    const startedAt = randomDate(14);
    const finishedAt = new Date(startedAt.getTime() + Math.floor(Math.random() * 90 + 30) * 1000);
    const [gen] = await db.insert(schema.generations).values({
      targetType: gd.targetType, requesterId: gd.requesterId, inputJson: gd.inputJson,
      status: gd.status, startedAt,
      finishedAt: gd.status !== "queued" && gd.status !== "running" ? finishedAt : null,
      createdAt: startedAt, updatedAt: finishedAt,
    }).returning({ id: schema.generations.id });

    const stepsCount = gd.status === "failed" ? 8 : gd.status === "queued" ? 0 : 18;
    for (let i = 0; i < stepsCount; i++) {
      const isLast = i === stepsCount - 1;
      const ss: "pending" | "running" | "succeeded" | "failed" = isLast && gd.status === "failed" ? "failed" : "succeeded";
      await db.insert(schema.generationSteps).values({
        generationId: gen.id, stepName: stepNames[i]!, stepOrder: i + 1, status: ss,
        outputSummary: ss === "succeeded" ? `Tahap ${i + 1} selesai.` : "Gagal: provider timeout.",
        tokenUsage: i === 6 ? { promptTokens: 2847, completionTokens: 1203, totalTokens: 4050, estimatedCostUsd: 0.012 } : null,
        startedAt: new Date(startedAt.getTime() + i * 5000),
        finishedAt: new Date(startedAt.getTime() + (i + 1) * 5000),
        createdAt: new Date(startedAt.getTime() + i * 5000),
      });
    }
  }
  console.log(`  ✅ ${gensData.length} generations + steps`);

  // ─── 12. VALIDATION + SECURITY SCANS ────────────────────────────────────────
  console.log("\n🔍 Seeding validation results & security scans...");

  for (const [slug, sid] of Object.entries(skillMap)) {
    if (!sid) continue;
    await db.insert(schema.validationResults).values({
      targetType: "skill", targetId: sid, schemaVersion: "1.0.0",
      isValid: slug !== "auth-nextjs-credentials",
      errors: slug === "auth-nextjs-credentials" ? [{ field: "triggers", issue: "minimal 1 trigger diperlukan" }] : null,
      createdAt: new Date(),
    });

    const scores: Record<string, number> = { "nextjs-error-boundary-setup": 96, "typescript-strict-config": 98, "playwright-e2e-setup": 94, "drizzle-orm-postgresql-setup": 95, "docker-compose-dev-setup": 88, "vercel-ai-sdk-chat-setup": 90, "github-actions-nextjs-ci": 92 };
    if (slug !== "auth-nextjs-credentials") {
      await db.insert(schema.securityScans).values({
        targetType: "skill", targetId: sid, score: scores[slug] ?? 90,
        findings: slug === "docker-compose-dev-setup" ? [{ category: "shell-exposure", severity: "low", detail: "Volume permission" }] : [],
        scannedAt: new Date(), scannerVersion: "1.0.0",
      });
    }
  }
  console.log("  ✅ Validation results & security scans");

  // ─── 13. DOWNLOADS ──────────────────────────────────────────────────────────
  console.log("\n📥 Seeding download logs...");

  for (const [slug, sid] of Object.entries(skillMap)) {
    if (!sid) continue;
    const dlCount = { "nextjs-error-boundary-setup": 5, "drizzle-orm-postgresql-setup": 8, "playwright-e2e-setup": 3, "typescript-strict-config": 4 }[slug] ?? 0;
    const users = [dimasId, sarahId, budiId, raniId, null, null];
    for (let i = 0; i < dlCount; i++) {
      await db.insert(schema.downloads).values({
        targetType: "skill", targetId: sid, userId: users[i % users.length],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        createdAt: randomDate(14),
      });
    }
  }
  console.log("  ✅ Download logs");

  // ─── 14. AUDIT LOGS ─────────────────────────────────────────────────────────
  console.log("\n📜 Seeding audit logs...");

  const auditLogs = [
    { actorId: adminId, action: "skill.publish", targetType: "skill", targetId: s1, before: { status: "approved" }, after: { status: "published" } },
    { actorId: adminId, action: "skill.publish", targetType: "skill", targetId: s2, before: { status: "approved" }, after: { status: "published" } },
    { actorId: adminId, action: "user.role_change", targetType: "user", targetId: modId, before: { role: "user" }, after: { role: "moderator" } },
    { actorId: adminId, action: "platform.seed", targetType: "system", targetId: undefined, before: null, after: { seeded: true, tables: 33 } },
    { actorId: adminId, action: "ai_provider.create", targetType: "ai_provider", targetId: undefined, before: null, after: { provider: "anthropic", model: "claude-sonnet-4-6" } },
  ];

  for (const al of auditLogs) {
    await db.insert(schema.auditLogs).values({
      actorId: al.actorId, action: al.action, targetType: al.targetType,
      targetId: al.targetId, beforeJson: al.before, afterJson: al.after,
      ipAddress: "127.0.0.1", createdAt: randomDate(3),
    });
  }
  console.log(`  ✅ ${auditLogs.length} audit logs`);

  // ─── SUMMARY ────────────────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(64));
  console.log("🎉 DUMMY DATA SEEDING SELESAI!\n");
  console.log("📊 Data tersimpan di Neon PostgreSQL:");
  console.log(`   👤 Users           : 7 (admin, superadmin, moderator, 4 user)`);
  console.log(`   📦 Skills          : 8 (published/draft/review/approved)`);
  console.log(`   📋 PRDs            : 3`);
  console.log(`   🔄 Workflows       : 3`);
  console.log(`   🚀 Agent Kits      : 2`);
  console.log(`   💬 Comments        : 6 + reactions`);
  console.log(`   ⭐ Ratings         : 8`);
  console.log(`   📚 Collections     : 4 (2 official, 2 pribadi)`);
  console.log(`   🤖 AI Providers    : 4 (Anthropic, Google, OpenAI, Groq)`);
  console.log(`   ✨ Generations     : 6 + steps per tahap`);
  console.log(`   🔍 Validation      : Per skill`);
  console.log(`   🔒 Security Scans  : Per skill (kecuali draft)`);
  console.log(`   📥 Downloads       : Multiple logs`);
  console.log(`   📜 Audit Logs      : 5 entri`);
  console.log("\n" + "─".repeat(64));
  console.log("🔑 AKUN UNTUK LOGIN:\n");
  console.log("   🔴 Super Admin  : superadmin@skillid.dev / SuperAdmin123!");
  console.log("   🟠 Admin        : admin@skillid.dev      / Admin123!");
  console.log("   🟡 Moderator    : moderator@skillid.dev  / Moderator123!");
  console.log("   🟢 User biasa   : dimas@developer.id     / User123!");
  console.log("   🟢 User biasa   : sarah@startup.id       / User123!");
  console.log("─".repeat(64));
}

seedDummy().catch((err) => {
  console.error("❌ Dummy seed failed:", err);
  process.exit(1);
});
