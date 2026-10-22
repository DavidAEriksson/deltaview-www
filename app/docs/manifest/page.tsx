import type { Metadata } from "next";
import { Code, Text, Title } from "@fanzeal-intl/ui";

export const metadata: Metadata = { title: "The manifest" };

const example = `{
  "version": 1,
  "ref": "feat/checkout",
  "target": "main",
  "baseSha": "…", "headSha": "…",
  "repo": "acme/shop",
  "pr": { "number": 7, "url": "https://github.com/acme/shop/pull/7", "isAuthor": false },
  "tests": { "command": "npm test", "passed": true, "summary": "42 passed" },
  "newEnvVars": ["STRIPE_WEBHOOK_SECRET"],
  "hunks": { "h1": { "id": "h1", "file": "src/api.ts", "status": "modified", "lines": [ … ] } },
  "items": [{
    "id": "i1", "tier": "indirect", "title": "Save button",
    "route": "/orders/new", "selector": "[data-testid=\\"save\\"]",
    "chain": ["Save button", "useSaveOrder()", "POST /api/orders", "orders.handler.ts"],
    "affects": [], "hunkIds": ["h1"], "summary": "…",
    "howToReach": null, "appearsUnused": false, "visuallyVerified": true,
    "decision": "rejected", "comment": "Missing error state", "decidedAt": "2026-10-22T12:00:00.000Z"
  }],
  "status": "finished",
  "reviewUrl": "https://github.com/acme/shop/pull/7#pullrequestreview-…",
  "error": null,
  "createdAt": "2026-10-22T11:40:00.000Z"
}`;

export default function Manifest() {
  return (
    <>
      <Title order={1}>The manifest</Title>
      <Text size="lg" tone="secondary">
        Every review is recorded in a manifest in your <strong>main checkout</strong>, not the worktree, which is removed
        afterwards. It&apos;s written on every decision, so nothing is lost if the tab crashes, and it&apos;s shaped for a
        follow-up agent to act on: “fix all rejected items”.
      </Text>

      <Title order={2}>
        What <Code>.deltaview/</Code> holds
      </Title>
      <ul>
        <li>
          <Code>.deltaview/reviews/&lt;ref&gt;-&lt;YYYYMMDD-HHMMSS&gt;.json</Code>: the manifest.
        </li>
        <li>
          <Code>.deltaview/reviews/&lt;ref&gt;-&lt;YYYYMMDD-HHMMSS&gt;.md</Code>: a human-readable rendering of the same
          manifest.
        </li>
      </ul>
      <Text size="lg" tone="secondary">
        In file names, the ref has every run of characters outside <Code>A-Za-z0-9._-</Code> replaced by <Code>-</Code>, so{" "}
        <Code>feat/demo</Code> becomes <Code>feat-demo</Code>. <Code>.deltaview/</Code> is added to{" "}
        <Code>.git/info/exclude</Code>, so it never shows in <Code>git status</Code> and no tracked file changes.
      </Text>

      <Title order={2}>Shape</Title>
      <Code block>{example}</Code>

      <Title order={3} size={4}>Top level</Title>
      <ul>
        <li>
          <Code>ref</Code>, <Code>target</Code>, <Code>baseSha</Code>, <Code>headSha</Code>: what was reviewed. Base is the
          merge-base with the target.
        </li>
        <li>
          <Code>repo</Code> and <Code>pr</Code>: <Code>null</Code> when there&apos;s no GitHub repo or open PR.
        </li>
        <li>
          <Code>tests</Code>: the command, pass/fail and a one-line summary, or <Code>command: null</Code> when none was
          found.
        </li>
        <li>
          <Code>hunks</Code>: every hunk of the diff by id, with file, status (<Code>added</Code>, <Code>modified</Code>,{" "}
          <Code>deleted</Code>, <Code>renamed</Code>…) and lines tagged <Code>add</Code>, <Code>del</Code> or{" "}
          <Code>ctx</Code> with old and new line numbers.
        </li>
        <li>
          <Code>status</Code>: <Code>in_progress</Code> or <Code>finished</Code>. <Code>reviewUrl</Code> is set after
          posting; <Code>error</Code> holds the last posting error.
        </li>
      </ul>

      <Title order={3} size={4}>Items</Title>
      <ul>
        <li>
          <Code>tier</Code>: <Code>direct</Code>, <Code>indirect</Code> or <Code>backstage</Code>.
        </li>
        <li>
          <Code>route</Code> (a pathname, no query or hash) and <Code>selector</Code> (for{" "}
          <Code>document.querySelector</Code>): required for direct and indirect, <Code>null</Code> for backstage.
        </li>
        <li>
          <Code>chain</Code>: the breadcrumb from trigger to change, for indirect items.
        </li>
        <li>
          <Code>affects</Code>: other elements the change reaches, for shared code.
        </li>
        <li>
          <Code>hunkIds</Code>: the hunks this item covers. Each hunk is in exactly one item.
        </li>
        <li>
          <Code>visuallyVerified</Code>: <Code>false</Code> for backstage items.
        </li>
        <li>
          <Code>decision</Code>: <Code>approved</Code>, <Code>rejected</Code>, <Code>comment</Code> or <Code>null</Code>;
          with <Code>comment</Code> and <Code>decidedAt</Code>. A rejection always has a reason.
        </li>
      </ul>
    </>
  );
}
