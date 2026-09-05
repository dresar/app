// API Route: GET /api/stats
// Statistik publik platform

import { NextResponse } from "next/server";
import { db } from "@/db";
import { skills, prds, workflows, agentKits, users, downloads, generations } from "@/db/schema";
import { eq, sql, count } from "drizzle-orm";

export async function GET() {
  try {
    const [skillStats] = await db
      .select({
        total: count(),
        published: sql<number>`count(*) filter (where status = 'published')::int`,
      })
      .from(skills);

    const [prdStats] = await db.select({ total: count() }).from(prds).where(eq(prds.status, "published"));
    const [wfStats] = await db.select({ total: count() }).from(workflows).where(eq(workflows.status, "published"));
    const [akStats] = await db.select({ total: count() }).from(agentKits).where(eq(agentKits.status, "published"));
    const [userStats] = await db.select({ total: count() }).from(users);
    const [genStats] = await db.select({ total: count() }).from(generations);

    const [downloadStats] = await db
      .select({ total: sql<number>`sum(download_count)::int` })
      .from(skills);

    return NextResponse.json({
      data: {
        skills: {
          total: skillStats.total,
          published: skillStats.published,
        },
        prds: prdStats.total,
        workflows: wfStats.total,
        agentKits: akStats.total,
        users: userStats.total,
        generations: genStats.total,
        totalDownloads: downloadStats.total ?? 0,
      },
    });
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
