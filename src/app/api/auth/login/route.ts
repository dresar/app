// API Route: POST /api/auth/login
// Verifikasi kredensial email & password dengan database Neon PostgreSQL

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userRoles } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

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
  // Plain text fallback (development)
  return password === storedHash;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Get user role
    const [roleRow] = await db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, user.id))
      .limit(1);

    const userRole = roleRow?.role || "user";

    // Set simple session cookie (production-ready)
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: userRole,
      },
    });

    // Cookie expiration (7 days)
    response.cookies.set("skill_session", JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: userRole,
    }), {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat login" }, { status: 500 });
  }
}
