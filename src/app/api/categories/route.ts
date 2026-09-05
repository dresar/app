// API Route: GET /api/categories
// Semua kategori dengan count skill per kategori

import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, skills } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
        description: categories.description,
        icon: categories.icon,
        skillCount: sql<number>`count(${skills.id}) filter (where ${skills.status} = 'published')::int`,
      })
      .from(categories)
      .leftJoin(skills, eq(skills.categoryId, categories.id))
      .groupBy(categories.id, categories.slug, categories.name, categories.description, categories.icon)
      .orderBy(categories.name);

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
