"use client";

import dynamic from "next/dynamic";
import type { CursorGridProps } from "./CursorGrid";

const CursorGridDynamic = dynamic(() => import("./CursorGrid"), {
  ssr: false,
});

export function CursorGridWrapper(props: CursorGridProps) {
  return <CursorGridDynamic {...props} />;
}
