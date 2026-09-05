// Schema: Konten Inti
// categories, tags, agents, skills, skill_versions, skill_files, skill_tags, skill_agents
// prds, prd_versions, workflows, workflow_versions, agent_kits, agent_kit_versions
// templates, template_versions

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  smallint,
  boolean,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
  customType,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "generating",
  "review",
  "approved",
  "published",
  "archived",
  "rejected",
]);

export const compatibilityStatusEnum = pgEnum("compatibility_status", [
  "verified",
  "likely",
  "unverified",
]);

// Custom tsvector type for full-text search
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

// ─── Lookup Tables ────────────────────────────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 100 }), // icon name / emoji
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("idx_categories_slug").on(t.slug),
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_tags_slug").on(t.slug),
  ]
);

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // e.g. 'claude-code', 'cursor', 'codex-cli', 'gemini-cli', 'antigravity'
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    skillFolderGlobal: varchar("skill_folder_global", { length: 500 }), // e.g. ~/.claude/skills/
    skillFolderProject: varchar("skill_folder_project", { length: 500 }), // e.g. .claude/skills/
    notes: text("notes"),
    isLegacy: boolean("is_legacy").notNull().default(false), // true for Gemini CLI
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_agents_slug").on(t.slug),
  ]
);

// ─── Skills ───────────────────────────────────────────────────────────────────

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    currentVersionId: uuid("current_version_id"), // FK to skill_versions (set after insert)
    status: contentStatusEnum("status").notNull().default("draft"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }), // NULL = official/admin
    qualityScore: integer("quality_score"), // 0–100
    securityScore: integer("security_score"), // 0–100
    downloadCount: integer("download_count").notNull().default(0),
    // Full-text search vector (generated computed column — added via raw SQL migration)
    searchVector: tsvector("search_vector"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    // Unique slug among non-deleted skills
    uniqueIndex("idx_skills_slug").on(t.slug).where(sql`deleted_at IS NULL`),
    index("idx_skills_status").on(t.status).where(sql`deleted_at IS NULL`),
    index("idx_skills_category").on(t.categoryId),
    index("idx_skills_owner").on(t.ownerId),
    index("idx_skills_search").using("gin", t.searchVector),
  ]
);

export const skillVersions = pgTable(
  "skill_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 50 }).notNull(), // semver, e.g. "1.0.0"
    canonicalJson: jsonb("canonical_json").notNull(), // source of truth
    changelog: text("changelog"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_skill_versions_skill_id").on(t.skillId),
    uniqueIndex("idx_skill_versions_skill_version").on(t.skillId, t.version),
  ]
);

export const skillFiles = pgTable(
  "skill_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillVersionId: uuid("skill_version_id")
      .notNull()
      .references(() => skillVersions.id, { onDelete: "cascade" }),
    filePath: varchar("file_path", { length: 500 }).notNull(), // e.g. "SKILL.md", "scripts/setup.sh"
    contentType: varchar("content_type", { length: 100 }), // e.g. "text/markdown"
    storageRef: text("storage_ref"), // via StorageProvider (Vercel Blob ref)
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_skill_files_version").on(t.skillVersionId),
  ]
);

export const skillTags = pgTable(
  "skill_tags",
  {
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.skillId, t.tagId] }),
  ]
);

export const skillAgents = pgTable(
  "skill_agents",
  {
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    compatibilityStatus: compatibilityStatusEnum("compatibility_status")
      .notNull()
      .default("unverified"),
  },
  (t) => [
    primaryKey({ columns: [t.skillId, t.agentId] }),
  ]
);

// ─── PRDs ─────────────────────────────────────────────────────────────────────

export const prds = pgTable(
  "prds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    currentVersionId: uuid("current_version_id"),
    status: contentStatusEnum("status").notNull().default("draft"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    qualityScore: integer("quality_score"),
    securityScore: integer("security_score"),
    downloadCount: integer("download_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("idx_prds_slug").on(t.slug).where(sql`deleted_at IS NULL`),
    index("idx_prds_status").on(t.status).where(sql`deleted_at IS NULL`),
  ]
);

export const prdVersions = pgTable(
  "prd_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    prdId: uuid("prd_id")
      .notNull()
      .references(() => prds.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 50 }).notNull(),
    canonicalJson: jsonb("canonical_json").notNull(),
    changelog: text("changelog"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_prd_versions_prd_id").on(t.prdId),
  ]
);

// ─── Workflows ────────────────────────────────────────────────────────────────

