import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Body } from "@components";
import { artists, buildMetadata } from "@lib";

export const metadata: Metadata = buildMetadata({
  path: "/art",
  title: "Pokémon Card Artists",
  description:
    "Explore the diverse styles of Pokémon card artists, from legendary illustrators to modern masters. Browse through our comprehensive collection of artwork featuring traditional, digital, and unique artistic approaches that bring Pokémon to life.",
  keywords: [
    "pokemon",
    "tcg",
    "artists",
    "illustrators",
    "art",
    "pokemon tcg",
    "card art",
    "card artists",
  ],
});

export default function ArtistsPage(): JSX.Element {
  return (
    <Body className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pokémon Card Artists
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover the unique styles of Pokémon TCG&apos;s most talented
            illustrators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/art/${artist.slug}`}
              className={`${artist.bgColor} ${artist.hoverColor} rounded-lg p-6 transition-colors duration-200 shadow-lg`}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${artist.textColor}`}>
                    {artist.name}
                  </h2>
                  <p className={`${artist.textColor} opacity-90`}>
                    {artist.description}
                  </p>
                </div>
                <div className={`mt-4 text-sm font-medium ${artist.textColor}`}>
                  View Collection →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Body>
  );
}
