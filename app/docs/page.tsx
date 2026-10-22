import type { Metadata } from "next";
import NextLink from "next/link";
import { Alert, Code, Link, Text, Title } from "@fanzeal-intl/ui";
import { Command, INSTALL, REPO } from "../site";

export const metadata: Metadata = { title: "Getting started" };

export default function GettingStarted() {
  return (
    <>
      <Title order={1}>Getting started</Title>
      <Text size="lg" tone="secondary">
        Deltaview is a Claude Code plugin for visual, in-browser review of a branch&apos;s changes. Run{" "}
        <Code>/deltaview &lt;branch|commit&gt;</Code> and your app opens in your own Chrome with an overlay on every on-screen
        element the change affects. Open an overlay to see its diff and a plain-language breakdown, then approve, reject (with
        a reason) or comment. <strong>Finish review</strong> posts one GitHub review to the open PR and saves a manifest a
        follow-up agent can act on.
      </Text>

      <Title order={2}>Requirements</Title>
      <ul>
        <li>
          Claude Code with the <Link href="https://claude.com/chrome">Claude in Chrome</Link> extension connected. This is
          required: if the extension isn&apos;t available, Deltaview stops.
        </li>
        <li>Node.js 20 or later.</li>
        <li>
          The <Code>gh</Code> CLI, authenticated with access to the repo, to post reviews. Without it the review is saved
          locally only.
        </li>
        <li>A web project whose dev server already runs locally with your existing env.</li>
      </ul>

      <Title order={2}>Install</Title>
      <Text size="lg" tone="secondary">In Claude Code:</Text>
      <Command>{INSTALL}</Command>
      <Text size="lg" tone="secondary">
        For local development of the plugin itself: <Code>claude --plugin-dir /path/to/deltaview</Code>.
      </Text>

      <Title order={2}>Your first review</Title>
      <Text size="lg" tone="secondary">From inside your project, pass a branch name or a commit hash:</Text>
      <Command>{"/deltaview feat/my-branch"}</Command>
      <Text size="lg" tone="secondary">
        The skill is <Code>/deltaview:deltaview</Code>; the bare <Code>/deltaview</Code> works too unless another command
        already has that name. See <NextLink href="/docs/usage" className="text-text-brand hover:underline">Running a review</NextLink>{" "}
        for what happens next.
      </Text>

      <Title order={2}>Update</Title>
      <Text size="lg" tone="secondary">Refresh the marketplace to fetch the latest release, then restart Claude Code so the new version loads:</Text>
      <Command>{"/plugin marketplace update deltaview"}</Command>
      <Text size="lg" tone="secondary">
        If the old version still loads after the restart, open <Code>/plugin</Code>, go to the installed plugins and update
        deltaview from there. To update automatically, turn on auto-update for the deltaview marketplace under{" "}
        <Code>/plugin</Code> → Marketplaces. <Code>/plugin</Code> shows which version is installed.
      </Text>
      <Alert variant="info" title="Releases">
        Versions follow semver and are cut by release-please from Conventional Commits. Each release&apos;s changes are in
        the <Link href={`${REPO}/blob/main/CHANGELOG.md`}>changelog</Link> and on the{" "}
        <Link href={`${REPO}/releases`}>releases page</Link>.
      </Alert>
    </>
  );
}
