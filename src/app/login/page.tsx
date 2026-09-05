"use client";

import { useState } from "react";
import Link from "next/link";
import { TopNav, BottomNav } from "@/components/layout/Navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: json.message || "Berhasil!" });

        if (mode === "login") {
          setTimeout(() => {
            if (json.user?.role === "admin" || json.user?.role === "superadmin") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/profile";
            }
          }, 800);
        } else {
          setMode("login");
          setMessage({ type: "success", text: "Akun berhasil dibuat! Silakan login." });
        }
      } else {
        setMessage({ type: "error", text: json.error || "Gagal memproses permintaan." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "64px", paddingBottom: "80px", minHeight: "100vh" }} suppressHydrationWarning>
        <div className="container-main" style={{ paddingTop: "60px", maxWidth: "440px" }}>
          <div className="card-surface" style={{ padding: "36px", borderRadius: "var(--radius-md)" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔐</div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "6px" }}>
                {mode === "login" ? "Masuk ke skill.id" : "Daftar Akun Baru"}
              </h1>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
                {mode === "login"
                  ? "Masukan email dan password kamu untuk mengakses platform."
                  : "Buat akun pengguna untuk menyimpan dan membuat skill."}
              </p>
            </div>

            {message && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  marginBottom: "20px",
                  backgroundColor: message.type === "success" ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                  color: message.type === "success" ? "var(--color-success)" : "var(--color-danger)",
                  border: message.type === "success" ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(248, 113, 113, 0.3)",
                }}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {mode === "register" && (
                <div>
                  <label htmlFor="reg-name" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    Nama Lengkap *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Dimas Pratama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface-raised)",
                      color: "var(--color-text-primary)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Alamat Email *
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="admin@skillid.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-raised)",
                    color: "var(--color-text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label htmlFor="auth-password" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Kata Sandi *
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-raised)",
                    color: "var(--color-text-primary)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--color-primary)",
                  color: "#0A0E12",
                  fontWeight: "700",
                  fontSize: "15px",
                  border: "none",
                  cursor: "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Memproses..." : mode === "login" ? "Masuk Ke Akun" : "Daftar Akun"}
              </button>
            </form>

            {/* Account toggle */}
            <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--color-text-muted)" }}>
              {mode === "login" ? (
                <>
                  Belum punya akun?{" "}
                  <button
                    onClick={() => { setMode("register"); setMessage(null); }}
                    style={{ background: "none", border: "none", color: "var(--color-primary)", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Daftar Sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button
                    onClick={() => { setMode("login"); setMessage(null); }}
                    style={{ background: "none", border: "none", color: "var(--color-primary)", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Masuk di Sini
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
