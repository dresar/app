"use client";

import dynamic from "next/dynamic";
import type { ScrollStackProps } from "./ScrollStack";

const ScrollStackDynamic = dynamic(() => import("./ScrollStack"), {
  ssr: false,
});

export function ScrollStackWrapper(props: ScrollStackProps) {
  return <ScrollStackDynamic {...props} />;
}
