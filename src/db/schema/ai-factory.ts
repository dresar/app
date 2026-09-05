// Schema: AI Factory & Operasional
// ai_providers, prompt_templates, generations, generation_steps,
// validation_results, security_scans, site_settings

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const aiProviderEnum = pgEnum("ai_provider_type", [
  "anthropic",
  "google",
  "openai",
  "groq",
  "openai-compatible",
]);

export const generationStatusEnum = pgEnum("generation_status", [
  "queued",
  "running",
  "succeeded",
  "failed",
]);

export const stepStatusEnum = pgEnum("step_status", [
  "pending",
  "running",
  "succeeded",
  "failed",
  "skipped",
]);

// ─── AI Providers ─────────────────────────────────────────────────────────────

export const aiProviders = pgTable(
  "ai_providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: aiProviderEnum("provider").notNull(),
    model: varchar("model", { length: 255 }).notNull(), // e.g. "claude-sonnet-4-6", "gemini-2.0-flash"
    endpoint: text("endpoint"), // untuk openai-compatible / self-hosted
    // BUKAN nilai mentah API key — hanya referensi ke env var / secret manager
    apiKeySecretRef: varchar("api_key_secret_ref", { length: 255 }).notNull(),
    active: boolean("active").notNull().default(true),
    priority: integer("priority").notNull().default(1), // lower = higher priority
    timeoutMs: integer("timeout_ms").notNull().default(30000),
    maxTokens: integer("max_tokens").notNull().default(4096),
    displayName: varchar("display_name", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("idx_ai_providers_active").on(t.active, t.priority),
  ]
);

// ─── Prompt Templates ─────────────────────────────────────────────────────────

export const promptTemplates = pgTable(
  "prompt_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    // stage: 1–22 modul dari 07-ai-generation-engine.md §3
    stage: varchar("stage", { length: 100 }).notNull(),
    content: text("content").notNull(),
    version: integer("version").notNull().default(1),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("idx_prompt_templates_stage").on(t.stage),
    index("idx_prompt_templates_active").on(t.isActive),
  ]
);

// ─── Generations ─────────────────────────────────────────────────────────────

export const generations = pgTable(
  "generations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    targetType: varchar("target_type", { length: 50 }).notNull(), // 'skill' | 'prd' | 'workflow' | 'agent_kit'
    requesterId: uuid("requester_id").references(() => users.id, { onDelete: "set null" }),
    inputJson: jsonb("input_json").notNull(), // form requirement dari pengguna
    status: generationStatusEnum("status").notNull().default("queued"),
    // Set setelah generation berhasil dan skill_version dibuat
    resultSkillVersionId: uuid("result_skill_version_id"),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_generations_status").on(t.status),
    index("idx_generations_requester").on(t.requesterId),
    index("idx_generations_target").on(t.targetType),
    index("idx_generations_created_at").on(t.createdAt),
  ]
);

// ─── Generation Steps ─────────────────────────────────────────────────────────

export const generationSteps = pgTable(
  "generation_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    generationId: uuid("generation_id")
      .notNull()
      .references(() => generations.id, { onDelete: "cascade" }),
    // Nama tahap sesuai 18 tahap pipeline di 07-ai-generation-engine.md §2
    stepName: varchar("step_name", { length: 100 }).notNull(),
    stepOrder: integer("step_order").notNull(), // 1–18
    status: stepStatusEnum("status").notNull().default("pending"),
    outputSummary: text("output_summary"),
    // { promptTokens, completionTokens, totalTokens, estimatedCostUsd }
    tokenUsage: jsonb("token_usage"),
    errorDetail: text("error_detail"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_generation_steps_generation_id").on(t.generationId),
    index("idx_generation_steps_status").on(t.status),
  ]
);

// ─── Validation Results ───────────────────────────────────────────────────────

export const validationResults = pgTable(
  "validation_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    targetType: varchar("target_type", { length: 50 }).notNull(),
    targetId: uuid("target_id").notNull(),
    schemaVersion: varchar("schema_version", { length: 50 }).notNull(),
    isValid: boolean("is_valid").notNull(),
    errors: jsonb("errors"), // array of { field, issue }
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_validation_results_target").on(t.targetType, t.targetId),
  ]
);

// ─── Security Scans ───────────────────────────────────────────────────────────

export const securityScans = pgTable(
  "security_scans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    targetType: varchar("target_type", { length: 50 }).notNull(),
    targetId: uuid("target_id").notNull(),
    score: integer("score"), // 0–100
    // array of { category, severity, detail, location }
    findings: jsonb("findings"),
    scannedAt: timestamp("scanned_at", { withTimezone: true }).notNull().defaultNow(),
    // Scanner tidak pernah menyatakan "aman 100%" — selalu ada disclaimer
    scannerVersion: varchar("scanner_version", { length: 50 }),
  },
  (t) => [
    index("idx_security_scans_target").on(t.targetType, t.targetId),
    index("idx_security_scans_scanned_at").on(t.scannedAt),
  ]
);

// ─── Site Settings ────────────────────────────────────────────────────────────

export const siteSettings = pgTable(
  "site_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    value: jsonb("value").notNull(),
    description: text("description"),
    updatedById: uuid("updated_by_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_site_settings_key").on(t.key),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const generationsRelations = relations(generations, ({ one, many }) => ({
  requester: one(users, { fields: [generations.requesterId], references: [users.id] }),
  steps: many(generationSteps),
}));

export const generationStepsRelations = relations(generationSteps, ({ one }) => ({
  generation: one(generations, { fields: [generationSteps.generationId], references: [generations.id] }),
}));

export const siteSettingsRelations = relations(siteSettings, ({ one }) => ({
  updatedBy: one(users, { fields: [siteSettings.updatedById], references: [users.id] }),
}));
