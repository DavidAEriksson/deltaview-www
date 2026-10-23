import type { Metadata } from "next";
import { Code, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text, Title } from "@fanzeal-intl/ui";

export const metadata: Metadata = { title: "The overlay & GitHub" };

export default function Reviewing() {
  return (
    <>
      <Title order={1}>The overlay &amp; GitHub</Title>

      <Title order={2}>The Deltaview bar</Title>
      <Text size="lg" tone="secondary">
        The bar starts bottom-left. Drag it by its grip to move it; the position is remembered. It shows the ref, progress
        such as <Code>3/12 reviewed</Code>, a toggle to hide the highlights, <strong>Next ▸</strong> to jump to the next
        undecided item, and <strong>Mobile</strong>, which shows the current page at phone width (390px) in a frame with
        the same outlines. Expanded, it also shows:
      </Text>
      <ul>
        <li>the test result and any new env vars;</li>
        <li>
          <strong>Items</strong>: every item grouped by page, with Backstage last. Click one to go to its page and open it.
          Items whose element isn&apos;t on the current page are marked <em>not found on this page</em>;
        </li>
        <li>
          <strong>Backstage</strong>: the drawer of items with no place on screen;
        </li>
        <li>
          <strong>Finish</strong>.
        </li>
      </ul>

      <Title order={3} size={4}>Keyboard shortcuts</Title>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["j / k", "Open the next / previous item"],
            ["n", "Open the next undecided item"],
            ["a", "Approve the open item"],
            ["r / c", "Start a rejection / comment on the open item"],
            ["Esc", "Close the panel or drawer"],
          ].map(([k, a]) => (
            <TableRow key={k}>
              <TableCell>
                <Code>{k}</Code>
              </TableCell>
              <TableCell>{a}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Text size="lg" tone="secondary">
        Shortcuts never fire while you type in a text field, yours or the app&apos;s, or when Ctrl, Cmd or Alt is held.
      </Text>

      <Title order={2}>Overlays</Title>
      <Text size="lg" tone="secondary">
        Each item on the current page gets an outline with a small <Code>DELTAVIEW/&lt;ref&gt;</Code> chip. Only the chip&apos;s
        button takes clicks, so a closed overlay never covers your app&apos;s controls. Once decided, the chip collapses to
        ✓, ✕ or 💬 and the outline takes the decision&apos;s colour. When an item&apos;s selector matches several
        instances of a shared component, the first gets the full outline and the others a dim one.
      </Text>
      <Text size="lg" tone="secondary">Opening an item shows a panel with:</Text>
      <ul>
        <li>the title, and for indirect items the breadcrumb chain;</li>
        <li>
          the diff per file, with line numbers: added lines green, changed orange, deleted red, and the changed words within
          a changed line highlighted;
        </li>
        <li>
          a <em>Changed since your last review</em> tag or a <em>carried over</em> note on a re-review;
        </li>
        <li>
          <strong>Before ⇄ after</strong>, when the base version was started: the same page before the change, side by side,
          with the item outlined there too. The before view is read-only;
        </li>
        <li>the plain-language summary, plus <em>Affects</em>, <em>How to reach</em> and an <em>appears unused</em> warning where they apply;</li>
        <li>Approve, Reject and Comment, a comment box and Submit. Reject and Comment need text.</li>
      </ul>
      <Text size="lg" tone="secondary">
        Click a diff line to anchor a rejection or comment on that line; click it again to go back to the item&apos;s first
        change. The anchored line goes into the manifest and the inline GitHub comment.
      </Text>
      <Text size="lg" tone="secondary">
        Decisions are written to the manifest immediately. <strong>Reset</strong> clears an item back to undecided. Press{" "}
        <Code>Esc</Code> or ✕ to close a panel.
      </Text>

      <Title order={2}>Finishing</Title>
      <Text size="lg" tone="secondary">
        <strong>Finish</strong> makes the proxy, not the agent, post the review with <Code>gh</Code>, mark the manifest
        finished and exit. Claude is re-invoked when it exits and reports the outcome, then stops the dev server and removes
        the worktree. If posting fails, the error shows in the bar and you can click Finish again. Undecided items are
        allowed: the first click on Finish shows how many are left, and a second click posts anyway, listing them as not
        reviewed.
      </Text>
      <Text size="lg" tone="secondary">
        With no open PR, for example when reviewing a bare commit, nothing is posted and only the manifest is saved.
      </Text>

      <Title order={2}>What gets posted</Title>
      <Text size="lg" tone="secondary">One GitHub review per session, on the reviewed head commit.</Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Review event</TableHead>
            <TableHead>When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Code>REQUEST_CHANGES</Code>
            </TableCell>
            <TableCell>Any item is rejected.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Code>APPROVE</Code>
            </TableCell>
            <TableCell>Every item is approved.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Code>COMMENT</Code>
            </TableCell>
            <TableCell>Anything else, and always on your own PR, which GitHub won&apos;t let you approve or reject.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Text size="lg" tone="secondary">
        Each rejected or commented item becomes one inline comment: on the line you picked, or else on its first changed
        hunk, on the added lines (or the deleted lines when nothing was added). If the item spans more files, the comment
        lists them under “Also covers”. Approved items get no inline comment; they&apos;re listed under{" "}
        <em>Approved</em> in the review body, so “reviewed and fine” is distinguishable from “nobody looked”.
      </Text>
      <ul>
        <li>
          Rejected: <Code>❌ Rejected: &lt;reason&gt;</Code>
        </li>
        <li>
          Comment: <Code>💬 &lt;comment&gt;</Code>
        </li>
        <li>Backstage items add <em>Not visually verified.</em></li>
      </ul>
      <Text size="lg" tone="secondary">
        The review body summarises the counts, the test result, new env vars, approved items, rejections, items not
        reviewed, and items with no line changes (such as binary files) that can&apos;t take an inline comment. If the
        PR&apos;s head moved on while you were reviewing, the body says so: the review is still posted on the commit you
        reviewed, and its inline comments may show as outdated.
      </Text>
    </>
  );
}
