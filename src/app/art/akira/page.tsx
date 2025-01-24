"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { CardGrid } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Akira Egawa's Art",
  description:
    "🎨 This tool was developed using the SSG with Next.js 15 in order to index all Pokémon TCG cards illustrated by Akira Egawa. Known for their distinctive art style and dynamic compositions, Egawa has contributed many memorable illustrations to the Pokémon Trading Card Game. 🎨 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "akira egawa",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Akira Egawa's Pokémon Card Art",
    description:
      "🎨 This tool was developed using the SSG with Next.js 15 in order to index all Pokémon TCG cards illustrated by Akira Egawa. Known for their distinctive art style and dynamic compositions, Egawa has contributed many memorable illustrations to the Pokémon Trading Card Game. 🎨 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/art/akira",
    section: "Artist Gallery",
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
        q: 'artist:"Akira Egawa" -set.id:mcd* supertype:"Pokémon" -subtypes:Union -rarity:Uncommon -rarity:Common',
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    return [];
  }
}

export default async function AkiraEgawaPage() {
  const cards = await getData();

  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white px-4 py-2">
      <div className="font-bold space-y-2 mb-4 justify-between sm:flex-col md:flex-row flex w-full">
        <div>
          <h1 className="text-4xl">Akira Egawa</h1>
          <h2 className="text-xl">Pokémon Card Artist</h2>
        </div>
        <h3 className="text-lg">
          {cards.length} cards | {Math.ceil(cards.length / 4)} pages.
        </h3>
      </div>
      <CardGrid cardCollection={cards} />
    </div>
  );
}
