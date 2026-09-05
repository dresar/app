"use client";

import dynamic from "next/dynamic";
import type { LightfallProps } from "./Lightfall";

const LightfallDynamic = dynamic(() => import("./Lightfall"), {
  ssr: false,
});

export function LightfallWrapper(props: LightfallProps) {
  return <LightfallDynamic {...props} />;
}
