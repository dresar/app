"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SkillItem {
  id: string;
  slug: string;
  name: string;
  status: string;
  qualityScore: number | null;
  securityScore: number | null;
  downloadCount: number;
  updatedAt: string;
  categoryName: string | null;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const url = filterStatus === "all" ? "/api/admin/skills" : `/api/admin/skills?status=${filterStatus}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setSkills(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/skills", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchSkills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "4px" }}>
            Kelola Skills
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Daftar semua skill di database. Moderator & admin dapat menyetujui, memublikasikan, atau menolak skill.
          </p>
        </div>

        <Link
          href="/admin/generate"
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-primary)",
            color: "#0A0E12",
            fontWeight: "700",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          ✨ Generate Skill Baru
        </Link>
      </div>

      {/* Filter Status */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["all", "published", "review", "draft", "approved", "rejected"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
              border: filterStatus === st ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
              backgroundColor: filterStatus === st ? "rgba(6, 182, 212, 0.15)" : "var(--color-surface)",
              color: filterStatus === st ? "var(--color-primary)" : "var(--color-text-secondary)",
              cursor: "pointer",
            }}
          >
            {st.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-surface" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-muted)" }}>
              <th style={{ padding: "12px 16px" }}>SKILL</th>
              <th style={{ padding: "12px 16px" }}>KATEGORI</th>
              <th style={{ padding: "12px 16px" }}>STATUS</th>
              <th style={{ padding: "12px 16px" }}>SCORES</th>
              <th style={{ padding: "12px 16px" }}>DOWNLOADS</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
                  Memuat data skills...
                </td>
              </tr>
            ) : skills.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
                  Tidak ada skill untuk filter status ini.
                </td>
              </tr>
            ) : (
              skills.map((skill) => (
                <tr key={skill.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: "600", color: "var(--color-text-primary)", fontFamily: "JetBrains Mono, monospace" }}>
                      {skill.slug}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{skill.name}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)" }}>
                    {skill.categoryName || "-"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`badge-${skill.status}`} style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>
                      {skill.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: "var(--color-success)", fontWeight: "600" }}>Q:{skill.qualityScore ?? "-"}</span>{" "}
                    <span style={{ color: "var(--color-primary)", fontWeight: "600" }}>S:{skill.securityScore ?? "-"}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)" }}>
                    {skill.downloadCount}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      {skill.status !== "published" && (
                        <button
                          onClick={() => handleUpdateStatus(skill.id, "published")}
                          style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(6, 182, 212, 0.15)", color: "var(--color-primary)", border: "1px solid rgba(6, 182, 212, 0.3)", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                        >
                          Publish
                        </button>
                      )}
                      {skill.status === "review" && (
                        <button
                          onClick={() => handleUpdateStatus(skill.id, "approved")}
                          style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(52, 211, 153, 0.15)", color: "var(--color-success)", border: "1px solid rgba(52, 211, 153, 0.3)", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                        >
                          Approve
                        </button>
                      )}
                      <Link
                        href={`/skills/${skill.slug}`}
                        style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", fontSize: "11px", textDecoration: "none" }}
                      >
                        Preview
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