export const workflows = pgTable(
  "workflows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    currentVersionId: uuid("current_version_id"),
    status: contentStatusEnum("status").notNull().default("draft"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    qualityScore: integer("quality_score"),
    securityScore: integer("security_score"),
    downloadCount: integer("download_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("idx_workflows_slug").on(t.slug).where(sql`deleted_at IS NULL`),
    index("idx_workflows_status").on(t.status).where(sql`deleted_at IS NULL`),
  ]
);

export const workflowVersions = pgTable(
  "workflow_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workflowId: uuid("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 50 }).notNull(),
    canonicalJson: jsonb("canonical_json").notNull(),
    changelog: text("changelog"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_workflow_versions_workflow_id").on(t.workflowId),
  ]
);

// ─── Agent Kits ───────────────────────────────────────────────────────────────

export const agentKits = pgTable(
  "agent_kits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    currentVersionId: uuid("current_version_id"),
    status: contentStatusEnum("status").notNull().default("draft"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    qualityScore: integer("quality_score"),
    securityScore: integer("security_score"),
    downloadCount: integer("download_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("idx_agent_kits_slug").on(t.slug).where(sql`deleted_at IS NULL`),
    index("idx_agent_kits_status").on(t.status).where(sql`deleted_at IS NULL`),
  ]
);

export const agentKitVersions = pgTable(
  "agent_kit_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    agentKitId: uuid("agent_kit_id")
      .notNull()
      .references(() => agentKits.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 50 }).notNull(),
    canonicalJson: jsonb("canonical_json").notNull(),
    changelog: text("changelog"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_agent_kit_versions_kit_id").on(t.agentKitId),
  ]
);

// ─── Templates ────────────────────────────────────────────────────────────────

export const templates = pgTable(
  "templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    currentVersionId: uuid("current_version_id"),
    status: contentStatusEnum("status").notNull().default("draft"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    downloadCount: integer("download_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("idx_templates_slug").on(t.slug).where(sql`deleted_at IS NULL`),
    index("idx_templates_status").on(t.status).where(sql`deleted_at IS NULL`),
  ]
);

export const templateVersions = pgTable(
  "template_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id")
      .notNull()
      .references(() => templates.id, { onDelete: "cascade" }),
    version: varchar("version", { length: 50 }).notNull(),
    canonicalJson: jsonb("canonical_json").notNull(),
    changelog: text("changelog"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_template_versions_template_id").on(t.templateId),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const categoriesRelations = relations(categories, ({ many }) => ({
  skills: many(skills),
  prds: many(prds),
  workflows: many(workflows),
  agentKits: many(agentKits),
  templates: many(templates),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  skillTags: many(skillTags),
}));

export const agentsRelations = relations(agents, ({ many }) => ({
  skillAgents: many(skillAgents),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  category: one(categories, {
    fields: [skills.categoryId],
    references: [categories.id],
  }),
  owner: one(users, {
    fields: [skills.ownerId],
    references: [users.id],
  }),
  currentVersion: one(skillVersions, {
    fields: [skills.currentVersionId],
    references: [skillVersions.id],
  }),
  versions: many(skillVersions),
  tags: many(skillTags),
  agents: many(skillAgents),
}));

export const skillVersionsRelations = relations(skillVersions, ({ one, many }) => ({
  skill: one(skills, {
    fields: [skillVersions.skillId],
    references: [skills.id],
  }),
  files: many(skillFiles),
}));

export const skillFilesRelations = relations(skillFiles, ({ one }) => ({
  version: one(skillVersions, {
    fields: [skillFiles.skillVersionId],
    references: [skillVersions.id],
  }),
}));

export const skillTagsRelations = relations(skillTags, ({ one }) => ({
  skill: one(skills, { fields: [skillTags.skillId], references: [skills.id] }),
  tag: one(tags, { fields: [skillTags.tagId], references: [tags.id] }),
}));

export const skillAgentsRelations = relations(skillAgents, ({ one }) => ({
  skill: one(skills, { fields: [skillAgents.skillId], references: [skills.id] }),
  agent: one(agents, { fields: [skillAgents.agentId], references: [agents.id] }),
}));

export const prdsRelations = relations(prds, ({ one, many }) => ({
  category: one(categories, { fields: [prds.categoryId], references: [categories.id] }),
  owner: one(users, { fields: [prds.ownerId], references: [users.id] }),
  versions: many(prdVersions),
}));

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  category: one(categories, { fields: [workflows.categoryId], references: [categories.id] }),
  owner: one(users, { fields: [workflows.ownerId], references: [users.id] }),
  versions: many(workflowVersions),
}));

export const agentKitsRelations = relations(agentKits, ({ one, many }) => ({
  category: one(categories, { fields: [agentKits.categoryId], references: [categories.id] }),
  owner: one(users, { fields: [agentKits.ownerId], references: [users.id] }),
  versions: many(agentKitVersions),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  category: one(categories, { fields: [templates.categoryId], references: [categories.id] }),
  owner: one(users, { fields: [templates.ownerId], references: [users.id] }),
  versions: many(templateVersions),
}));
