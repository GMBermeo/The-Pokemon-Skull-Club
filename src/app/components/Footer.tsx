import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer(): JSX.Element {
  return (
    <footer className="w-full print:hidden max-w-full">
      <div className="py-4 px-4 md:px-8 max-w-screen-2xl flex flex-col mx-auto mr-0 md:mr-12">
        <div className="flex justify-between sm:flex-col md:flex-row">
          <Link
            href="/"
            className="hidden opacity-50 hover:opacity-100 dark:opacity-100 md:block"
            aria-label="Bone Club home"
          >
            <Image
              src="/logo.svg"
              height={36}
              width={36}
              alt="Bone Club logo"
            />
          </Link>
          <div className="my-auto">
            <h4 className="text-sm font-semibold dark:text-slate-100 text-slate-900 md:text-base">
              <Link
                href="https://www.bermeo.dev"
                rel="author noopener noreferrer"
                target="_blank"
              >
                Developed by Guilherme Bermeo
              </Link>
            </h4>
          </div>
          <nav
            aria-label="Social links"
            className="flex justify-end gap-x-4 md:gap-x-6 md:mr-4 lg:mr-0"
          >
            <Link
              href="https://github.com/GMBermeo"
              rel="me noopener noreferrer"
              target="_blank"
              aria-label="GitHub profile"
            >
              <Image
                src="/social/github.svg"
                height={36}
                width={36}
                alt="GitHub"
                className="dark:invert"
                loading="lazy"
              />
            </Link>
            <Link
              href="https://www.linkedin.com/in/gmbermeo/"
              rel="me noopener noreferrer"
              target="_blank"
              aria-label="LinkedIn profile"
            >
              <Image
                src="/social/linkedin.svg"
                height={36}
                width={36}
                alt="LinkedIn"
                className="dark:invert"
                loading="lazy"
              />
            </Link>
          </nav>
        </div>
        <p className="text-center text-xs text-slate-500 block mb-12 md:mb-1 mt-1 md:mt-0">
          This website is not produced, endorsed, supported, or affiliated with
          Nintendo or The Pokémon Company.
        </p>
      </div>
    </footer>
  );
}
