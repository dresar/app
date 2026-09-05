import { TopNav, BottomNav } from "@/components/layout/Navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pencarian Lintas Konten",
  description: "Cari AI coding skill, PRD, workflow, dan Agent Kit di seluruh platform.",
};

interface PageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", type = "all" } = await searchParams;

  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "64px", paddingBottom: "80px", minHeight: "100vh" }}>
        <div style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}>
          <div className="container-main" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "16px" }}>
              Pencarian Platform
            </h1>
            <form action="/search" method="GET" style={{ maxWidth: "600px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Cari skill, PRD, workflow, agent kit..."
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-text-primary)",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-primary)",
                    color: "#0A0E12",
                    fontWeight: "700",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: "32px" }}>
          {q ? (
            <div>
              <p style={{ color: "var(--color-text-muted)", fontSize: "14px", marginBottom: "20px" }}>
                Menampilkan hasil untuk "<strong style={{ color: "var(--color-text-primary)" }}>{q}</strong>"
              </p>
              <div className="card-surface" style={{ padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                  Hasil Pencarian
                </h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
                  Gunakan filter di Skill Library untuk mempersempit hasil pencarian.
                </p>
                <Link
                  href={`/skills?q=${encodeURIComponent(q)}`}
                  style={{
                    display: "inline-block",
                    marginTop: "16px",
                    padding: "8px 20px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--color-primary)",
                    color: "#0A0E12",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Lihat Hasil di Skill Library →
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-text-muted)" }}>
              Masukkan kata kunci pencarian di atas.
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
