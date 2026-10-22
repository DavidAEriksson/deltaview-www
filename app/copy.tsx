"use client";

import { useCopy } from "@fanzeal-intl/ui";

/** A plain "Copy" text button; styling comes from the caller. */
export function CopyText({ value, className }: { value: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button type="button" onClick={() => copy(value)} className={className}>
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
