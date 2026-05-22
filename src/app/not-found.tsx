import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Body } from "@components";

export const metadata: Metadata = {
  title: "Page Not Found - Bone Club",
  description: "The page you are looking for could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound(): JSX.Element {
  return (
    <Body>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl">This card is not in the collection</h2>
        <p className="text-base opacity-80">
          The page you are looking for could not be found.
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Collection
        </Link>
      </div>
    </Body>
  );
}
