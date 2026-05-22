import type { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-800">
      <div
        role="status"
        aria-label="Loading"
        className="size-12 rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100 animate-spin"
      />
    </div>
  );
}
