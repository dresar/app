// API Route: GET /api/skills/[slug]
// Mengembalikan detail skill lengkap berdasarkan slug

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills, skillVersions, categories, skillAgents, agents, skillTags, tags, comments, users, ratings, securityScans, validationResults } from "@/db/schema";
import { eq, desc, avg, count, sql } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch skill dasar
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.slug, slug))
      .limit(1);

    if (!skill) {
      return NextResponse.json({ error: "Skill tidak ditemukan" }, { status: 404 });
    }

    // Category
    let categoryData: { name: string; slug: string } | null = null;
    if (skill.categoryId) {
      const catRow = await db.select({ name: categories.name, slug: categories.slug }).from(categories).where(eq(categories.id, skill.categoryId)).limit(1);
      if (catRow.length > 0) categoryData = catRow[0];
    }

    // Current version + canonical JSON
    let currentVersion = null;
    if (skill.currentVersionId) {
      const [sv] = await db
        .select()
        .from(skillVersions)
        .where(eq(skillVersions.id, skill.currentVersionId))
        .limit(1);
      currentVersion = sv ?? null;
    }

    // All versions (history)
    const allVersions = await db
      .select({ id: skillVersions.id, version: skillVersions.version, publishedAt: skillVersions.publishedAt, createdAt: skillVersions.createdAt, changelog: skillVersions.changelog })
      .from(skillVersions)
      .where(eq(skillVersions.skillId, skill.id))
      .orderBy(desc(skillVersions.createdAt));

    // Agent compatibility
    const agentRows = await db
      .select({ name: agents.name, slug: agents.slug, isLegacy: agents.isLegacy, compatibilityStatus: skillAgents.compatibilityStatus })
      .from(skillAgents)
      .innerJoin(agents, eq(skillAgents.agentId, agents.id))
      .where(eq(skillAgents.skillId, skill.id));

    // Tags
    const tagRows = await db
      .select({ name: tags.name, slug: tags.slug })
      .from(skillTags)
      .innerJoin(tags, eq(skillTags.tagId, tags.id))
      .where(eq(skillTags.skillId, skill.id));

    // Ratings summary
    const [ratingSummary] = await db
      .select({
        avg: sql<number>`round(avg(score)::numeric, 1)`,
        total: count(),
      })
      .from(ratings)
      .where(eq(ratings.targetId, skill.id));

    // Comments (visible + pinned, limit 20, top-level only)
    const commentRows = await db
      .select({
        id: comments.id,
        body: comments.body,
        status: comments.status,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        authorName: users.name,
        authorAvatar: users.avatarUrl,
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.targetId, skill.id))
      .orderBy(desc(comments.createdAt))
      .limit(20);

    // Last security scan
    const [latestScan] = await db
      .select()
      .from(securityScans)
      .where(eq(securityScans.targetId, skill.id))
      .orderBy(desc(securityScans.scannedAt))
      .limit(1);

    // Last validation
    const [latestValidation] = await db
      .select()
      .from(validationResults)
      .where(eq(validationResults.targetId, skill.id))
      .orderBy(desc(validationResults.createdAt))
      .limit(1);

    return NextResponse.json({
      data: {
        ...skill,
        category: categoryData,
        currentVersion,
        versions: allVersions,
        agents: agentRows,
        tags: tagRows,
        ratings: {
          average: ratingSummary?.avg ?? null,
          total: ratingSummary?.total ?? 0,
        },
        comments: commentRows,
        security: latestScan ?? null,
        validation: latestValidation ?? null,
      },
    });
  } catch (error) {
    console.error("[GET /api/skills/[slug]]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
