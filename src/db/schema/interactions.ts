// Schema: Interaksi Pengguna
// collections, collection_items, comments, comment_reactions, ratings, reports, downloads

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
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const collectionVisibilityEnum = pgEnum("collection_visibility", [
  "private",
  "public",
]);

export const commentStatusEnum = pgEnum("comment_status", [
  "visible",
  "hidden",
  "pinned",
]);

export const reactionTypeEnum = pgEnum("reaction_type", ["upvote"]);

export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "resolved",
  "dismissed",
]);

// ─── Collections ─────────────────────────────────────────────────────────────

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    visibility: collectionVisibilityEnum("visibility").notNull().default("private"),
    isOfficial: boolean("is_official").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("idx_collections_owner").on(t.ownerId),
    index("idx_collections_visibility").on(t.visibility),
  ]
);

export const collectionItems = pgTable(
  "collection_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    targetType: varchar("target_type", { length: 50 }).notNull(), // 'skill' | 'prd' | 'workflow' | 'agent_kit' | 'template'
    targetId: uuid("target_id").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_collection_items_collection").on(t.collectionId),
    uniqueIndex("idx_collection_items_unique").on(t.collectionId, t.targetType, t.targetId),
  ]
);

// ─── Comments ─────────────────────────────────────────────────────────────────

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: varchar("target_type", { length: 50 }).notNull(), // 'skill' | 'prd' | ...
    targetId: uuid("target_id").notNull(),
    parentId: uuid("parent_id"), // null = top-level; FK set below to avoid circular
    body: text("body").notNull(),
    status: commentStatusEnum("status").notNull().default("visible"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("idx_comments_target").on(t.targetType, t.targetId),
    index("idx_comments_author").on(t.authorId),
    index("idx_comments_parent").on(t.parentId),
    index("idx_comments_status").on(t.status),
  ]
);

export const commentReactions = pgTable(
  "comment_reactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: reactionTypeEnum("type").notNull().default("upvote"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("idx_comment_reactions_unique").on(t.commentId, t.userId),
  ]
);

// ─── Ratings ──────────────────────────────────────────────────────────────────

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: varchar("target_type", { length: 50 }).notNull(),
    targetId: uuid("target_id").notNull(),
    score: smallint("score").notNull(), // 1–5
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Cegah rating ganda per user per target
    uniqueIndex("idx_ratings_unique").on(t.userId, t.targetType, t.targetId),
    index("idx_ratings_target").on(t.targetType, t.targetId),
    check("score_range", sql`score >= 1 AND score <= 5`),
  ]
);

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: varchar("target_type", { length: 50 }).notNull(),
    targetId: uuid("target_id").notNull(),
    reason: text("reason").notNull(),
    status: reportStatusEnum("status").notNull().default("open"),
    resolvedById: uuid("resolved_by_id").references(() => users.id, { onDelete: "set null" }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_reports_target").on(t.targetType, t.targetId),
    index("idx_reports_status").on(t.status),
    index("idx_reports_reporter").on(t.reporterId),
  ]
);

// ─── Downloads ────────────────────────────────────────────────────────────────

export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    targetType: varchar("target_type", { length: 50 }).notNull(),
    targetId: uuid("target_id").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }), // nullable (anonim boleh unduh)
    agentId: uuid("agent_id"), // nullable, FK to agents (if installed via CLI)
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_downloads_target").on(t.targetType, t.targetId),
    index("idx_downloads_user").on(t.userId),
    index("idx_downloads_created_at").on(t.createdAt),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  owner: one(users, { fields: [collections.ownerId], references: [users.id] }),
  items: many(collectionItems),
}));

export const collectionItemsRelations = relations(collectionItems, ({ one }) => ({
  collection: one(collections, { fields: [collectionItems.collectionId], references: [collections.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  reactions: many(commentReactions),
  replies: many(comments, { relationName: "replies" }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "replies",
  }),
}));

export const commentReactionsRelations = relations(commentReactions, ({ one }) => ({
  comment: one(comments, { fields: [commentReactions.commentId], references: [comments.id] }),
  user: one(users, { fields: [commentReactions.userId], references: [users.id] }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  user: one(users, { fields: [ratings.userId], references: [users.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
  resolvedBy: one(users, { fields: [reports.resolvedById], references: [users.id] }),
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  user: one(users, { fields: [downloads.userId], references: [users.id] }),
}));
