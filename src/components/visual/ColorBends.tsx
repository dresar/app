"use client";

import { useEffect, useRef } from "react";

interface ColorBendsProps {
  color?: string;
  speed?: number;
  frequency?: number;
  noise?: number;
  bandWidth?: number;
  rotation?: number;
  fadeTop?: number;
  iterations?: number;
  intensity?: number;
  className?: string;
}

/**
 * ColorBends — Shader gradient background component
 * Visual signature untuk hero dan CTA area
 * 
 * ATURAN PEMAKAIAN (per 03-ui-ux-design-system.md §5):
 * - Hanya di: Homepage hero, Generator hero, CTA tertentu, empty-state premium
 * - DILARANG di seluruh halaman — merusak keterbacaan dan performa
 * - Wajib overlay gradasi gelap di atas sebelum teks diletakkan
 * - Otomatis dimatikan jika prefers-reduced-motion: reduce
 */
export function ColorBends({
  color = "#06B6D4",
  speed = 0.1,
  frequency = 1.2,
  noise = 0.06,
  bandWidth = 0.4,
  rotation = 45,
  fadeTop = 0.95,
  iterations = 2,
  intensity = 1.1,
  className = "",
}: ColorBendsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Hargai prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Parse warna hex ke RGB
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const radRot = (rotation * Math.PI) / 180;
    const cosR = Math.cos(radRot);
    const sinR = Math.sin(radRot);

    const draw = () => {
      const t = ((Date.now() - startTimeRef.current) / 1000) * speed;
      const W = canvas.width;
      const H = canvas.height;

      if (W <= 0 || H <= 0 || isNaN(W) || isNaN(H)) return;

      const imageData = ctx.createImageData(W, H);
      const data = imageData.data;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          // Normalize coords [-1, 1]
          const nx = (x / W) * 2 - 1;
          const ny = (y / H) * 2 - 1;

          // Rotate
          const rx = nx * cosR - ny * sinR;
          const ry = nx * sinR + ny * cosR;

          // Layered sine waves
          let val = 0;
          for (let i = 0; i < iterations; i++) {
            const freq = frequency * (i + 1);
            val += Math.sin(rx * freq + t + i * 0.5) * Math.cos(ry * freq * 0.5 + t * 0.7);
          }
          val /= iterations;

          // Noise
          val += (Math.random() - 0.5) * noise;

          // Band
          const band = Math.abs(val) < bandWidth ? 1 : 0;
          const alpha = band * intensity * (1 - y / H * (1 - fadeTop));

          const idx = (y * W + x) * 4;
          data[idx]     = r * 255 * alpha;
          data[idx + 1] = g * 255 * alpha;
          data[idx + 2] = b * 255 * alpha;
          data[idx + 3] = alpha * 180; // semi-transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [color, speed, frequency, noise, bandWidth, rotation, fadeTop, iterations, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
