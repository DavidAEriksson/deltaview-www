import type { Metadata } from "next";
import { Alert, Code, Text, Title } from "@fanzeal-intl/ui";
import { Command } from "../../site";

export const metadata: Metadata = { title: "Running a review" };

export default function Usage() {
  return (
    <>
      <Title order={1}>Running a review</Title>
      <Command>{"/deltaview feat/my-branch\n/deltaview 3f2c1ab"}</Command>
      <Text size="lg" tone="secondary">
        Deltaview always reviews <strong>a branch against its target</strong>: the diff between the head and its merge-base
        with the target branch. A branch name uses the branch tip as the head; a commit hash uses that commit, i.e. the branch
        as it stood then. If the diff is empty, for example because the commit is already on the target, it says so and stops.
      </Text>

      <Title order={2}>Which commits and target</Title>
      <ul>
        <li>
          If the branch has an open PR, the PR&apos;s current tip is fetched and reviewed, not a possibly stale local branch.
          Fork PRs are fetched the way <Code>gh pr checkout</Code> does.
        </li>
        <li>If the ref isn&apos;t local, it&apos;s fetched from <Code>origin</Code>.</li>
        <li>
          The target is the PR&apos;s base branch, else the repo&apos;s default branch (from <Code>gh</Code> or{" "}
          <Code>origin/HEAD</Code>), else <Code>main</Code> or <Code>master</Code>. If none fit, Deltaview asks.
        </li>
      </ul>

      <Title order={2}>What happens</Title>
      <ol>
        <li>
          <strong>Checkout.</strong> The ref is checked out in a temporary git worktree, so your working copy is untouched.
          Untracked <Code>.env*</Code> files are copied into it byte for byte, without being read.
        </li>
        <li>
          <strong>Install.</strong> Dependencies install with the package manager your lockfile implies (npm, pnpm, yarn,
          bun) or the build file&apos;s usual install. A failed install is shown and the review stops.
        </li>
        <li>
          <strong>Env check.</strong> New env vars are detected from <Code>.env.example</Code> (and{" "}
          <Code>.env.sample</Code>, <Code>.env.template</Code>) and new <Code>process.env.X</Code> /{" "}
          <Code>import.meta.env.X</Code> references in the diff. If there are any, you&apos;re asked to add them to your{" "}
          <Code>.env</Code> before the app starts.
        </li>
        <li>
          <strong>Tests.</strong> Your test command runs and the result is recorded. Failing tests don&apos;t block the
          review.
        </li>
        <li>
          <strong>Analyse and anchor.</strong> Claude groups every hunk into items, starts your dev server, and finds the
          element each item affects. See <em>How it works</em>.
        </li>
        <li>
          <strong>Review.</strong> A local proxy starts in front of your dev server and the review opens in a new Chrome tab.
          The Deltaview bar sits bottom-left.
        </li>
        <li>
          <strong>Finish.</strong> Clicking <strong>Finish review</strong> posts the review and the agent reports the result:
          the review URL, counts per decision, the test result and the manifest path. The dev server is stopped and the
          worktree removed.
        </li>
      </ol>

      <Alert variant="warning" title="If the app needs a login">
        The agent never logs in for you. If the app shows a login page, log in yourself in that tab, then continue.
      </Alert>

      <Title order={2}>Resuming</Title>
      <Text size="lg" tone="secondary">
        Decisions are saved to the manifest the moment you make them. If you stop before finishing, run{" "}
        <Code>/deltaview</Code> on the same ref again: when the head commit is unchanged, the review resumes with the same
        items and your decisions kept. Analysis and anchoring are skipped, but the app and proxy start again.
      </Text>
      <Text size="lg" tone="secondary">
        If the branch has new commits, a fresh review starts and you&apos;re told the earlier decisions were not carried
        over. A finished review is never resumed.
      </Text>

      <Title order={2}>Ground rules</Title>
      <Text size="lg" tone="secondary">The agent follows these on every run:</Text>
      <ul>
        <li>In your app it only navigates by URL, scrolls and reads. It never clicks, types or submits.</li>
        <li>
          It never modifies your working copy. The only writes to your checkout are under <Code>.deltaview/</Code> and one{" "}
          <Code>.deltaview/</Code> line in <Code>.git/info/exclude</Code>.
        </li>
        <li>
          It never reads, prints or edits <Code>.env*</Code> files; it only copies them.
        </li>
        <li>It doesn&apos;t try to fix a failing install, app start or test run. It reports and stops, or continues.</li>
      </ul>
    </>
  );
}
