"use client";

import { useEffect, useState } from "react";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Edit Modal Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editStatus, setEditStatus] = useState("active");
  const [editPassword, setEditPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "user");
    setEditStatus(user.status || "active");
    setEditPassword("");
    setMessage(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editName,
          email: editEmail,
          role: editRole,
          status: editStatus,
          newPassword: editPassword || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Data pengguna berhasil diperbarui!" });
        setTimeout(() => {
          setEditingUser(null);
          fetchUsers();
        }, 1000);
      } else {
        setMessage({ type: "error", text: json.error || "Gagal memperbarui pengguna." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Kesalahan server." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Apakah kamu yakin ingin menghapus pengguna ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div suppressHydrationWarning>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "4px" }}>
            Kelola Pengguna & Role
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Daftar pengguna terdaftar, edit peran akses (user, moderator, admin, superadmin), dan reset kata sandi.
          </p>
        </div>
      </div>

      <div className="card-surface" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-muted)" }}>
              <th style={{ padding: "12px 16px" }}>PENGGUNA</th>
              <th style={{ padding: "12px 16px" }}>EMAIL</th>
              <th style={{ padding: "12px 16px" }}>ROLE</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px" }}>TERDAFTAR</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
                  Memuat data pengguna...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: "600", color: "var(--color-text-primary)" }}>
                    {u.name}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono, monospace", color: "var(--color-text-secondary)" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", backgroundColor: (u.role === "superadmin" || u.role === "admin") ? "rgba(6, 182, 212, 0.15)" : "var(--color-surface-raised)", color: (u.role === "superadmin" || u.role === "admin") ? "var(--color-primary)" : "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                      {(u.role || "user").toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: u.status === "suspended" ? "var(--color-danger)" : "var(--color-success)", fontWeight: "600" }}>● {u.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>
                    {new Date(u.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "rgba(6, 182, 212, 0.15)",
                          color: "var(--color-primary)",
                          border: "1px solid rgba(6, 182, 212, 0.3)",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Edit User
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "rgba(248, 113, 113, 0.15)",
                          color: "var(--color-danger)",
                          border: "1px solid rgba(248, 113, 113, 0.3)",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL DIALOG */}
      {editingUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div className="card-surface" style={{ width: "100%", maxWidth: "500px", padding: "28px", borderRadius: "var(--radius-md)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
              Edit Pengguna: {editingUser.email}
            </h2>

            {message && (
              <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", fontSize: "13px", marginBottom: "16px", backgroundColor: message.type === "success" ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)", color: message.type === "success" ? "var(--color-success)" : "var(--color-danger)" }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Nama Lengkap / Username
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Role Peran Akses
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                >
                  <option value="user">User Biasa</option>
                  <option value="moderator">Moderator Konten</option>
                  <option value="admin">Administrator</option>
                  <option value="superadmin">Super Administrator</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Status Akun
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                >
                  <option value="active">Active (Aktif)</option>
                  <option value="suspended">Suspended (Ditangguhkan)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Reset Password Baru (Kosongkan jika tidak diubah)
                </label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "transparent", color: "var(--color-text-secondary)", fontSize: "13px", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: "8px 18px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-primary)", color: "#0A0E12", fontWeight: "700", fontSize: "13px", border: "none", cursor: "pointer" }}
                >
                  {saving ? "Memproses..." : "💾 Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
