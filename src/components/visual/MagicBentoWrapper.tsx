"use client";

import dynamic from "next/dynamic";
import type { MagicBentoProps } from "./MagicBento";

const MagicBentoDynamic = dynamic(() => import("./MagicBento"), {
  ssr: false,
});

export function MagicBentoWrapper(props: MagicBentoProps) {
  return <MagicBentoDynamic {...props} />;
}
