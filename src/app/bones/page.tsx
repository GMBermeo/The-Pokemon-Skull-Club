"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardGrid } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Bone Club - Cubones & Marowaks",
  description:
    "'It has been seen pounding boulders with the bone it carries in order to tap out messages to others.' 🦴 This tool was developed using the SSG with Next.js 15 in order to index all the cubone and marowak cards from Pokémon TCG for a private collection. 🦴 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "cubone",
    "marowak",
    "bones",
    "pokemon tcg",
    "boneclub",
  ],
  openGraph: {
    title: "Bone Club - Cubones & Marowaks",
    description:
      "'It has been seen pounding boulders with the bone it carries in order to tap out messages to others.' 🦴 This tool was developed using the SSG with Next.js 15 in order to index all the cubone and marowak cards from Pokémon TCG for a private collection. 🦴 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/bones",
    section: "Bone Club",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/bones/boneclub1.jpg",
        width: 366,
        height: 366,
      },
      {
        url: "https://pokemon.bermeo.dev/bones/boneclub2.jpg",
        width: 325,
        height: 403,
      },
      {
        url: "https://pokemon.bermeo.dev/bones/marowak.png",
        width: 250,
        height: 250,
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData() {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:[104 TO 105] -set.id:mcd*",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    return [];
  }
}

export default async function BoneClubPage() {
  const cards = await getData();

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white px-4 py-2">
      <div className="font-bold space-y-2 mb-4 justify-between flex w-full">
        <div>
          <h1 className="text-4xl">Bone Club</h1>
          <h2 className="text-xl">Cubones & Marowaks</h2>
        </div>
        <h3 className="text-lg">
          {cards.length} cards | {Math.ceil(cards.length / 4)} pages.
        </h3>
      </div>
      <CardGrid cardCollection={cards} />
    </div>
  );
}
