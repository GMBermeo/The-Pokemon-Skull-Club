"use client";

import type { JSX } from "react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white text-center gap-4">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-base opacity-80 max-w-prose">
        An unexpected error occurred while loading this page. The team has been
        notified.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
