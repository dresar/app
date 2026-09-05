"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile?email=admin@skillid.dev");
        if (res.ok) {
          const json = await res.json();
          setUser(json.data);
          setName(json.data.name || "");
          setEmail(json.data.email || "");
          setAvatarUrl(json.data.avatarUrl || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name,
          email,
          avatarUrl,
          oldPassword: oldPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: json.message || "Profil berhasil diperbarui!" });
        setOldPassword("");
        setNewPassword("");
      } else {
        setMessage({ type: "error", text: json.error || "Gagal meng-update profil." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi server." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div suppressHydrationWarning>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "4px" }}>
          👤 Profil Admin & Keamanan Akun
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
          Kelola username, email, kata sandi, dan foto profil akun administrator kamu.
        </p>
      </div>

      <div className="card-surface" style={{ padding: "32px", maxWidth: "680px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
            Memuat data profil...
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            {message && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: message.type === "success" ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                  color: message.type === "success" ? "var(--color-success)" : "var(--color-danger)",
                  border: message.type === "success" ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(248, 113, 113, 0.3)",
                  fontSize: "14px",
                  marginBottom: "24px",
                }}
              >
                {message.text}
              </div>
            )}

            {/* Avatar & Role Preview */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid var(--color-border)" }}>
              <img
                src={avatarUrl || "https://api.dicebear.com/9.x/initials/svg?seed=Admin"}
                alt="Avatar"
                style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid var(--color-primary)" }}
              />
              <div>
                <div style={{ fontWeight: "700", fontSize: "18px" }}>{name || "Admin Utama"}</div>
                <div style={{ fontSize: "13px", color: "var(--color-text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{email}</div>
                <div style={{ marginTop: "6px" }}>
                  <span style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", backgroundColor: "rgba(6, 182, 212, 0.15)", color: "var(--color-primary)", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                    ROLE: {(user?.role || "superadmin").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Information */}
            <h2 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
              Informasi Utama Admin
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              <div>
                <label htmlFor="user-name" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Nama Lengkap / Username *
                </label>
                <input
                  id="user-name"
                  type="text"
                  required
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

              <div>
                <label htmlFor="user-email" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Alamat Email *
                </label>
                <input
                  id="user-email"
                  type="email"
                  required
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
                <label htmlFor="user-avatar" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  URL Gambar Avatar
                </label>
                <input
                  id="user-avatar"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
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
            </div>

            {/* Section 2: Password Security */}
            <h2 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
              Ubah Password Admin
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              <div>
                <label htmlFor="old-password" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Password Lama
                </label>
                <input
                  id="old-password"
                  type="password"
                  placeholder="Masukkan password lama saat ini"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
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
                <label htmlFor="new-password" style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Password Baru
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-primary)",
                color: "#0A0E12",
                fontWeight: "700",
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Memproses..." : "💾 Simpan Perubahan Profil Admin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
