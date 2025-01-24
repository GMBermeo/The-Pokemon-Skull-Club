"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardGrid } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Totodile Evolution Line",
  description:
    "'Despite its small body, Totodile's jaws are very powerful. While it may think it is just playfully nipping, its bite has enough strength to cause serious injury.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Totodile, Croconaw and Feraligatr cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "totodile",
    "croconaw",
    "feraligatr",
    "water",
    "pokemon tcg",
    "johto",
  ],
  openGraph: {
    title: "Totodile Evolution Line",
    description:
      "'Despite its small body, Totodile's jaws are very powerful. While it may think it is just playfully nipping, its bite has enough strength to cause serious injury.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Totodile, Croconaw and Feraligatr cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/toto",
    section: "Totodile",
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
        q: "nationalPokedexNumbers:[158 TO 160] -set.id:mcd*",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    return [];
  }
}

export default async function TotodilePage() {
  const cards = await getData();

  return (
    <div className="flex flex-col items-center justify-center bg-sky-50 dark:bg-slate-950 text-sky-950 dark:text-white px-4 py-2">
      <div className="font-bold space-y-2 mb-4 justify-between sm:flex-col md:flex-row flex w-full">
        <div>
          <h1 className="text-4xl">Totó</h1>
          <h2 className="text-xl">Totodile, Croconaw & Feraligatr</h2>
        </div>
        <h3 className="text-lg">
          {cards.length} cards | {Math.ceil(cards.length / 4)} pages
        </h3>
      </div>
      <CardGrid cardCollection={cards} />
    </div>
  );
}
