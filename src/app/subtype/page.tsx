"use server";
import { Metadata } from "next";
import Link from "next/link";
import { Body } from "@components";
import { baseMetadata } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Pokémon Card Subtypes",
  description:
    "Explore different Pokémon card subtypes including TAG TEAM, Mega Evolution, BREAK, and EX cards. Browse through our comprehensive collection of special Pokémon card variants.",
  keywords: [
    "pokemon",
    "tcg",
    "tag team",
    "mega evolution",
    "break",
    "ex",
    "pokemon tcg",
    "special cards",
    "card subtypes",
  ],
  openGraph: {
    title: "Pokémon Card Subtypes",
    description:
      "Explore different Pokémon card subtypes including TAG TEAM, Mega Evolution, BREAK, and EX cards. Browse through our comprehensive collection of special Pokémon card variants.",
    url: "https://pokemon.bermeo.dev/subtype",
    section: "Card Subtypes",
    locale: "en_US",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

const subtypes = [
  {
    name: "TAG TEAM",
    description:
      "Powerful team-up cards featuring two Pokémon working together",
    href: "/subtype/tag-team",
    bgColor: "bg-red-100 dark:bg-red-900",
    hoverColor: "hover:bg-red-200 dark:hover:bg-red-800",
    textColor: "text-red-900 dark:text-red-100",
  },
  {
    name: "V-MAX",
    description: "Gigantic Pokémon with massive power and HP",
    href: "/subtype/v-max",
    bgColor: "bg-purple-100 dark:bg-purple-900",
    hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-800",
    textColor: "text-purple-900 dark:text-purple-100",
  },
  {
    name: "Baby Pokémon",
    description: "Adorable pre-evolved forms with special abilities",
    href: "/subtype/baby",
    bgColor: "bg-pink-100 dark:bg-pink-900",
    hoverColor: "hover:bg-pink-200 dark:hover:bg-pink-800",
    textColor: "text-pink-900 dark:text-pink-100",
  },
  {
    name: "Mega Evolution",
    description: "The ultimate evolved form of certain Pokémon species",
    href: "/subtype/mega",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800",
    textColor: "text-blue-900 dark:text-blue-100",
  },
  {
    name: "BREAK Evolution",
    description: "Special evolution cards that break the normal rules",
    href: "/subtype/break",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    hoverColor: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
    textColor: "text-yellow-900 dark:text-yellow-100",
  },
  {
    name: "EX",
    description: "Powerful Pokémon-EX cards with special abilities",
    href: "/subtype/ex",
    bgColor: "bg-emerald-100 dark:bg-emerald-900",
    hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-800",
    textColor: "text-emerald-900 dark:text-emerald-100",
  },
];

export default async function SubtypePage() {
  return (
    <Body className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pokémon Card Subtypes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our collection of special Pokémon card variants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subtypes.map((subtype) => (
            <Link
              key={subtype.name}
              href={subtype.href}
              className={`${subtype.bgColor} ${subtype.hoverColor} rounded-lg p-6 transition-colors duration-200 shadow-lg`}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2
                    className={`text-2xl font-bold mb-2 ${subtype.textColor}`}
                  >
                    {subtype.name}
                  </h2>
                  <p className={`${subtype.textColor} opacity-90`}>
                    {subtype.description}
                  </p>
                </div>
                <div
                  className={`mt-4 text-sm font-medium ${subtype.textColor}`}
                >
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
