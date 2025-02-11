"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "USGMEN's Art",
  description:
    "Browse USGMEN's whimsical Pokémon card artwork collection. Experience their unique style featuring simple yet expressive faces with dot eyes and straight-line mouths, bringing a fresh and cute perspective to Pokémon illustrations. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "usgmen",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "USGMEN's Pokémon Card Art",
    description:
      "Browse USGMEN's whimsical Pokémon card artwork collection. Experience their unique style featuring simple yet expressive faces with dot eyes and straight-line mouths, bringing a fresh and cute perspective to Pokémon illustrations. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/usgmen",
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
        q: 'artist:"USGMEN" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at USGMEN Page:", error);
    return [];
  }
}

export default async function USGMENPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"USGMEN"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
