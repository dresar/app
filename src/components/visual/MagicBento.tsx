"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import "./MagicBento.css";

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "6, 182, 212";

export interface MagicBentoItem {
  slug: string;
  icon: string;
  title: string;
  description: string;
  label: string;
  badge?: string;
}

export interface MagicBentoProps {
  items?: MagicBentoItem[];
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  className?: string;
}

const defaultCardData: MagicBentoItem[] = [
  {
    slug: "framework-nextjs",
    icon: "⚡",
    title: "Next.js 16 & App Router",
    description: "Server Actions, Dynamic Routing, SSR Boundaries & Error Handling",
    label: "FRAMEWORK",
    badge: "Populer",
  },
  {
    slug: "database-postgresql",
    icon: "🐘",
    title: "PostgreSQL & Drizzle ORM",
    description: "Schema validation, migration pipelines, & Neon Serverless DB integration",
    label: "DATABASE",
    badge: "Essential",
  },
  {
    slug: "ai-integration",
    icon: "🤖",
    title: "Vercel AI SDK & LLM Chat",
    description: "Streaming responses, prompt templates & agentic chat completion hooks",
    label: "AI CORE",
    badge: "Trending",
  },
  {
    slug: "testing-e2e",
    icon: "🎭",
    title: "Testing Automation",
    description: "Playwright E2E suites & Vitest unit testing for high-reliability code",
    label: "QUALITY",
  },
  {
    slug: "devops-docker",
    icon: "🐳",
    title: "Docker & GitHub Actions",
    description: "Production Dockerfile compose & GitHub Actions CI/CD deployment pipelines",
    label: "DEVOPS",
  },
  {
    slug: "security-audit",
    icon: "🛡️",
    title: "Security & Zod Schemas",
    description: "Rigorous input sanitization, JWT auth & 20+ automated vulnerability checks",
    label: "SECURITY",
  },
];

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

export default function MagicBento({
  items = defaultCardData,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  className = "",
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  // Global spotlight cursor following effect
  useEffect(() => {
    if (disableAnimations || !gridRef.current || !enableSpotlight) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: absolute;
      width: ${spotlightRadius * 2}px;
      height: ${spotlightRadius * 2}px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, rgba(${glowColor}, 0.05) 40%, transparent 70%);
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 10;
    `;

    gridRef.current.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current || !spotlightRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlightRef.current.style.left = `${x}px`;
      spotlightRef.current.style.top = `${y}px`;
      spotlightRef.current.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = "0";
      }
    };

    const gridEl = gridRef.current;
    gridEl.addEventListener("mousemove", handleMouseMove);
    gridEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      gridEl.removeEventListener("mousemove", handleMouseMove);
      gridEl.removeEventListener("mouseleave", handleMouseLeave);
      spotlight.remove();
    };
  }, [disableAnimations, enableSpotlight, spotlightRadius, glowColor]);

  return (
    <div ref={gridRef} className={`magic-bento-grid ${className}`.trim()}>
      {items.map((item, idx) => (
        <MagicBentoCard
          key={item.slug}
          item={item}
          enableStars={enableStars}
          enableBorderGlow={enableBorderGlow}
          disableAnimations={disableAnimations}
          particleCount={particleCount}
          glowColor={glowColor}
          enableTilt={enableTilt}
          clickEffect={clickEffect}
          enableMagnetism={enableMagnetism}
        />
      ))}
    </div>
  );
}

function MagicBentoCard({
  item,
  enableStars,
  enableBorderGlow,
  disableAnimations,
  particleCount,
  glowColor,
  enableTilt,
  clickEffect,
  enableMagnetism,
}: {
  item: MagicBentoItem;
  enableStars: boolean;
  enableBorderGlow: boolean;
  disableAnimations: boolean;
  particleCount: number;
  glowColor: string;
  enableTilt: boolean;
  clickEffect: boolean;
  enableMagnetism: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<any[]>([]);
  const isHoveredRef = useRef(false);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || !enableStars) return;

    const { width, height } = cardRef.current.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const particle = createParticleElement(Math.random() * width, Math.random() * height, glowColor);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }, i * 100);

      timeoutsRef.current.push(timeoutId);
    }
  }, [enableStars, particleCount, glowColor]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      }
      if (enableMagnetism) {
        gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (enableBorderGlow) {
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        element.style.setProperty("--glow-x", `${relativeX}%`);
        element.style.setProperty("--glow-y", `${relativeY}%`);
      }

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(element, { rotateX, rotateY, duration: 0.15, ease: "power2.out", transformPerspective: 1000 });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04;
        const magnetY = (y - centerY) * 0.04;
        gsap.to(element, { x: magnetX, y: magnetY, duration: 0.2, ease: "power2.out" });
      }
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, enableBorderGlow]);

  return (
    <Link href={`/skills?category=${item.slug}`} style={{ textDecoration: "none" }}>
      <div ref={cardRef} className="magic-bento-card card-surface">
        {/* Label & Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span className="bento-label">{item.label}</span>
          {item.badge && <span className="bento-badge">{item.badge}</span>}
        </div>

        {/* Icon & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <span style={{ fontSize: "32px" }}>{item.icon}</span>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--color-text-primary)", margin: 0 }}>
            {item.title}
          </h3>
        </div>

        {/* Description */}
        <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.6", margin: 0 }}>
          {item.description}
        </p>
      </div>
    </Link>
  );
}
