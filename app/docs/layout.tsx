import { Container } from "@fanzeal-intl/ui";
import { DocsNav } from "./nav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <Container className="grid gap-2xl py-2xl md:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-xl md:self-start">
        <DocsNav />
      </aside>
      <article className="docs max-w-(--container-3xl)">{children}</article>
    </Container>
  );
}
