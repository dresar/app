// API Route: POST /api/auth/register
// Pendaftaran akun pengguna baru ke database Neon PostgreSQL

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

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nama, email, dan password wajib diisi" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Insert new user
    const [newUser] = await db
      .insert(users)
      .values({
        email: cleanEmail,
        passwordHash: hashPassword(password),
        name: name.trim(),
        avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: users.id, email: users.email, name: users.name });

    // Assign default role 'user'
    await db.insert(userRoles).values({
      userId: newUser.id,
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Gagal membuat akun" }, { status: 500 });
  }
}
