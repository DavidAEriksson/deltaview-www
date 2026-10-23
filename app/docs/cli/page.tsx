import type { Metadata } from "next";
import { Alert, Code, Text, Title } from "@fanzeal-intl/ui";
import { Command } from "../../site";

export const metadata: Metadata = { title: "CLI reference" };

const commands = [
  {
    name: "init",
    usage: "deltaview init --repo <main> --ref <ref> --target <target> --base <sha> --head <sha> --out <manifest> [--pr '<json>']",
    body: "Parses the diff between base and head into hunks, detects new env vars, looks up the repo with gh, and writes a new in-progress manifest. Prints the manifest path.",
  },
  {
    name: "env",
    usage: "deltaview env --repo <main> --base <sha> --head <sha>",
    body: "Prints the new env var names as a JSON array, from .env.example/.sample/.template and process.env / import.meta.env references in the diff.",
  },
  {
    name: "resume",
    usage: "deltaview resume --dir <main>/.deltaview/reviews --ref <ref> --head <sha>",
    body: "Prints the path of an unfinished manifest for this exact ref and head commit that has at least one item, or nothing.",
  },
  {
    name: "previous",
    usage: "deltaview previous --dir <main>/.deltaview/reviews --ref <ref> --head <sha>",
    body: "Prints the path of the newest manifest for this ref at a different head commit, finished or not, that has at least one item, or nothing. This is the review to carry decisions from.",
  },
  {
    name: "patch",
    usage: "deltaview patch --manifest <manifest> --json '{\"tests\":{…}}'",
    body: "Merges top-level fields into the manifest. Only tests, pr and newEnvVars are allowed.",
  },
  {
    name: "add-items",
    usage: "deltaview add-items --manifest <manifest> --items <items.json> [--carry-from <previous>]",
    body: "Validates and sets the item list. Fails with every problem at once: uncovered or duplicated hunks, unknown hunk ids, duplicate item ids, invalid tiers, missing summaries, and direct/indirect items without a route or selector. With --carry-from, copies decisions from that manifest onto items whose edits are identical, flags the rest as changed since the last review, and prints how many carried over.",
  },
  {
    name: "serve",
    usage: "deltaview serve --manifest <manifest> --target <devUrl> --port <port> [--base-target <baseDevUrl>]",
    body: 'Starts the injecting proxy. With --base-target, also starts a read-only proxy in front of the base version\'s dev server on a free port, for the before/after view. Prints {"proxyUrl":…,"port":…,"baseUrl":…} (baseUrl is null without --base-target); on Finish prints {"done":true,"reviewUrl":…,"manifestPath":…} and exits 0.',
  },
];

export default function Cli() {
  return (
    <>
      <Title order={1}>CLI reference</Title>
      <Text size="lg" tone="secondary">
        The skill drives a small toolkit at <Code>skills/deltaview/scripts/bin/deltaview.mjs</Code>. It uses Node built-ins
        only. You don&apos;t normally run it yourself, but it&apos;s useful for debugging a review or building on the
        manifest. Errors are printed as <Code>deltaview: &lt;message&gt;</Code> with exit code 1.
      </Text>
      <Command>{"node skills/deltaview/scripts/bin/deltaview.mjs <command> [options]"}</Command>

      {commands.map((c) => (
        <section key={c.name} className="space-y-md">
          <Title order={2}>{c.name}</Title>
          <Command>{c.usage}</Command>
          <Text size="lg" tone="secondary">{c.body}</Text>
        </section>
      ))}

      <Title order={2}>Proxy endpoints</Title>
      <ul>
        <li>
          <Code>GET /__deltaview/manifest</Code>: the current manifest.
        </li>
        <li>
          <Code>POST /__deltaview/decision</Code> with <Code>{'{"itemId","decision","comment","line"}'}</Code>. A{" "}
          <Code>decision</Code> of <Code>null</Code> resets the item; <Code>line</Code> is optional. The base proxy
          refuses every POST.
        </li>
        <li>
          <Code>POST /__deltaview/finish</Code>: posts the review (when there&apos;s a PR) and finishes.
        </li>
      </ul>

      <Title order={2}>Developing Deltaview</Title>
      <Command>{"npm test"}</Command>
      <Alert variant="info" title="Releases">
        Releases are cut by release-please from Conventional Commits on main: <Code>fix:</Code> is a patch,{" "}
        <Code>feat:</Code> a minor, <Code>feat!:</Code> or <Code>BREAKING CHANGE:</Code> a major. Merging the release PR
        tags the release and publishes it on GitHub.
      </Alert>
    </>
  );
}
