import type { Metadata } from "next";
import NextLink from "next/link";
import { Container, Group, Link } from "@fanzeal-intl/ui";
import { REPO } from "./site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Deltaview: visual review for your branch", template: "%s · Deltaview" },
  description:
    "A Claude Code plugin that opens your app in Chrome with overlays on every element a branch changes. Approve, reject or comment, then post one GitHub review.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border-subtle">
          <Container>
            <Group justify="between" className="h-14">
              <NextLink href="/" className="text-heading-sm text-text-primary">
                deltaview
              </NextLink>
              <Group gap="xl" className="text-label-lg">
                <Link asChild>
                  <NextLink href="/docs">Docs</NextLink>
                </Link>
                <Link href={REPO}>GitHub</Link>
              </Group>
            </Group>
          </Container>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-border-subtle py-xl">
          <Container>
            <Group justify="between" wrap className="text-body-sm text-text-secondary">
              <span>Deltaview is a Claude Code plugin by David Eriksson.</span>
              <Group gap="lg">
                <Link href={REPO}>Source</Link>
                <Link href={`${REPO}/releases`}>Releases</Link>
              </Group>
            </Group>
          </Container>
        </footer>
      </body>
    </html>
  );
}
