#!/usr/bin/env tsx
// scripts/seed.ts
// Seed data awal untuk AI Skill Factory Indonesia
// Jalankan: npm run db:seed

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Starting seed...\n");

  // ─── 1. Categories ───────────────────────────────────────────────────────────
  console.log("📁 Seeding categories...");
  const categoryData = [
    { slug: "framework-nextjs", name: "Next.js", description: "Skills untuk framework Next.js App Router & Pages Router", icon: "⚡" },
    { slug: "framework-react", name: "React", description: "Skills untuk React ekosistem", icon: "⚛️" },
    { slug: "framework-vue", name: "Vue.js", description: "Skills untuk Vue.js dan ekosistemnya", icon: "💚" },
    { slug: "framework-laravel", name: "Laravel", description: "Skills untuk framework PHP Laravel", icon: "🔴" },
    { slug: "database-postgresql", name: "PostgreSQL", description: "Skills untuk database PostgreSQL", icon: "🐘" },
    { slug: "database-mysql", name: "MySQL", description: "Skills untuk database MySQL/MariaDB", icon: "🐬" },
    { slug: "database-mongodb", name: "MongoDB", description: "Skills untuk database MongoDB", icon: "🍃" },
    { slug: "devops-docker", name: "Docker & Containers", description: "Skills untuk containerization dan Docker", icon: "🐳" },
    { slug: "devops-ci-cd", name: "CI/CD", description: "Skills untuk continuous integration dan deployment", icon: "🔄" },
    { slug: "testing-unit", name: "Unit Testing", description: "Skills untuk penulisan unit test", icon: "🧪" },
    { slug: "testing-e2e", name: "E2E Testing", description: "Skills untuk end-to-end testing dengan Playwright/Cypress", icon: "🎭" },
    { slug: "ai-integration", name: "AI Integration", description: "Skills untuk mengintegrasikan AI/LLM ke aplikasi", icon: "🤖" },
    { slug: "security", name: "Security", description: "Skills untuk keamanan aplikasi dan review kode", icon: "🔒" },
    { slug: "documentation", name: "Dokumentasi", description: "Skills untuk penulisan dokumentasi teknis", icon: "📝" },
    { slug: "workflow-general", name: "Workflow Umum", description: "Skills workflow untuk berbagai skenario pengembangan", icon: "🔧" },
    { slug: "agent-kit-fullstack", name: "Full-Stack Kit", description: "Agent Kit untuk pengembangan aplikasi full-stack", icon: "🚀" },
  ];

  for (const cat of categoryData) {
    await db.insert(schema.categories).values({
      ...cat,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: schema.categories.slug,
      set: { name: cat.name, description: cat.description, icon: cat.icon, updatedAt: new Date() },
    });
  }
  console.log(`  ✅ ${categoryData.length} categories seeded`);

  // ─── 2. Tags ─────────────────────────────────────────────────────────────────
  console.log("🏷️  Seeding tags...");
  const tagData = [
    { slug: "typescript", name: "TypeScript" },
    { slug: "javascript", name: "JavaScript" },
    { slug: "nodejs", name: "Node.js" },
    { slug: "api", name: "API" },
    { slug: "rest", name: "REST" },
    { slug: "graphql", name: "GraphQL" },
    { slug: "app-router", name: "App Router" },
    { slug: "server-components", name: "Server Components" },
    { slug: "authentication", name: "Authentication" },
    { slug: "authorization", name: "Authorization" },
    { slug: "error-handling", name: "Error Handling" },
    { slug: "performance", name: "Performance" },
    { slug: "accessibility", name: "Accessibility" },
    { slug: "responsive", name: "Responsive Design" },
    { slug: "drizzle", name: "Drizzle ORM" },
    { slug: "prisma", name: "Prisma" },
    { slug: "supabase", name: "Supabase" },
    { slug: "vercel", name: "Vercel" },
    { slug: "playwright", name: "Playwright" },
    { slug: "vitest", name: "Vitest" },
  ];

  for (const tag of tagData) {
    await db.insert(schema.tags).values({
      ...tag,
      createdAt: new Date(),
    }).onConflictDoUpdate({
      target: schema.tags.slug,
      set: { name: tag.name },
    });
  }
  console.log(`  ✅ ${tagData.length} tags seeded`);

  // ─── 3. Agents ────────────────────────────────────────────────────────────────
  console.log("🤖 Seeding agents...");
  const agentData = [
    {
      slug: "claude-code",
      name: "Claude Code",
      skillFolderGlobal: "~/.claude/skills/",
      skillFolderProject: ".claude/skills/",
      notes: "Native support. Invoke manual dengan /. Distribusi via plugin juga didukung.",
      isLegacy: false,
    },
    {
      slug: "cursor",
      name: "Cursor",
      skillFolderGlobal: "~/.cursor/skills/",
      skillFolderProject: ".cursor/skills/",
      notes: "Cross-read folder Claude Code (~/.claude/skills/ dan .claude/skills/).",
      isLegacy: false,
    },
    {
      slug: "codex-cli",
      name: "Codex CLI",
      skillFolderGlobal: "~/.codex/skills/",
      skillFolderProject: ".codex/skills/",
      notes: "Cross-read folder Claude Code (~/.claude/skills/).",
      isLegacy: false,
    },
    {
      slug: "gemini-cli",
      name: "Gemini CLI",
      skillFolderGlobal: "~/.gemini/skills/",
      skillFolderProject: ".gemini/skills/",
      notes: "Status preview. Butuh consent prompt saat aktivasi. LEGACY: akses konsumen dihentikan Google 18 Juni 2026.",
      isLegacy: true,
    },
    {
      slug: "antigravity",
      name: "Antigravity",
      skillFolderGlobal: "~/.gemini/antigravity-cli/skills/",
      skillFolderProject: ".agents/skills/",
      notes: "Native support ditambahkan awal 2026. Mendukung Manager View (role-based skill assignment).",
      isLegacy: false,
    },
  ];

  for (const agent of agentData) {
    await db.insert(schema.agents).values({
      ...agent,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: schema.agents.slug,
      set: {
        name: agent.name,
        skillFolderGlobal: agent.skillFolderGlobal,
        skillFolderProject: agent.skillFolderProject,
        notes: agent.notes,
        isLegacy: agent.isLegacy,
        updatedAt: new Date(),
      },
    });
  }
  console.log(`  ✅ ${agentData.length} agents seeded`);

  // ─── 4. Site Settings ─────────────────────────────────────────────────────────
  console.log("⚙️  Seeding site settings...");
  const settingsData = [
    {
      key: "generation.quota_per_user_per_hour",
      value: { user: 5, admin: 50, superadmin: 200 },
      description: "Kuota generate per role per jam",
    },
    {
      key: "generation.max_retries",
      value: { auto: 2, manual: 10 },
      description: "Maksimum retry otomatis sebelum fallback ke provider lain, dan retry manual oleh admin",
    },
    {
      key: "search.results_per_page",
      value: { default: 20, max: 100 },
      description: "Jumlah hasil per halaman untuk search dan listing",
    },
    {
      key: "security.min_score_to_publish",
      value: 60,
      description: "Skor keamanan minimum untuk bisa di-publish (0–100)",
    },
    {
      key: "quality.min_score_to_publish",
      value: 70,
      description: "Quality score minimum untuk bisa di-publish (0–100)",
    },
    {
      key: "registration.enabled",
      value: true,
      description: "Toggle registrasi publik",
    },
    {
      key: "rate_limit.public_api_per_ip_per_minute",
      value: 60,
      description: "Rate limit endpoint publik per IP per menit (anti-scraping)",
    },
    {
      key: "platform.name",
      value: "AI Skill Factory Indonesia",
      description: "Nama platform",
    },
    {
      key: "platform.description",
      value: "Platform open-source berbahasa Indonesia untuk AI coding skills, PRD, workflow, dan Agent Kit.",
      description: "Deskripsi singkat platform",
    },
    {
      key: "platform.schema_version",
      value: "1.0.0",
      description: "Versi schema canonical JSON yang aktif",
    },
  ];

  for (const setting of settingsData) {
    await db.insert(schema.siteSettings).values({
      key: setting.key,
      value: setting.value,
      description: setting.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value: setting.value, description: setting.description, updatedAt: new Date() },
    });
  }
  console.log(`  ✅ ${settingsData.length} site settings seeded`);

  // ─── 5. Prompt Templates (22 modul) ──────────────────────────────────────────
  console.log("📋 Seeding prompt templates (22 modul)...");
  const promptModules = [
    { stage: "01-system-identity", name: "System Identity", content: "Kamu adalah arsitek skill AI yang berpengalaman. Tujuanmu adalah menghasilkan AI coding skills berkualitas tinggi dalam Bahasa Indonesia. Istilah teknis (nama file, perintah, nama library) tetap dalam bentuk asli bahasa Inggris." },
    { stage: "02-research-rules", name: "Research Rules", content: "Lakukan web research jika skill menyentuh teknologi yang cepat berubah (framework, library, API, SDK). Prioritas sumber: dokumentasi resmi > repository resmi > sumber primer. Catat setiap sumber di provenance.sources[]. Jika research tidak tersedia, tandai needsVerification: true." },
    { stage: "03-requirement-interpretation", name: "Requirement Interpretation", content: "Terjemahkan input form pengguna menjadi tujuan skill yang jelas dan terukur. Identifikasi: tujuan utama, teknologi yang terlibat, agent target, scope yang realistis." },
    { stage: "04-skill-architecture-rules", name: "Skill Architecture Rules", content: "Setiap skill harus memiliki satu tanggung jawab utama (single responsibility). Terapkan progressive disclosure: ringkasan dulu, detail on-demand. Hindari scope yang terlalu luas." },
    { stage: "05-metadata-rules", name: "Metadata Rules", content: "Format name: lowercase, dash-separated, deskriptif (contoh: nextjs-error-boundary-setup). Description harus berfungsi sebagai discovery mechanism. License: MIT kecuali ada alasan khusus." },
    { stage: "06-instruction-rules", name: "Instruction Rules", content: "Setiap instruksi harus actionable dan spesifik. Hindari instruksi generik seperti 'buat kode yang baik'. Gunakan kata kerja aktif: 'Identifikasi', 'Buat', 'Verifikasi', 'Tambahkan'." },
    { stage: "07-trigger-discovery-rules", name: "Trigger/Discovery Rules", content: "description SKILL.md harus berfungsi sebagai discovery mechanism, bukan slogan pemasaran. Gunakan format: 'Gunakan skill ini saat [kondisi]. Cocok ketika [konteks spesifik].' triggers[] berisi kalimat yang akan diucapkan user." },
    { stage: "08-boundary-rules", name: "Boundary Rules", content: "Definisikan inScope dan outOfScope secara eksplisit. outOfScope harus menyebutkan skill lain yang menangani hal tersebut jika ada. Hindari ambiguitas scope." },
    { stage: "09-workflow-rules", name: "Workflow Rules", content: "Workflow harus berisi langkah-langkah yang dapat diikuti agent step-by-step. Setiap step harus memiliki action yang jelas dan terukur. Urutkan dari diagnosis/deteksi hingga implementasi." },
    { stage: "10-example-rules", name: "Example Rules", content: "Contoh harus nyata dan representatif, bukan placeholder abstrak. Setiap contoh harus memiliki input dan output yang konkret. Minimal 1 contoh wajib ada." },
    { stage: "11-resource-rules", name: "Resource Rules", content: "Gunakan references/ hanya untuk detail panjang yang mengurangi efisiensi token jika ada di SKILL.md utama. assets/ untuk template yang reusable. Hindari membuat folder kosong." },
    { stage: "12-script-rules", name: "Script Rules", content: "Skrip hanya dibuat jika ada kebutuhan eksekusi nyata. Setiap skrip WAJIB memiliki: deskripsi tujuan, input yang diharapkan, output yang dihasilkan, permission yang dibutuhkan, dependency, perilaku saat gagal." },
    { stage: "13-template-rules", name: "Template Rules", content: "Template resource harus reusable dan parameterizable. Hindari template yang hardcoded untuk satu use case spesifik. Sertakan komentar placeholder yang jelas." },
    { stage: "14-compatibility-rules", name: "Compatibility Rules", content: "Pisahkan universal behavior dari klaim khusus agent. Jangan klaim 'verified' tanpa pengujian nyata. Gunakan 'likely' jika belum diverifikasi langsung. Compatibility matrix harus akurat." },
    { stage: "15-security-rules", name: "Security Rules", content: "Tidak boleh menyimpan secret asli dalam skill. Waspada terhadap: prompt injection, curl|sh pattern, perintah destruktif, eksfiltrasi data. Setiap skrip shell harus dijelaskan permission-nya." },
    { stage: "16-quality-rules", name: "Quality Rules", content: "Checklist 12 dimensi: Purpose Clarity, Trigger Quality, Instruction Quality, Workflow Completeness, Boundary Clarity, Example Quality, Documentation Quality, Compatibility Accuracy, Security Safety, Token Efficiency, Maintainability, Testability." },
    { stage: "17-behavioral-evaluation-rules", name: "Behavioral Evaluation Rules", content: "Hasilkan minimal 1 test case per dimensi: Trigger (kapan skill diaktifkan), Compliance (apakah instruksi diikuti), Boundary (apa yang tidak dilakukan skill). Format: evals/evals.json." },
    { stage: "18-token-efficiency-rules", name: "Token Efficiency Rules", content: "SKILL.md harus ringkas dan efisien. Detail panjang dipindah ke references/. Gunakan bullet points, bukan paragraf panjang. Target: SKILL.md di bawah 2000 token untuk skill sederhana." },
    { stage: "19-maintainability-rules", name: "Maintainability Rules", content: "Struktur canonical JSON harus mudah di-regenerate ulang. Gunakan field provenance untuk mencatat sumber. Hindari coupling yang tidak perlu antar bagian skill." },
    { stage: "20-output-schema-rules", name: "Output Schema Rules", content: "Output HARUS valid JSON sesuai canonical schema versi aktif. Tidak ada teks di luar JSON. Semua field wajib harus terisi. Schema version dicantumkan di schemaVersion." },
    { stage: "21-self-critique-rules", name: "Self-Critique Rules", content: "Lakukan review internal sebelum output final. Periksa: apakah semua field wajib terisi? apakah contoh nyata (bukan placeholder)? apakah boundary jelas? JANGAN tampilkan proses review ini di output." },
    { stage: "22-final-validation-rules", name: "Final Validation Rules", content: "Checklist akhir sebelum menyatakan hasil selesai: ✓ schemaVersion valid ✓ triggers minimal 1 ✓ instructions minimal 3 ✓ examples minimal 1 ✓ boundaries.inScope dan outOfScope tidak kosong ✓ provenance.sources terisi jika research dilakukan." },
  ];

  for (const module of promptModules) {
    await db.insert(schema.promptTemplates).values({
      name: module.name,
      stage: module.stage,
      content: module.content,
      version: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing();
  }
  console.log(`  ✅ ${promptModules.length} prompt templates seeded`);

  console.log("\n🎉 Seed complete!");
  console.log("\nRingkasan:");
  console.log(`  - ${categoryData.length} categories`);
  console.log(`  - ${tagData.length} tags`);
  console.log(`  - ${agentData.length} agents (Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity)`);
  console.log(`  - ${settingsData.length} site settings`);
  console.log(`  - ${promptModules.length} prompt templates (22 modul AI generation)`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
