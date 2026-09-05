// API Route: GET/PATCH/DELETE /api/admin/users
// Admin: kelola pengguna (list, edit role/status/password, hapus)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userRoles } from "@/db/schema";
import { eq, desc, ilike, sql } from "drizzle-orm";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(password + salt).digest("hex");
  return `sha256$${salt}$${hash}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q     = searchParams.get("q") ?? "";
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
    const offset = (page - 1) * limit;

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        role: sql<string>`coalesce((select role from user_roles where user_id = ${users.id} order by created_at desc limit 1), 'user')`,
      })
      .from(users)
      .where(q ? ilike(users.name, `%${q}%`) : undefined)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(users)
      .where(q ? ilike(users.name, `%${q}%`) : undefined);

    return NextResponse.json({
      data: rows,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/admin/users]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/admin/users — Admin edit user details, role, status, or reset password
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, email, role, status, newPassword } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId wajib disertakan" }, { status: 400 });
    }

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (name) updateFields.name = name.trim();
    if (email) updateFields.email = email.trim().toLowerCase();
    if (status) updateFields.status = status;
    if (newPassword && newPassword.length >= 6) {
      updateFields.passwordHash = hashPassword(newPassword);
    }

    await db.update(users).set(updateFields).where(eq(users.id, userId));

    // Update role if provided
    if (role) {
      // Check existing role
      const [existingRole] = await db
        .select()
        .from(userRoles)
        .where(eq(userRoles.userId, userId))
        .limit(1);

      if (existingRole) {
        await db.update(userRoles).set({ role }).where(eq(userRoles.userId, userId));
      } else {
        await db.insert(userRoles).values({ userId, role, createdAt: new Date() });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data pengguna berhasil diperbarui oleh admin!",
    });
  } catch (error) {
    console.error("[PATCH /api/admin/users]", error);
    return NextResponse.json({ error: "Gagal memperbarui pengguna" }, { status: 500 });
  }
}

// DELETE /api/admin/users
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId wajib disertakan" }, { status: 400 });
    }

    // Delete user roles first
    await db.delete(userRoles).where(eq(userRoles.userId, userId));
    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus" });
  } catch (error) {
    console.error("[DELETE /api/admin/users]", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna" }, { status: 500 });
  }
}
