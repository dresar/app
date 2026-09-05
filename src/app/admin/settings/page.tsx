"use client";

export default function AdminSettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "4px" }}>
          Pengaturan Platform
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
          Pengaturan global site_settings di Neon database.
        </p>
      </div>

      <div className="card-surface" style={{ padding: "32px", maxWidth: "700px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
              Nama Platform
            </label>
            <input
              type="text"
              defaultValue="AI Skill Factory Indonesia"
              style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
              Quality Score Minimum untuk Publish (0–100)
            </label>
            <input
              type="number"
              defaultValue={70}
              style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
              Security Score Minimum untuk Publish (0–100)
            </label>
            <input
              type="number"
              defaultValue={60}
              style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)" }}
            />
          </div>

          <button style={{ padding: "12px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-primary)", color: "#0A0E12", fontWeight: "700", border: "none", cursor: "pointer", marginTop: "12px" }}>
            💾 Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
