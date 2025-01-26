import React from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  subtitle: string;
  totalCards: number;
  slotsPerPage?: number;
}

export const Header = (props: HeaderProps) => {
  return (
    <div className="font-bold space-y-2 mb-4 justify-between flex flex-col md:flex-row w-full">
      <div>
        <Link href="/">
          <h1 className="text-4xl">{props.title}</h1>{" "}
        </Link>
        <h2 className="text-xl">{props.subtitle}</h2>
      </div>
      <h3 className="text-lg">
        {props.totalCards} cards |{" "}
        {Math.ceil(props.totalCards / (props.slotsPerPage ?? 4))} pages.
      </h3>
    </div>
  );
};
