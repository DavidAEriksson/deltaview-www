import { Code, CopyButton } from "@fanzeal-intl/ui";

export const REPO = "https://github.com/DavidAEriksson/deltaview";
export const INSTALL = "/plugin marketplace add DavidAEriksson/deltaview\n/plugin install deltaview@deltaview";

/** A shell/prompt snippet with a copy button. */
export function Command({ children }: { children: string }) {
  return (
    <div className="relative">
      <Code block className="pr-3xl">
        {children}
      </Code>
      <CopyButton value={children} className="absolute right-xs top-xs" />
    </div>
  );
}
