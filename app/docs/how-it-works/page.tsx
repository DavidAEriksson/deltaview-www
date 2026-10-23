import type { Metadata } from "next";
import { Badge, Code, Text, Title } from "@fanzeal-intl/ui";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorks() {
  return (
    <>
      <Title order={1}>How it works</Title>
      <Text size="lg" tone="secondary">
        Deltaview has two halves. The <strong>skill</strong> is instructions Claude follows: resolve the ref, check it out,
        install, test, analyse the diff and anchor overlays in Chrome. The <strong>toolkit</strong> is a small Node CLI with
        no dependencies that parses the diff, validates the manifest, runs the proxy and posts the review. Deterministic work
        lives in the toolkit, so the review posts even if the Claude session is gone.
      </Text>

      <Title order={2}>Items and tiers</Title>
      <Text size="lg" tone="secondary">
        Claude reads the full diff and the code around it, then groups hunks into <strong>items</strong>. Every hunk belongs
        to exactly one item; the toolkit refuses the item list until that holds. One file can be split across items when its
        hunks belong to different features.
      </Text>
      <Title order={3} size={4}>
        <Badge variant="success">Direct</Badge>
      </Title>
      <Text size="lg" tone="secondary">The changed code renders something: a component, template, markup or styles. The overlay sits on that element.</Text>
      <Title order={3} size={4}>
        <Badge variant="info">Indirect</Badge>
      </Title>
      <Text size="lg" tone="secondary">
        The changed code is non-visual (API handler, hook, service, util, store) but something on screen triggers it. Claude
        traces the chain from the trigger to the change by grepping callers, reading imports and using framework knowledge,
        then pins the overlay to the trigger. The overlay shows the chain as a breadcrumb, and the diff lists the item&apos;s
        hunks in chain order:
      </Text>
      <Code block>{"Save button › useSaveOrder() › POST /api/orders › orders.handler.ts"}</Code>
      <Title order={3} size={4}>
        <Badge variant="warning">Backstage</Badge>
      </Title>
      <Text size="lg" tone="secondary">
        No path to the UI: migrations, CI, config, build files, docs, lockfiles, or UI that can&apos;t be anchored. These go to
        the Backstage drawer with the same diff, summary and decision controls, tagged <strong>not visually verified</strong>.
        UI that needs a manual interaction gets a <Code>howToReach</Code> note, e.g. “Open Settings, click Billing, then
        Edit”.
      </Text>

      <Title order={3} size={4}>Grouping rules</Title>
      <ul>
        <li>Test hunks attach to the item for the code they test, not to an item of their own.</li>
        <li>
          Shared code used by many elements is pinned to one representative element; the others are listed under{" "}
          <strong>Affects</strong>. When the instances on that page share a stable selector, it may match them all: the
          first is the anchor and the rest get dim outlines.
        </li>
        <li>
          Code with no UI path that nothing calls is flagged <strong>appears unused</strong>, checked with a grep across the
          worktree first. Dead code is a common smell in agent-written PRs.
        </li>
        <li>Each item gets a plain-language summary of what changed, its effect and any risks noticed.</li>
      </ul>

      <Title order={2}>Anchoring</Title>
      <Text size="lg" tone="secondary">
        With your dev server running, Claude opens a new Chrome tab, navigates to each item&apos;s route and finds its
        element. It checks that the selector matches exactly one element (or, for shared code, exactly the instances of
        the changed component) with a read-only <Code>document.querySelectorAll(selector).length</Code>. Selector
        preference:
      </Text>
      <ol>
        <li>
          <Code>data-testid</Code>, <Code>data-test</Code> or <Code>data-cy</Code>
        </li>
        <li>An id</li>
        <li>
          ARIA and stable attributes: <Code>[aria-label=…]</Code>, <Code>a[href=…]</Code>, <Code>button[name=…]</Code>
        </li>
        <li>A short structural selector from stable attributes. Never nth-child or generated class names.</li>
      </ol>
      <Text size="lg" tone="secondary">
        Anything that only appears after an interaction (a modal, a closed tab, a later form step) becomes a Backstage item
        with a <Code>howToReach</Code> note. The agent never clicks to get there.
      </Text>

      <Title order={2}>The proxy</Title>
      <Text size="lg" tone="secondary">
        <Code>deltaview serve</Code> runs a plain Node HTTP server in front of your dev server, e.g.{" "}
        <Code>localhost:4500</Code> → <Code>localhost:3000</Code>. HTTPS dev servers work too; self-signed certificates
        (mkcert, Vite&apos;s basic SSL) are accepted on loopback only. It:
      </Text>
      <ul>
        <li>
          injects <Code>{'<script type="module" src="/__deltaview/overlay.mjs">'}</Code> into every HTML response, and drops
          its CSP and <Code>X-Frame-Options</Code> headers so the script can load and the page can be framed for the
          mobile and before/after views;
        </li>
        <li>passes WebSocket upgrades through, so hot module reload keeps working;</li>
        <li>rewrites redirects and the Origin and Referer headers between the proxy and dev server origins;</li>
        <li>
          listens on the dev server&apos;s hostname (loopback only), so cookies, which are scoped per host and not per port,
          carry over and you stay logged in;
        </li>
        <li>
          serves the manifest and accepts decisions under <Code>/__deltaview/</Code>. POSTs must be{" "}
          <Code>application/json</Code> and same-origin, which blocks cross-site requests.
        </li>
      </ul>
      <Text size="lg" tone="secondary">
        The overlay lives in a Shadow DOM so its styles and your app&apos;s don&apos;t touch. Keystrokes inside it don&apos;t
        reach your app&apos;s hotkeys, and outlines re-attach when the DOM changes or an SPA navigates.
      </Text>
      <Text size="lg" tone="secondary">
        For the before/after view, a second proxy in the same process fronts the base version&apos;s dev server. It draws
        the same outlines but is read-only: it refuses decisions and Finish.
      </Text>
    </>
  );
}
