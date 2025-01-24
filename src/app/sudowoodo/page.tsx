"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardGrid } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Bonsly & Sudowoodo",
  description:
    "'Although it always pretends to be a tree, its body is actually more like rock than like plant material.' 🌳 This tool was developed using the SSG with Next.js 15 in order to index all the Sudowoodo and Bonsly cards from Pokémon TCG for a private collection. 🌳 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "sudowoodo",
    "bonsly",
    "rock",
    "tree",
    "pokemon tcg",
    "imitation",
  ],
  openGraph: {
    title: "Bonsly & Sudowoodo",
    description:
      "'Although it always pretends to be a tree, its body is actually more like rock than like plant material.' 🌳 This tool was developed using the SSG with Next.js 15 in order to index all the Sudowoodo and Bonsly cards from Pokémon TCG for a private collection. 🌳 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/sudowoodo",
    section: "Sudowoodo",
    locale: "en_US",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData() {
  try {
    const sudowoodoResponse = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:185 -set.id:mcd*",
        orderBy: "-set.releaseDate",
      })
    );

    const bonslyResponse = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:438 -set.id:mcd*",
        orderBy: "-set.releaseDate",
      })
    );

    return [...sudowoodoResponse, ...bonslyResponse].sort((a, b) => {
      return (
        new Date(b.set.releaseDate).getTime() -
        new Date(a.set.releaseDate).getTime()
      );
    });
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    return [];
  }
}

export default async function SudowoodoPage() {
  const cards = await getData();

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white px-4 py-2">
      <div className="font-bold space-y-2 mb-4 justify-between flex w-full">
        <div>
          <h1 className="text-4xl">Os cara de pau</h1>
          <h2 className="text-xl">Sudowoodo & Bonsly</h2>
        </div>
        <h3 className="text-lg">
          {cards.length} cards | {Math.ceil(cards.length / 4)} pages
        </h3>
      </div>
      <CardGrid cardCollection={cards} />
    </div>
  );
}
