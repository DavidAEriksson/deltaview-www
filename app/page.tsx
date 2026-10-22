import NextLink from "next/link";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Code,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@fanzeal-intl/ui";
import { Eye, FolderGit2, GitPullRequest, KeyRound, MousePointerClick, ShieldCheck } from "lucide-react";
import { Command, INSTALL, REPO } from "./site";

const steps = [
  ["Check out", "The ref goes into a temporary git worktree. Your working copy is never touched. Untracked .env files are copied across without being read."],
  ["Install and test", "Dependencies install from your lockfile and your test command runs. Failing tests are reported, not fixed, and don't block the review."],
  ["Analyse and anchor", "Claude reads the diff, groups every hunk into an item, and finds the on-screen element each item affects. It only navigates and reads; it never clicks."],
  ["Review", "Your app opens in your own Chrome behind a small proxy that injects the overlay. Decide on each item, then click Finish review."],
] as const;

const tiers = [
  {
    name: "Direct",
    tone: "success" as const,
    body: "The changed code renders something. The overlay sits on that element.",
    example: "CheckoutSummary.tsx → the order summary card",
  },
  {
    name: "Indirect",
    tone: "info" as const,
    body: "The change is in a hook, API handler or util, but something on screen triggers it. The overlay pins to the trigger and shows the chain.",
    example: "Save button → useSaveOrder() → POST /api/orders → orders.handler.ts",
  },
  {
    name: "Backstage",
    tone: "warning" as const,
    body: "No place on screen: migrations, CI, config, or UI behind an interaction. Listed in a drawer and tagged “not visually verified”.",
    example: ".github/workflows/ci.yml",
  },
];

const guardrails = [
  [MousePointerClick, "Never clicks in your app", "While anchoring, the agent only navigates by URL, scrolls and reads. No side effects against your backend."],
  [FolderGit2, "Your checkout stays clean", "Work happens in a worktree. The only writes are to .deltaview/, which is added to .git/info/exclude."],
  [KeyRound, "Secrets stay unread", ".env files are copied byte for byte and never printed. New env vars are detected by name only."],
  [Eye, "Nothing is reviewed unseen", "Anything not anchored to the UI is tagged “not visually verified” in the overlay, on GitHub and in the manifest."],
] as const;

