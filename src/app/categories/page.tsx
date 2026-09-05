import { TopNav, BottomNav } from "@/components/layout/Navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BorderGlowWrapper as BorderGlow } from "@/components/visual/BorderGlowWrapper";

export const metadata: Metadata = {
  title: "Daftar Kategori",
  description: "Jelajahi AI coding skills berdasarkan kategori teknologi.",
};

async function getCategories() {
  try {
    const res = await fetch("http://localhost:3000/api/categories", { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <TopNav />
      <main style={{ paddingTop: "80px", paddingBottom: "80px", minHeight: "100vh" }}>
        <div style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "rgba(18, 24, 31, 0.4)", backdropFilter: "blur(12px)" }}>
          <div className="container-main" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--color-primary)", letterSpacing: "0.1em" }}>
              SKILL CATEGORIES
            </span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginTop: "4px", marginBottom: "12px" }}>
              Kategori Skill Utama
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "16px", maxWidth: "600px" }}>
              Temukan skill yang tervalidasi dan relevan dengan stack serta teknologi yang kamu gunakan.
            </p>
          </div>
        </div>

        <div className="container-main" style={{ paddingTop: "40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {categories.map((cat: any) => (
              <Link key={cat.slug} href={`/skills?category=${cat.slug}`} style={{ textDecoration: "none" }}>
                <BorderGlow borderRadius={16} glowRadius={35} glowColor="187 92 43" style={{ height: "100%" }}>
                  <div style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                      <span style={{ fontSize: "32px" }}>{cat.icon || "📁"}</span>
                      <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "999px", backgroundColor: "rgba(6, 182, 212, 0.15)", color: "var(--color-primary)", fontWeight: "600", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                        {cat.skillCount ?? 0} skill
                      </span>
                    </div>
                    <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px", color: "var(--color-text-primary)" }}>
                      {cat.name}
                    </h2>
                    <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6", flex: 1 }}>
                      {cat.description}
                    </p>
                  </div>
                </BorderGlow>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
