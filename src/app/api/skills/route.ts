// API Route: GET /api/skills
// Mengembalikan daftar skills dari database dengan filter & pagination

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills, skillVersions, categories, skillAgents, agents, skillTags, tags } from "@/db/schema";
import { eq, and, ilike, inArray, desc, sql, isNotNull } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q          = searchParams.get("q") ?? "";
    const status     = searchParams.get("status") ?? "published";
    const category   = searchParams.get("category") ?? "";
    const agentSlug  = searchParams.get("agent") ?? "";
    const sort       = searchParams.get("sort") ?? "newest";
    const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit      = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const offset     = (page - 1) * limit;

    // Base conditions
    const conditions: ReturnType<typeof eq>[] = [];

    // Status filter
    if (status && status !== "all") {
      conditions.push(eq(skills.status, status as any));
    }

    // Category filter
    if (category) {
      const catRow = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);
      if (catRow.length > 0) {
        conditions.push(eq(skills.categoryId, catRow[0].id));
      }
    }

    // Agent filter — cari skill yang punya agent dengan slug yg sesuai
    let agentFilterSkillIds: string[] | null = null;
    if (agentSlug) {
      const agentRow = await db
        .select({ id: agents.id })
        .from(agents)
        .where(eq(agents.slug, agentSlug))
        .limit(1);

      if (agentRow.length > 0) {
        const rows = await db
          .select({ skillId: skillAgents.skillId })
          .from(skillAgents)
          .where(eq(skillAgents.agentId, agentRow[0].id));
        agentFilterSkillIds = rows.map(r => r.skillId);
        if (agentFilterSkillIds.length === 0) {
          return NextResponse.json({ data: [], meta: { total: 0, page, limit, totalPages: 0 } });
        }
      }
    }

    if (agentFilterSkillIds !== null) {
      conditions.push(inArray(skills.id, agentFilterSkillIds));
    }

    // Full-text search via ILIKE (simple, nanti bisa upgrade ke tsvector)
    if (q.trim()) {
      conditions.push(ilike(skills.name, `%${q.trim()}%`));
    }

    // Count total
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Sort
    const orderBy = sort === "downloads"
      ? desc(skills.downloadCount)
      : sort === "quality"
      ? desc(skills.qualityScore)
      : desc(skills.createdAt);

    // Fetch skills
    const rows = await db
      .select({
        id: skills.id,
        slug: skills.slug,
        name: skills.name,
        description: skills.description,
        status: skills.status,
        qualityScore: skills.qualityScore,
        securityScore: skills.securityScore,
        downloadCount: skills.downloadCount,
        createdAt: skills.createdAt,
        updatedAt: skills.updatedAt,
        categoryId: skills.categoryId,
      })
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Enrich dengan category name + agents + tags
    const enriched = await Promise.all(
      rows.map(async (skill) => {
        // Category
        let categoryName: string | null = null;
        if (skill.categoryId) {
          const catRow = await db.select({ name: categories.name, slug: categories.slug }).from(categories).where(eq(categories.id, skill.categoryId)).limit(1);
          if (catRow.length > 0) categoryName = catRow[0].name;
        }

        // Agents
        const agentRows = await db
          .select({ name: agents.name, slug: agents.slug })
          .from(skillAgents)
          .innerJoin(agents, eq(skillAgents.agentId, agents.id))
          .where(eq(skillAgents.skillId, skill.id));

        // Tags
        const tagRows = await db
          .select({ name: tags.name, slug: tags.slug })
          .from(skillTags)
          .innerJoin(tags, eq(skillTags.tagId, tags.id))
          .where(eq(skillTags.skillId, skill.id));

        return {
          ...skill,
          category: categoryName,
          agents: agentRows,
          tags: tagRows,
        };
      })
    );

    return NextResponse.json({
      data: enriched,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/skills]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
