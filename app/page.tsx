import Image from "next/image";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { CopyText } from "./copy";
import { DemoVideo } from "./demo-video";
import { INSTALL, REPO } from "./site";

const VERSION = "v1.1.0";

const steps = [
  [
    "[1/4] Check out",
    [
      "worktree at .deltaview/wt/feat-checkout-summary",
      "copied .env, .env.local (not read)",
    ],
    "The branch goes into a temporary worktree, so your own checkout is never touched.",
  ],
  [
    "[2/4] Install and test",
    ["pnpm install --frozen-lockfile", "pnpm test: 214 passed, 2 failed"],
    "Dependencies install from your lockfile and your tests run. Failures are reported in the review, not fixed, and don't stop it.",
  ],
  [
    "[3/4] Anchor",
    ["41 hunks grouped into 12 items", "8 direct, 2 indirect, 2 backstage"],
    "Claude reads the diff, groups the hunks and finds the element each group affects. It navigates and reads the page; it never clicks.",
  ],
  [
    "[4/4] Review",
    ["opened localhost:4500 in Chrome"],
    "Your app opens behind a small proxy that draws the overlays. Decide on each item, then click Finish review.",
  ],
] as const;

const guarantees: [string, ReactNode][] = [
  [
    "Your app's data",
    "The agent only navigates by URL, scrolls and reads. No clicks, so no side effects against your backend.",
  ],
  [
    "Your working copy",
    <>
      Everything runs in a worktree. The only writes are to{" "}
      <code className="text-[14px]">.deltaview/</code>, which is added to{" "}
      <code className="text-[14px]">.git/info/exclude</code>.
    </>,
  ],
  [
    "Your secrets",
    ".env files are copied byte for byte and never printed. New env vars are reported by name only.",
  ],
  [
    "Your trust",
    "Anything it couldn't put on screen is marked not visually verified, in the overlay, on GitHub and in the manifest.",
  ],
];

const requirements: ReactNode[] = [
  "Claude Code with the Claude in Chrome extension",
  "Node.js 20 or later",
  "A web project whose dev server already runs locally",
  <>
    <code className="text-[14px]">gh</code> signed in, to post reviews
    (optional)
  </>,
];

const h2 =
  "m-0 text-[clamp(30px,3.2vw,40px)] font-bold leading-[1.1] tracking-[-0.02em]";
const wrap = "mx-auto max-w-[1200px] px-[24px]";
const tag =
  "absolute left-[-7px] rounded-t-[4px] bg-dv-mark px-[8px] font-dv-mono text-[11px] whitespace-nowrap text-white";
const hatch =
  "bg-[repeating-linear-gradient(135deg,transparent_0_7px,rgba(20,22,27,0.06)_7px_8px)]";

