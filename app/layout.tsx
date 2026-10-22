import type { Metadata } from "next";
import { Familjen_Grotesk, Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const familjen = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-familjen" });
const martian = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-martian" });

export const metadata: Metadata = {
  title: { default: "Deltaview: visual review for your branch", template: "%s · Deltaview" },
  description:
    "A Claude Code plugin that opens your app in Chrome with overlays on every element a branch changes. Approve, reject or comment, then post one GitHub review.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${familjen.variable} ${martian.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
