import { Code, CopyButton } from "@fanzeal-intl/ui";

export const REPO = "https://github.com/DavidAEriksson/deltaview";
export const INSTALL = "/plugin marketplace add DavidAEriksson/deltaview\n/plugin install deltaview@deltaview";

/** A shell/prompt snippet with a copy button. */
export function Command({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-sm rounded-md border border-border-subtle bg-bg-surface py-xs pr-xs pl-md">
      <Code block className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-sm">
        {children}
      </Code>
      <CopyButton value={children} />
    </div>
  );
}