export default function Home() {
  return (
    <div className="dv min-h-full flex-1 bg-dv-paper font-dv text-dv-ink">
      <header
        className={`${wrap} flex flex-wrap items-center justify-between gap-[16px] py-[20px]`}
      >
        <NextLink href="/">
          {/* shortcut: logofulldark.png stacks a light variant under the dark one; crop to the top half until it's re-exported. */}
          <Image
            src="/logofulldark.png"
            alt="deltaview"
            width={891}
            height={415}
            priority
            className="aspect-[891/207] h-[34px] w-auto object-cover object-top"
          />
        </NextLink>
        <nav className="flex items-center gap-[28px] text-[16px]">
          <NextLink href="/docs" className="no-underline">
            Docs
          </NextLink>
          <a href={`${REPO}/releases`} className="text-dv-muted no-underline">
            {VERSION}
          </a>
          <a href={REPO} className="no-underline">
            GitHub
          </a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section
          className={`${wrap} flex flex-col gap-[48px] pt-[64px] pb-[104px]`}
        >
          <div className="flex flex-wrap items-end gap-x-[64px] gap-y-[32px]">
            <h1 className="m-0 flex-[3_1_520px] text-[clamp(44px,6vw,84px)] font-bold leading-[0.98] tracking-[-0.035em]">
              Review a branch where it renders.
            </h1>
            <div className="flex min-w-0 flex-[2_1_380px] flex-col gap-[20px]">
              <p className="m-0 text-[19px] leading-[1.5] text-dv-body">
                Run{" "}
                <code className="rounded-[4px] bg-dv-rule px-[6px] py-[2px] text-[15px]">
                  /deltaview feat/checkout
                </code>{" "}
                and your app opens in Chrome with an outline on every element
                the branch changes. Read each diff, approve or reject it, and
                post one GitHub review.
              </p>
              <InstallBox />
            </div>
          </div>
          <figure className="m-0 flex flex-col gap-[14px]">
            <div className="aspect-[16/10] overflow-hidden rounded-[12px] border border-dv-edge bg-white">
              <DemoVideo />
            </div>
            <figcaption className="max-w-[52em] text-[15px] leading-[1.5] text-dv-muted">
              A real run on a demo shop&apos;s{" "}
              <code className="text-[13px]">feat/checkout-summary</code> branch:
              the order summary is rejected because the shipping rule is
              duplicated, the other four items are approved, and Finish closes
              the review.
            </figcaption>
          </figure>
        </section>

        {/* Problem statement */}
        <section className="bg-dv-ink text-dv-paper">
          <div
            className={`${wrap} flex flex-wrap items-end gap-[48px] py-[96px]`}
          >
            <p className="m-0 flex-[2_1_520px] text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.12] tracking-[-0.02em]">
              A green build of 77 files tells you the branch works. It
              doesn&apos;t tell you where to look.
            </p>
            <p className="m-0 max-w-[30em] flex-[1_1_320px] text-[18px] leading-[1.55] text-dv-dim">
              So you pull it and click around wherever you suspect trouble.
              Deltaview turns that into a checklist: every changed hunk is
              pinned to something on screen or listed separately, and nothing
              gets skipped without saying so.
            </p>
          </div>
        </section>

        {/* How a run goes, shown as the command's own progress */}
        <section
          className={`${wrap} flex flex-col gap-[40px] pt-[112px] pb-[96px]`}
        >
          <h2 className={h2}>What happens when you run it</h2>
          <div className="overflow-hidden rounded-[10px] border border-dv-line bg-white">
            <div className="border-b border-dv-rule px-[24px] py-[16px] font-dv-mono text-[13px]">
              &gt; /deltaview feat/checkout-summary
            </div>
            {steps.map(([title, lines, body]) => (
              <div
                key={title}
                className="flex flex-wrap gap-x-[40px] gap-y-[8px] border-b border-dv-rule px-[24px] py-[22px] last:border-b-0"
              >
                <div className="min-w-0 flex-[1_1_360px] font-dv-mono text-[13px] leading-[1.7] text-dv-body">
                  <span className="font-medium text-dv-ink">{title}</span>
                  {lines.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
                <p className="m-0 flex-[1_1_340px] text-[17px] leading-[1.5]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tiers, told apart by outline style */}
        <section
          className={`${wrap} flex flex-col gap-[40px] pt-[48px] pb-[112px]`}
        >
          <div className="flex max-w-[40em] flex-col gap-[14px]">
            <h2 className={h2}>Every change lands in one of three places</h2>
            <p className="m-0 text-[18px] leading-[1.55] text-dv-body">
              Each hunk belongs to exactly one item. The outline tells you how
              directly it reaches the screen.
            </p>
          </div>
          <TierDemo />
          <div className="flex flex-wrap gap-x-[48px] gap-y-[32px]">
            <Tier
              name="Direct"
              swatch={<span className="w-[28px] border-t-2 border-dv-mark" />}
            >
              The changed code renders something. The outline sits on that
              element.
            </Tier>
            <Tier
              name="Indirect"
              swatch={
                <span className="w-[28px] border-t-2 border-dashed border-dv-mark" />
              }
            >
              The change is in a hook, handler or util that something on screen
              triggers. The outline sits on the trigger and shows the chain.
            </Tier>
            <Tier
              name="Backstage"
              swatch={
                <span className="h-[14px] w-[28px] border border-dv-edge bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(20,22,27,0.25)_4px_5px)]" />
              }
            >
              Migrations, CI, config, or UI hidden behind an interaction. Listed
              in a drawer and marked as not visually verified.
            </Tier>
          </div>
        </section>

        {/* What you get at the end */}
        <section className="border-y border-dv-line bg-white">
          <div className={`${wrap} flex flex-col gap-[40px] py-[112px]`}>
            <div className="flex max-w-[40em] flex-col gap-[14px]">
              <h2 className={h2}>Finish review leaves two things behind</h2>
              <p className="m-0 text-[18px] leading-[1.55] text-dv-body">
                A review on the pull request for the people, and a manifest for
                the next agent.
              </p>
            </div>
            <div className="flex flex-wrap gap-[32px]">
              <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[16px]">
                <div className="overflow-hidden rounded-[8px] border border-dv-line">
                  <div className="border-b border-dv-line bg-dv-raised px-[16px] py-[14px] text-[15px]">
                    <strong>you</strong> requested changes
                  </div>
                  <div className="border-b border-dv-rule font-dv-mono text-[12px] leading-[1.75]">
                    <div className="px-[16px] text-dv-muted">
                      src/checkout/Summary.tsx
                    </div>
                    <div className="bg-dv-del-bg px-[16px] text-dv-del">
                      - &lt;FreeShippingBanner /&gt;
                    </div>
                  </div>
                  <div className="m-[14px_16px] border-l-[3px] border-dv-del px-[16px] py-[14px] text-[15px] leading-[1.5]">
                    Rejected: the banner is still referenced in the cart drawer.
                  </div>
                </div>
                <p className="m-0 text-[16px] leading-[1.55] text-dv-body">
                  Posted through your <code className="text-[13px]">gh</code>{" "}
                  login. Each decision becomes an inline comment on its lines.
                  One rejection requests changes; all approved approves.
                </p>
              </div>
              <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[16px]">
                <pre className="m-0 overflow-x-auto rounded-[8px] bg-dv-ink px-[20px] py-[18px] text-[12px] leading-[1.75] text-dv-rule">
                  {`.deltaview/reviews/feat-checkout-summary.json
{
  "ref": "feat/checkout-summary",
  "tests": { "passed": 214, "failed": 2 },
  "items": [
    { "tier": "direct",
      "route": "/checkout",
      "decision": "rejected",
      "comment": "banner still used in cart" },
    …
  ]
}`}
                </pre>
                <p className="m-0 text-[16px] leading-[1.55] text-dv-body">
                  Written as JSON and Markdown after every decision. Hand it to
                  a follow-up agent with “fix the rejected items”, or stop
                  halfway and run the command again to resume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section
          className={`${wrap} flex flex-wrap gap-x-[64px] gap-y-[40px] py-[112px]`}
        >
          <h2 className={`${h2} flex-[1_1_280px]`}>What it won&apos;t touch</h2>
          <dl className="m-0 min-w-0 flex-[2_1_560px]">
            {guarantees.map(([term, body]) => (
              <div
                key={term}
                className="flex flex-wrap gap-x-[32px] gap-y-[6px] border-t border-dv-edge py-[20px] last:border-b"
              >
                <dt className="flex-[1_1_200px] text-[18px] font-semibold">
                  {term}
                </dt>
                <dd className="m-0 flex-[2_1_320px] text-[17px] leading-[1.5] text-dv-body">
                  {body}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Install */}
        <section className="bg-dv-ink text-dv-paper">
          <div
            className={`${wrap} flex flex-wrap items-start gap-x-[64px] gap-y-[40px] py-[96px]`}
          >
            <div className="flex flex-[1_1_380px] flex-col gap-[16px]">
              <h2 className={h2}>Install</h2>
              <ul className="m-0 list-disc pl-[20px] text-[17px] leading-[1.7] text-dv-dim">
                {requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-[16px]">
              <InstallBox dark />
              <p className="m-0 text-[16px] text-dv-dim">
                Then run{" "}
                <code className="text-[14px] text-dv-paper">
                  /deltaview &lt;branch&gt;
                </code>
                .{" "}
                <NextLink
                  href="/docs"
                  className="text-dv-mark hover:text-dv-paper"
                >
                  Read the setup guide
                </NextLink>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer
        className={`${wrap} flex flex-wrap justify-between gap-[12px] py-[28px] text-[15px] text-dv-muted`}
      >
        <span>A Claude Code plugin by David Eriksson</span>
        <span className="flex gap-[24px]">
          <a href={REPO}>Source</a>
          <a href={`${REPO}/releases`}>Releases</a>
        </span>
      </footer>
    </div>
  );
}

function InstallBox({ dark }: { dark?: boolean }) {
  return (
    <div
      className={`flex justify-between gap-[12px] rounded-[8px] border ${
        dark
          ? "items-start border-dv-body py-[16px] pr-[16px] pl-[20px]"
          : "items-center border-dv-line bg-white py-[12px] pr-[12px] pl-[16px]"
      }`}
    >
      <pre
        className={`m-0 leading-[1.8] break-words whitespace-pre-wrap ${
          dark ? "text-[13px] text-dv-paper" : "text-[12px]"
        }`}
      >
        {INSTALL}
      </pre>
      <CopyText
        value={INSTALL}
        className={`min-h-[44px] flex-none cursor-pointer rounded-[6px] border px-[14px] text-[14px] font-medium ${
          dark
            ? "border-dv-body bg-transparent text-dv-paper"
            : "border-dv-line bg-dv-paper text-dv-ink"
        }`}
      />
    </div>
  );
}

function TierDemo() {
  return (
    <div
      role="img"
      aria-label="Illustration: a card with a solid outline, a button with a dashed outline and its call chain, and a backstage drawer listing files"
      className="flex flex-wrap items-start gap-x-[48px] gap-y-[40px] rounded-[12px] bg-dv-well px-[28px] py-[40px]"
    >
      <div className="flex min-w-0 flex-[2_1_420px] flex-col gap-[40px]">
        <div className="relative">
          <div className="flex flex-col gap-[8px] rounded-[8px] bg-white px-[20px] py-[18px]">
            <div className="font-semibold">Order summary</div>
            <Row a="3 items" b="$84.00" />
          </div>
          <div className="absolute inset-[-7px] rounded-[11px] border-2 border-dv-mark" />
          <div className={`${tag} top-[-30px] py-[3px]`}>Direct</div>
        </div>
        <div className="flex flex-col items-start gap-[14px]">
          <div className="relative">
            <span className="inline-flex min-h-[44px] items-center rounded-[6px] bg-dv-ink px-[22px] font-semibold text-white">
              Save order
            </span>
            <div className="absolute inset-[-7px] rounded-[10px] border-2 border-dashed border-dv-mark" />
            <div className={`${tag} top-[-30px] py-[3px]`}>Indirect</div>
          </div>
          <code className="box-border max-w-full overflow-x-auto rounded-[6px] bg-white px-[12px] py-[8px] text-[12px] leading-[1.6] whitespace-nowrap text-dv-body">
            Save order → useSaveOrder() → POST /api/orders → orders.handler.ts
          </code>
        </div>
      </div>
      <div className="min-w-0 flex-[1_1_260px] overflow-hidden rounded-[8px] border border-dv-edge bg-white">
        <div className="border-b border-dv-rule px-[16px] py-[14px] font-semibold">
          Backstage drawer
        </div>
        <div className={`${hatch} py-[6px]`}>
          {[".github/workflows/ci.yml", "db/migrations/0042_shipping.sql"].map(
            (f) => (
              <div key={f} className="px-[16px] py-[10px]">
                <code className="text-[12px]">{f}</code>
              </div>
            ),
          )}
        </div>
        <div className="border-t border-dv-rule px-[16px] py-[12px] text-[14px] text-dv-muted">
          Not visually verified
        </div>
      </div>
    </div>
  );
}

function Tier({
  name,
  swatch,
  children,
}: {
  name: string;
  swatch: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-[1_1_280px] flex-col gap-[10px]">
      <div className="flex items-center gap-[12px] text-[20px] font-bold">
        <span aria-hidden className="contents">
          {swatch}
        </span>
        {name}
      </div>
      <p className="m-0 text-[17px] leading-[1.5] text-dv-body">{children}</p>
    </div>
  );
}

function Row({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex justify-between text-dv-muted">
      <span>{a}</span>
      <span>{b}</span>
    </div>
  );
}
