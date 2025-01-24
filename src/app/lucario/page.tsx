"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardGrid } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Riolus & Lucarios",
  description:
    "'By catching the aura emanating from others, it can read their thoughts and movements.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Riolu and Lucario cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "riolu",
    "lucario",
    "aura",
    "pokemon tcg",
    "aurasphere",
  ],
  openGraph: {
    title: "Riolus & Lucarios",
    description:
      "'By catching the aura emanating from others, it can read their thoughts and movements.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Riolu and Lucario cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/lucario",
    section: "Lucario",
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
        q: "nationalPokedexNumbers:[447 TO 448] -set.id:mcd*",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    return [];
  }
}

export default async function AuraSpherePage() {
  const cards = await getData();

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white px-4 py-2">
      <div className="font-bold space-y-2 mb-4 justify-between flex w-full">
        <div>
          <h1 className="text-4xl">Aura Sphere</h1>
          <h2 className="text-xl">Riolus & Lucarios</h2>
        </div>
        <h3 className="text-lg">
          {cards.length} cards | {Math.ceil(cards.length / 4)} pages.
        </h3>
      </div>
      <CardGrid cardCollection={cards} />
    </div>
  );
}
