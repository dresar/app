// API Route: GET & PUT /api/user/profile
// Mengambil dan memperbarui data profil (nama, email, avatar, password) pengguna

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userRoles } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256").update(password + salt).digest("hex");
  return `sha256$${salt}$${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  if (storedHash.startsWith("sha256$")) {
    const parts = storedHash.split("$");
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const expectedHash = parts[2];
    const actualHash = crypto.createHash("sha256").update(password + salt).digest("hex");
    return expectedHash === actualHash;
  }
  return password === storedHash;
}

// GET /api/user/profile?email=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "admin@skillid.dev";

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    const [roleRow] = await db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, user.id))
      .limit(1);

    return NextResponse.json({
      data: {
        ...user,
        role: roleRow?.role || "user",
      },
    });
  } catch (error) {
    console.error("[GET /api/user/profile]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, email, avatarUrl, oldPassword, newPassword } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId wajib disertakan" }, { status: 400 });
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (avatarUrl) updateData.avatarUrl = avatarUrl.trim();

    // Change Password handling
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
      }

      if (existingUser.passwordHash && oldPassword) {
        const isValid = verifyPassword(oldPassword, existingUser.passwordHash);
        if (!isValid) {
          return NextResponse.json({ error: "Password lama tidak cocok" }, { status: 400 });
        }
      }

      updateData.passwordHash = hashPassword(newPassword);
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: "Profil pengguna berhasil diperbarui!",
    });
  } catch (error) {
    console.error("[PUT /api/user/profile]", error);
    return NextResponse.json({ error: "Gagal meng-update profil" }, { status: 500 });
  }
}
