import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full print:hidden">
      <div className="py-4 px-4 md:px-8 max-w-screen-2xl flex flex-col mx-auto">
        <div className="flex justify-between ">
          <Link
            href="/"
            className="hidden opacity-50 hover:opacity-100 dark:opacity-100 md:block"
          >
            <Image
              src="/logo.svg"
              height={36}
              width={36}
              alt="Bone Club - A Private Pokémon TCG Collection Logo"
              priority
            />
          </Link>
          <div className="my-auto">
            <h4 className="text-sm font-semibold dark:text-slate-100 text-slate-900 md:text-base">
              <Link href="https://www.bermeo.dev">
                Developed by Guilherme Bermeo
              </Link>
            </h4>
          </div>
          <div className="flex justify-end gap-x-4 md:gap-x-6">
            <Link href="https://github.com/GMBermeo">
              <Image
                src="/social/github.svg"
                height={36}
                width={36}
                alt="Github Invertocat Logo"
                className="dark:invert"
                priority
              />
            </Link>
            <Link href="https://www.linkedin.com/in/gmbermeo/">
              <Image
                src="/social/linkedin.svg"
                height={36}
                width={36}
                alt="Linkedin Logo"
                className="dark:invert"
                priority
              />
            </Link>
          </div>
        </div>
        <p className="mt-0 hidden text-center text-xs text-slate-500 lg:block">
          This website is not produced, endorsed, supported, or affiliated with
          Nintendo or The Pokémon Company.
        </p>
      </div>
    </footer>
  );
};
