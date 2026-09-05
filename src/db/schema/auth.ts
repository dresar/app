// Schema: Identitas & Akses
// users, user_roles, audit_logs

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "deleted",
]);

export const roleEnum = pgEnum("role", [
  "user",
  "moderator",
  "admin",
  "superadmin",
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash"), // NULL jika user OAuth-only
    name: varchar("name", { length: 255 }).notNull(),
    avatarUrl: text("avatar_url"),
    oauthProvider: varchar("oauth_provider", { length: 50 }), // 'google' | 'github'
    oauthId: varchar("oauth_id", { length: 255 }),
    status: userStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("idx_users_email").on(t.email),
    index("idx_users_status").on(t.status),
  ]
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default("user"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_user_roles_user_role").on(t.userId, t.role),
  ]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(), // e.g. 'skill.publish', 'user.role_change'
    targetType: varchar("target_type", { length: 50 }).notNull(), // e.g. 'skill', 'user', 'comment'
    targetId: uuid("target_id"),
    beforeJson: jsonb("before_json"),
    afterJson: jsonb("after_json"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    // Tidak ada deleted_at — audit_logs adalah append-only
  },
  (t) => [
    index("idx_audit_logs_actor").on(t.actorId),
    index("idx_audit_logs_target").on(t.targetType, t.targetId),
    index("idx_audit_logs_created_at").on(t.createdAt),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  roles: many(userRoles),
  auditLogsAsActor: many(auditLogs),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.actorId],
    references: [users.id],
  }),
}));
