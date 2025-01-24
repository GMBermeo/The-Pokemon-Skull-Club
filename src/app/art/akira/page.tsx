"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
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
        q: 'artist:"Akira Egawa" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION -rarity:Uncommon -rarity:Common',
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Akira Egawa Page:", error);
    return [];
  }
}

export default async function AkiraEgawaPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Akira Egawa"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
