"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Yuriko Akase's Art",
  description:
    "Browse Yuriko Akase's heartwarming Pokémon card artwork collection. Experience their unique slice-of-life style that captures Pokémon in everyday moments, helping humans and enjoying peaceful activities. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "yuriko akase",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Yuriko Akase's Pokémon Card Art",
    description:
      "Browse Yuriko Akase's heartwarming Pokémon card artwork collection. Experience their unique slice-of-life style that captures Pokémon in everyday moments, helping humans and enjoying peaceful activities. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/yuriko-akase",
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
        q: 'artist:"Yuriko Akase" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Yuriko Akase Page:", error);
    return [];
  }
}

export default async function YurikoAkasePage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Yuriko Akase"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
