import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Skill Factory Indonesia",
    template: "%s | AI Skill Factory Indonesia",
  },
  description:
    "Platform open-source berbahasa Indonesia untuk menemukan, membuat, memvalidasi, dan menggunakan AI coding skills, PRD, workflow, dan Agent Kit untuk AI coding agent modern.",
  keywords: [
    "AI skill",
    "coding agent",
    "Claude Code",
    "Cursor",
    "Antigravity",
    "skill Indonesia",
    "AI coding",
    "developer Indonesia",
  ],
  authors: [{ name: "AI Skill Factory Indonesia" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "AI Skill Factory Indonesia",
    title: "AI Skill Factory Indonesia",
    description:
      "Platform open-source berbahasa Indonesia untuk menemukan, membuat, memvalidasi, dan menggunakan AI coding skills.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skill Factory Indonesia",
    description:
      "Platform open-source berbahasa Indonesia untuk AI coding skills.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
