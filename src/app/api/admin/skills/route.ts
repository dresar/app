// API Route: GET/POST /api/admin/skills
// Admin: list skills dengan semua status (termasuk draft)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills, categories, skillVersions } from "@/db/schema";
import { eq, desc, ilike, sql, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q      = searchParams.get("q") ?? "";
    const status = searchParams.get("status") ?? "";
    const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit  = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
    const offset = (page - 1) * limit;

    const conditions = [];
    if (q) conditions.push(ilike(skills.name, `%${q}%`));
    if (status) conditions.push(eq(skills.status, status as any));

    const rows = await db
      .select({
        id: skills.id,
        slug: skills.slug,
        name: skills.name,
        status: skills.status,
        qualityScore: skills.qualityScore,
        securityScore: skills.securityScore,
        downloadCount: skills.downloadCount,
        createdAt: skills.createdAt,
        updatedAt: skills.updatedAt,
        categoryId: skills.categoryId,
        ownerId: skills.ownerId,
        currentVersionId: skills.currentVersionId,
      })
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(skills.updatedAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Enrich dengan category name
    const enriched = await Promise.all(
      rows.map(async (s) => {
        let catName: string | null = null;
        if (s.categoryId) {
          const [cat] = await db.select({ name: categories.name }).from(categories).where(eq(categories.id, s.categoryId)).limit(1);
          catName = cat?.name ?? null;
        }
        return { ...s, categoryName: catName };
      })
    );

    return NextResponse.json({
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/admin/skills]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/admin/skills — update status skill (approve, publish, reject, dll)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id dan status diperlukan" }, { status: 400 });
    }

    const validStatuses = ["draft", "review", "approved", "published", "archived", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    await db.update(skills).set({ status, updatedAt: new Date() }).where(eq(skills.id, id));

    return NextResponse.json({ success: true, message: `Skill status diubah ke '${status}'` });
  } catch (error) {
    console.error("[PATCH /api/admin/skills]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
