"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardGrid } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Charizards",
  description:
    "'Charizard flies around the sky in search of powerful opponents. It breathes intense flames that can melt any material. However, it never turns its fiery breath on any opponent weaker than itself.' 🔥 This tool was developed using the SSG with Next.js 15 in order to index all the Charizard cards from Pokémon TCG for a private collection. 🔥 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "charizard",
    "fire",
    "dragon",
    "pokemon tcg",
    "flame",
  ],
  openGraph: {
    title: "Charizards",
    description:
      "'Charizard flies around the sky in search of powerful opponents. It breathes intense flames that can melt any material. However, it never turns its fiery breath on any opponent weaker than itself.' 🔥 This tool was developed using the SSG with Next.js 15 in order to index all the Charizard cards from Pokémon TCG for a private collection. 🔥 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/charizard",
    section: "Charizard",
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
        q: "nationalPokedexNumbers:6 -set.id:mcd*",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    return [];
  }
}

export default async function CharizardPage() {
  const cards = await getData();

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white px-4 py-2">
      <div className="font-bold space-y-2 mb-4 justify-between sm:flex-col md:flex-row flex w-full">
        <div>
          <h1 className="text-4xl">Charizard</h1>
          <h2 className="text-xl">The Flame non-dragon</h2>
        </div>
        <h3 className="text-lg">
          {cards.length} cards | {Math.ceil(cards.length / 4)} pages.
        </h3>
      </div>
      <CardGrid cardCollection={cards} />
    </div>
  );
}
