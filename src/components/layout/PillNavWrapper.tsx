"use client";

import dynamic from "next/dynamic";
import type { PillNavProps } from "./PillNav";

const PillNavDynamic = dynamic(() => import("./PillNav"), {
  ssr: false,
});

export function PillNavWrapper(props: PillNavProps) {
  return <PillNavDynamic {...props} />;
}
