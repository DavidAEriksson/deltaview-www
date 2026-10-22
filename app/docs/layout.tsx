import Image from "next/image";
import NextLink from "next/link";
import { Container, Group, Link } from "@fanzeal-intl/ui";
import { REPO } from "../site";
import { DocsNav } from "./nav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <>
      <header className="border-b border-border-subtle">
        <Container>
          <Group justify="between" className="h-14">
            <NextLink href="/">
              <Image src="/logofullwhite.png" alt="deltaview" width={891} height={200} priority className="h-7 w-auto" />
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
      <Container className="grid flex-1 gap-2xl py-2xl md:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-xl md:self-start">
          <DocsNav />
        </aside>
        <article className="docs max-w-(--container-3xl)">{children}</article>
      </Container>
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
    </>
  );
}
