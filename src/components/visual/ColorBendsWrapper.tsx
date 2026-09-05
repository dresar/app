"use client";

import dynamic from "next/dynamic";

const ColorBendsComponent = dynamic(
  () => import("./ColorBends").then((m) => m.ColorBends),
  { ssr: false }
);

interface ColorBendsWrapperProps {
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

export function ColorBendsWrapper(props: ColorBendsWrapperProps) {
  return <ColorBendsComponent {...props} />;
}