export default function Home() {
  return (
    <main>
      <section className="py-4xl">
        <Container>
          <Stack gap="xl" align="start" className="max-w-(--container-3xl)">
            <Badge variant="brand">Claude Code plugin · v1.1.0</Badge>
            <h1 className="text-display-xl">Review a branch where it renders.</h1>
            <Text size="lg" tone="secondary">
              Run <Code>/deltaview &lt;branch|commit&gt;</Code> and your app opens in your own Chrome with an overlay on every
              element the change affects. Open one to see its diff and a plain-language breakdown, then approve, reject or
              comment. Finish posts a single GitHub review.
            </Text>
            <div className="w-full max-w-(--container-xl)">
              <Command>{INSTALL}</Command>
            </div>
            <Group gap="md" wrap>
              <Button asChild variant="primary" size="lg">
                <NextLink href="/docs">Read the docs</NextLink>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href={REPO}>View on GitHub</a>
              </Button>
            </Group>
          </Stack>
        </Container>
      </section>

      <section className="pb-4xl">
        <Container>
          <OverlayPreview />
        </Container>
      </section>

      <section className="border-t border-border-subtle py-4xl">
        <Container>
          <Stack gap="lg" className="max-w-(--container-3xl)">
            <Title order={2}>77 files, 5,000 lines, tests green. Now what?</Title>
            <Text size="lg" tone="secondary">
              Large PRs, often agent-written, pass the build and still leave you without an entry point. So you pull the
              branch and click around where you suspect risk. Deltaview makes that step guided: every changed hunk ends up on
              an overlay or in the Backstage drawer, so nothing is silently skipped.
            </Text>
          </Stack>
        </Container>
      </section>

      <section className="border-t border-border-subtle py-4xl">
        <Container>
          <Stack gap="2xl">
            <Title order={2}>How it works</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="lg">
              {steps.map(([title, body], i) => (
                <Card key={title}>
                  <Text size="sm" tone="brand" mono>
                    0{i + 1}
                  </Text>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </section>

      <section className="border-t border-border-subtle py-4xl">
        <Container>
          <Stack gap="2xl">
            <Stack gap="sm" className="max-w-(--container-3xl)">
              <Title order={2}>Changes shown where they take effect</Title>
              <Text size="lg" tone="secondary">
                Every hunk belongs to exactly one item, and every item has one of three tiers.
              </Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, md: 3 }} gap="lg">
              {tiers.map((t) => (
                <Card key={t.name}>
                  <Badge variant={t.tone} className="self-start">
                    {t.name}
                  </Badge>
                  <CardDescription>{t.body}</CardDescription>
                  <Code className="mt-auto self-start whitespace-normal">{t.example}</Code>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </section>

      <section className="border-t border-border-subtle py-4xl">
        <Container>
          <Stack gap="2xl">
            <Title order={2}>Built not to surprise you</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} gap="lg">
              {guardrails.map(([Icon, title, body]) => (
                <Group key={title} gap="lg" align="start">
                  <ThemeIcon tone="brand" size="lg">
                    <Icon aria-hidden />
                  </ThemeIcon>
                  <Stack gap="xs">
                    <Text size="lg" weight="medium">
                      {title}
                    </Text>
                    <Text tone="secondary">{body}</Text>
                  </Stack>
                </Group>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </section>

      <section className="border-t border-border-subtle py-4xl">
        <Container>
          <SimpleGrid cols={{ base: 1, md: 2 }} gap="2xl">
            <Stack gap="md">
              <ThemeIcon tone="success" size="lg">
                <GitPullRequest aria-hidden />
              </ThemeIcon>
              <Title order={3}>One GitHub review</Title>
              <Text tone="secondary">
                Finish review posts to the open PR through your authenticated <Code>gh</Code>. Each decision becomes an inline
                comment on the lines it covers. Any rejection requests changes; all approved approves. On your own PR it falls
                back to a comment.
              </Text>
            </Stack>
            <Stack gap="md">
              <ThemeIcon tone="info" size="lg">
                <ShieldCheck aria-hidden />
              </ThemeIcon>
              <Title order={3}>A manifest an agent can act on</Title>
              <Text tone="secondary">
                Every decision is written to <Code>.deltaview/reviews/</Code> as JSON and Markdown the moment you make it. Hand
                it to a follow-up agent: “fix all rejected items”. Stop halfway and run it again to resume.
              </Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </section>

      <section className="border-t border-border-subtle py-4xl">
        <Container>
          <Card variant="featured" className="items-start gap-lg p-2xl">
            <Title order={2}>Install</Title>
            <Text tone="secondary">
              Needs Claude Code with the Claude in Chrome extension, Node.js 20+, and a web project whose dev server already
              runs locally.
            </Text>
            <div className="w-full max-w-(--container-xl)">
              <Command>{INSTALL}</Command>
            </div>
            <Button asChild variant="primary">
              <NextLink href="/docs">Get started</NextLink>
            </Button>
          </Card>
        </Container>
      </section>
    </main>
  );
}

/** A static rendering of the overlay, after the spec's mockup. */
function OverlayPreview() {
  return (
    <div
      aria-label="Illustration: an overlay on a component, with its diff and the approve, reject and comment bar"
      role="img"
      className="rounded-2xl border border-border-default bg-bg-surface p-lg sm:p-2xl"
    >
      <Group gap="xs" className="mb-xl">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-3 rounded-full bg-bg-surface-raised" />
        ))}
        <span className="ml-md text-code-sm text-text-secondary">localhost:4500/checkout</span>
      </Group>
      <div className="grid gap-lg md:grid-cols-[3fr_2fr]">
        <Stack gap="xs">
          <span className="text-code-sm text-text-info">DELTAVIEW/feat/checkout-summary</span>
          <div className="rounded-md border-2 border-text-info bg-bg-info-subtle p-lg">
            <div className="rounded-md border border-border-strong bg-bg-canvas p-lg">
              <Stack gap="sm">
                <Text weight="medium">Order summary</Text>
                <Group justify="between" className="text-body-md text-text-secondary">
                  <span>Subtotal</span>
                  <span>$84.00</span>
                </Group>
                <Group justify="between" className="text-body-md text-text-secondary">
                  <span>Shipping</span>
                  <span>Free</span>
                </Group>
                <Group justify="between" className="text-body-md">
                  <span>Total</span>
                  <span>$84.00</span>
                </Group>
              </Stack>
            </div>
          </div>
          <Group gap="sm" className="rounded-md border border-border-default bg-bg-surface-raised p-sm">
            <Badge variant="success">Approve</Badge>
            <Badge variant="error">Reject</Badge>
            <Badge variant="neutral">Comment</Badge>
          </Group>
        </Stack>
        <div className="overflow-hidden rounded-md border border-border-default text-code-sm">
          <div className="bg-bg-surface-raised px-md py-xs text-text-secondary">src/checkout/Summary.tsx</div>
          <pre className="overflow-x-auto bg-bg-success-subtle px-md py-sm text-text-success">
            {"+ const shipping = total > 50 ? 0 : 4.9;\n+ <Row label=\"Shipping\" value={fmt(shipping)} />"}
          </pre>
          <pre className="overflow-x-auto bg-bg-warning-subtle px-md py-sm text-text-warning">
            {"~ <Row label=\"Total\" value={fmt(total + shipping)} />"}
          </pre>
          <pre className="overflow-x-auto bg-bg-brand-subtle px-md py-sm text-text-error">{"- <FreeShippingBanner />"}</pre>
          <p className="border-t border-border-subtle px-md py-sm font-sans text-body-sm text-text-secondary">
            Adds a shipping row that is free above $50 and includes it in the total. The free-shipping banner is removed.
          </p>
        </div>
      </div>
    </div>
  );
}
