"use client";

import { useState } from "react";

export default function AdminGeneratePage() {
  const [activeTab, setActiveTab] = useState<"prompt" | "parser">("prompt");

  // Form State
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [triggers, setTriggers] = useState("");
  const [inScope, setInScope] = useState("");
  const [outOfScope, setOutOfScope] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["claude-code", "cursor"]);

  // Parser State
  const [pastedJson, setPastedJson] = useState("");
  const [parsedSkill, setParsedSkill] = useState<any>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSkillMd, setCopiedSkillMd] = useState(false);
  const [jsonError, setJsonError] = useState("");

  const toggleAgent = (agent: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agent) ? prev.filter((a) => a !== agent) : [...prev, agent]
    );
  };

  // Generate Master System Prompt for External Claude
  const generateMasterPrompt = () => {
    const triggerArray = triggers.split("\n").map((t) => t.trim()).filter(Boolean);
    const inScopeArray = inScope.split("\n").map((s) => s.trim()).filter(Boolean);
    const outOfScopeArray = outOfScope.split("\n").map((s) => s.trim()).filter(Boolean);

    return `Kamu adalah arsitek AI Skill profesional. Hasilkan satu objek JSON valid yang mematuhi Canonical JSON Schema v1.0.0 untuk AI Coding Agents (${selectedAgents.join(", ")}).

NAMA SKILL: ${name || "nama-skill-kamu"}
TUJUAN UTAMA: ${goal || "Tujuan utama penggunaan skill ini."}

TRIGGERS (Kapan skill diaktifkan):
${triggerArray.length > 0 ? triggerArray.map((t) => `- ${t}`).join("\n") : "- Pengguna meminta instruksi spesifik"}

BOUNDARIES IN SCOPE:
${inScopeArray.length > 0 ? inScopeArray.map((s) => `- ${s}`).join("\n") : "- Penanganan utama"}

BOUNDARIES OUT OF SCOPE:
${outOfScopeArray.length > 0 ? outOfScopeArray.map((s) => `- ${s}`).join("\n") : "- Hal di luar scope"}

SYARAT OUTPUT:
HANYA kembalikan JSON mentah tanpa format Markdown blok (tanpa \`\`\`json). Gunakan struktur berikut:
{
  "schemaVersion": "1.0.0",
  "artifactType": "skill",
  "skill": {
    "name": "${name || "nama-skill"}",
    "version": "1.0.0",
    "description": "Deskripsi ringkas dalam Bahasa Indonesia",
    "language": "id-ID",
    "license": "MIT"
  },
  "triggers": [ ${triggerArray.map((t) => `"${t}"`).join(", ") || '"trigger1"'} ],
  "instructions": [
    "Instruksi langkah 1 yang spesifik dan actionable",
    "Instruksi langkah 2",
    "Instruksi langkah 3"
  ],
  "boundaries": {
    "inScope": [ ${inScopeArray.map((s) => `"${s}"`).join(", ") || '"inScope1"'} ],
    "outOfScope": [ ${outOfScopeArray.map((s) => `"${s}"`).join(", ") || '"outOfScope1"'} ]
  },
  "examples": [
    { "title": "Contoh Penggunaan", "input": "Input pengguna", "output": "Output yang diharapkan" }
  ]
}`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generateMasterPrompt());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Format & Parse JSON pasted from Claude
  const handleParseJson = () => {
    setJsonError("");
    setParsedSkill(null);
    try {
      let cleanText = pastedJson.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
      }
      const data = JSON.parse(cleanText);
      setParsedSkill(data);
    } catch (err: any) {
      setJsonError("Format JSON tidak valid! Pastikan kamu menyalin balasan JSON dari Claude dengan benar.");
    }
  };

  // Convert parsed JSON into clean SKILL.md
  const generateSkillMarkdown = () => {
    if (!parsedSkill) return "";
    const sk = parsedSkill.skill || {};
    const trgs = (parsedSkill.triggers as string[]) || [];
    const insts = (parsedSkill.instructions as string[]) || [];
    const bounds = parsedSkill.boundaries || {};

    return `---
name: ${sk.name || name || "my-skill"}
description: ${sk.description || goal || "Description"}
---

# ${sk.name || name || "My Skill"}

## Triggers
${trgs.map((t) => `- ${t}`).join("\n")}

## Instructions
${insts.map((ins, i) => `${i + 1}. ${ins}`).join("\n")}

## Boundaries
### In Scope
${(bounds.inScope || []).map((s: string) => `- ${s}`).join("\n")}

### Out of Scope
${(bounds.outOfScope || []).map((s: string) => `- ${s}`).join("\n")}
`;
  };

  const handleCopySkillMd = () => {
    navigator.clipboard.writeText(generateSkillMarkdown());
    setCopiedSkillMd(true);
    setTimeout(() => setCopiedSkillMd(false), 2000);
  };

  const handleDownloadSkillMd = () => {
    const element = document.createElement("a");
    const file = new Blob([generateSkillMarkdown()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${parsedSkill?.skill?.name || name || "SKILL"}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div suppressHydrationWarning>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "4px" }}>
          ✨ Admin Skill Generator & Prompt Builder
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
          Buat Master Prompt untuk Claude / ChatGPT secara external, lalu rapihkan output JSON balasan dari Claude menjadi file SKILL.md.
        </p>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => setActiveTab("prompt")}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            border: activeTab === "prompt" ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
            backgroundColor: activeTab === "prompt" ? "rgba(6, 182, 212, 0.15)" : "var(--color-surface)",
            color: activeTab === "prompt" ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          1. Buat & Salin Prompt Claude
        </button>
        <button
          onClick={() => setActiveTab("parser")}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-sm)",
            border: activeTab === "parser" ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
            backgroundColor: activeTab === "parser" ? "rgba(6, 182, 212, 0.15)" : "var(--color-surface)",
            color: activeTab === "parser" ? "var(--color-primary)" : "var(--color-text-secondary)",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          2. Rapihkan Output JSON ke SKILL.md
        </button>
      </div>

      {/* TAB 1: FORM & PROMPT GENERATOR */}
      {activeTab === "prompt" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Form Input */}
          <div className="card-surface" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: "var(--color-primary)" }}>
              Isi Spesifikasi Skill
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Nama Skill / Slug *
                </label>
                <input
                  type="text"
                  placeholder="nextjs-error-boundary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Tujuan Utama Skill *
                </label>
                <textarea
                  rows={3}
                  placeholder="Menyiapkan error boundary dan halaman error kustom..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Triggers (1 baris per trigger)
                </label>
                <textarea
                  rows={3}
                  placeholder="Pengguna menyebut error.tsx&#10;Menangani exception di Next.js"
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-primary)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                  Agent Target
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["claude-code", "cursor", "antigravity", "codex-cli"].map((ag) => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => toggleAgent(ag)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "11px",
                        border: selectedAgents.includes(ag) ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                        backgroundColor: selectedAgents.includes(ag) ? "rgba(6, 182, 212, 0.15)" : "transparent",
                        color: selectedAgents.includes(ag) ? "var(--color-primary)" : "var(--color-text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      {ag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Master Prompt Output */}
          <div className="card-surface" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "var(--color-primary)" }}>
                Master Prompt (Claude External)
              </h2>
              <button
                onClick={handleCopyPrompt}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: copiedPrompt ? "var(--color-success)" : "var(--color-primary)",
                  color: "#0A0E12",
                  fontWeight: "700",
                  fontSize: "12px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {copiedPrompt ? "✓ Tersalin!" : "📋 Salin Prompt"}
              </button>
            </div>

            <pre
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-surface-raised)",
                border: "1px solid var(--color-border)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "12px",
                lineHeight: "1.6",
                color: "var(--color-text-primary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowY: "auto",
                maxHeight: "420px",
              }}
            >
              {generateMasterPrompt()}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: PASTE JSON & CONVERT TO SKILL.MD */}
      {activeTab === "parser" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card-surface" style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "var(--color-primary)" }}>
              Tempel Output JSON dari Claude
            </h2>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "16px" }}>
              Tempel balasan JSON mentah yang kamu dapatkan dari Claude / ChatGPT di bawah ini.
            </p>

            <textarea
              rows={8}
              placeholder='{ "schemaVersion": "1.0.0", "artifactType": "skill", "skill": { "name": "..." }, ... }'
              value={pastedJson}
              onChange={(e) => setPastedJson(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-raised)",
                color: "var(--color-text-primary)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "13px",
                outline: "none",
                marginBottom: "16px",
              }}
            />

            {jsonError && (
              <div style={{ color: "var(--color-danger)", fontSize: "13px", marginBottom: "14px" }}>
                ⚠️ {jsonError}
              </div>
            )}

            <button
              onClick={handleParseJson}
              style={{
                padding: "12px 24px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-primary)",
                color: "#0A0E12",
                fontWeight: "700",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              ⚡ Validasi & Formating SKILL.md
            </button>
          </div>

          {/* Rendered SKILL.md Preview */}
          {parsedSkill && (
            <div className="card-surface" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-success)" }}>
                  ✓ Format SKILL.md Siap Pakai
                </h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleCopySkillMd}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: copiedSkillMd ? "var(--color-success)" : "var(--color-primary)",
                      color: "#0A0E12",
                      fontWeight: "700",
                      fontSize: "13px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {copiedSkillMd ? "✓ Tersalin!" : "📋 Salin SKILL.md"}
                  </button>
                  <button
                    onClick={handleDownloadSkillMd}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface-raised)",
                      color: "var(--color-text-primary)",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    📥 Unduh SKILL.md
                  </button>
                </div>
              </div>

              <pre
                style={{
                  padding: "20px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--color-surface-raised)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "13px",
                  lineHeight: "1.7",
                  color: "var(--color-text-primary)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {generateSkillMarkdown()}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
