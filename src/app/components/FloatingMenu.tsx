"use client";
import { useState } from "react";
import Link from "next/link";

interface Route {
  path: string;
  label: string;
  className: string;
}

const routes: Route[] = [
  {
    path: "/",
    label: "Home - 151 Original Pokémons",
    className: "text-red-500",
  },
  {
    path: "/art/akira",
    label: "Akira Egawa's Art",
    className: "text-slate-500",
  },
  {
    path: "/art/arita",
    label: "Mitsuhiro Arita's Art",
    className: "text-slate-500",
  },
  {
    path: "/bones",
    label: "Bone Club - Cubones & Marowaks",
    className: "text-amber-500",
  },
  { path: "/charizard", label: "Charizards", className: "text-orange-500" },
  { path: "/lucario", label: "Riolus & Lucarios", className: "text-cyan-500" },
  { path: "/pikachu", label: "Pikachus", className: "text-yellow-400" },
  { path: "/psyduck", label: "Psyducks", className: "text-yellow-500" },
  {
    path: "/sudowoodo",
    label: "Bonsly & Sudowoodo",
    className: "text-stone-500",
  },
  {
    path: "/toto",
    label: "Totodile Evolution Line",
    className: "text-blue-500",
  },
];

export const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Always present in HTML for SEO, but visually hidden */}
      <nav className="sr-only" aria-label="Site Navigation">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            {route.label}
          </Link>
        ))}
      </nav>

      {/* Visual floating menu for users */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-800 rounded-full p-4 shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="floating-navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        <div
          id="floating-navigation"
          className={`absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-700 rounded-lg shadow-xl transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <nav className="py-3" aria-hidden={!isOpen}>
            <h3 className="text-slate-800 dark:text-slate-100 font-medium p-4">
              Pages
            </h3>
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setIsOpen(false)}
              >
                <li className={`list-disc mr-0 ${route.className}`}>
                  <span className="text-slate-800 dark:text-slate-100">
                    {route.label}
                  </span>
                </li>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
