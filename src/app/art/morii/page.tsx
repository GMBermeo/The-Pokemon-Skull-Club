"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Yuka Morii's Art",
  description:
    "Browse Yuka Morii's charming Pokémon card artwork collection. Experience their unique clay model art style that brings Pokémon to life in 3D. Features a complete gallery of their distinctive illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "yuka Morii",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Yuka Morii's Pokémon Card Art",
    description:
      "Browse Yuka Morii's charming Pokémon card artwork collection. Experience their unique clay model art style that brings Pokémon to life in 3D. Features a complete gallery of their distinctive illustrations with detailed card information and high-quality images.",
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
        q: 'artist:"Yuka Morii" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Yuka Morii Page:", error);
    return [];
  }
}

export default async function TetsuoHaraPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Yuka Morii"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
