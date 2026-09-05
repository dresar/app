"use client";

import dynamic from "next/dynamic";
import type { BorderGlowProps } from "./BorderGlow";

const BorderGlowDynamic = dynamic(() => import("./BorderGlow"), {
  ssr: false,
});

export function BorderGlowWrapper(props: BorderGlowProps) {
  return <BorderGlowDynamic {...props} />;
}
