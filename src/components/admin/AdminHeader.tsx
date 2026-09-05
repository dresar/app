"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function AdminHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
      suppressHydrationWarning
    >
      {/* Left title */}
      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)" }}>
        Admin Panel — skill.id
      </div>

      {/* Right Header Actions: Back to site + Profile Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Back to Public Site link in Header */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-raised)",
            transition: "all var(--transition-fast)",
          }}
        >
          🌐 Kembali ke Situs Publik
        </Link>

        {/* Profile Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              borderRadius: "999px",
              backgroundColor: "rgba(6, 182, 212, 0.15)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              color: "var(--color-primary)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
                color: "#0A0E12",
                fontWeight: "700",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              A
            </div>
            <span>Admin Utama</span>
            <span style={{ fontSize: "10px", marginLeft: "2px" }}>{dropdownOpen ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown Menu Popup */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "230px",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                padding: "8px 0",
                zIndex: 50,
              }}
            >
              {/* User Header in Dropdown */}
              <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--color-text-primary)" }}>
                  Admin Utama
                </div>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "JetBrains Mono, monospace" }}>
                  admin@skillid.dev
                </div>
              </div>

              {/* Links */}
              <div style={{ padding: "4px 0" }}>
                <Link
                  href="/admin/profile"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                  }}
                >
                  👤 Profil Saya & Password
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                  }}
                >
                  ⚙️ Pengaturan Site
                </Link>

                <div style={{ borderTop: "1px solid var(--color-border)", margin: "4px 0" }} />

                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    color: "var(--color-danger)",
                    textDecoration: "none",
                  }}
                >
                  🚪 Keluar (Logout)
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
