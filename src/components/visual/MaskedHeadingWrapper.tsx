"use client";

import dynamic from "next/dynamic";
import type { MaskedHeadingProps } from "./MaskedHeading";

const MaskedHeadingDynamic = dynamic(() => import("./MaskedHeading"), {
  ssr: false,
});

export function MaskedHeadingWrapper(props: MaskedHeadingProps) {
  return <MaskedHeadingDynamic {...props} />;
}
