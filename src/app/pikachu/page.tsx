"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardGrid } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Pikachus",
  description:
    "'When several of these Pokémon gather, their electricity can build and cause lightning storms. It keeps its tail raised to monitor its surroundings.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Pikachu cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "pikachu",
    "electric",
    "mouse",
    "pokemon tcg",
    "thunderbolt",
  ],
  openGraph: {
    title: "Pikachus",
    description:
      "'When several of these Pokémon gather, their electricity can build and cause lightning storms. It keeps its tail raised to monitor its surroundings.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Pikachu cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/pikachu",
    section: "Pikachu",
    locale: "en_US",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData() {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:25 -set.id:mcd*",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    return [];
  }
}

export default async function PikachuPage() {
  const cards = await getData();

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white px-4 py-2">
      <div className="font-bold space-y-2 mb-4 justify-between flex w-full">
        <div>
          <h1 className="text-4xl">Pikachu</h1>
          <h2 className="text-xl">The Mouse Pokémon</h2>
        </div>
        <h3 className="text-lg">
          {cards.length} cards | {Math.ceil(cards.length / 4)} pages.
        </h3>
      </div>
      <CardGrid cardCollection={cards} />
    </div>
  );
}
