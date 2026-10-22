"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@fanzeal-intl/ui";

export const pages = [
  { href: "/docs", title: "Getting started" },
  { href: "/docs/usage", title: "Running a review" },
  { href: "/docs/how-it-works", title: "How it works" },
  { href: "/docs/reviewing", title: "The overlay & GitHub" },
  { href: "/docs/manifest", title: "The manifest" },
  { href: "/docs/cli", title: "CLI reference" },
];

export function DocsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Docs" className="flex gap-2xs overflow-x-auto md:flex-col">
      {pages.map((p) => (
        <NextLink
          key={p.href}
          href={p.href}
          aria-current={pathname === p.href ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-md px-sm py-xs text-label-lg text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary",
            pathname === p.href && "bg-bg-surface-raised text-text-primary",
          )}
        >
          {p.title}
        </NextLink>
      ))}
    </nav>
  );
}
