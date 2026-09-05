"use client";

import { useState } from "react";

const auditLogs = [
  { id: "1", action: "skill.publish", actor: "admin@skillid.dev", target: "nextjs-error-boundary-setup", date: "8 Ags 2026 14:20" },
  { id: "2", action: "skill.publish", actor: "admin@skillid.dev", target: "drizzle-orm-postgresql-setup", date: "8 Ags 2026 14:18" },
  { id: "3", action: "user.role_change", actor: "superadmin@skillid.dev", target: "moderator@skillid.dev", date: "8 Ags 2026 14:15" },
  { id: "4", action: "platform.seed", actor: "system", target: "33 tables migrated", date: "8 Ags 2026 14:10" },
];

export default function AdminAuditLogsPage() {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "4px" }}>
          Audit Logs
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
          Catatan riwayat semua tindakan penting di platform untuk keperluan keamanan dan pertanggungjawaban.
        </p>
      </div>

      <div className="card-surface" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-muted)" }}>
              <th style={{ padding: "12px 16px" }}>ACTION</th>
              <th style={{ padding: "12px 16px" }}>ACTOR</th>
              <th style={{ padding: "12px 16px" }}>TARGET</th>
              <th style={{ padding: "12px 16px" }}>WAKTU</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "12px 16px", fontFamily: "JetBrains Mono, monospace", color: "var(--color-primary)", fontWeight: "600" }}>
                  {log.action}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-primary)" }}>{log.actor}</td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)" }}>{log.target}</td>
                <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
