"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Rond's Art",
  description:
    "Browse Rond's elegant Pokémon card artwork collection. Experience their unique style featuring soft lines, masterful use of color, and regal compositions that bring a fresh perspective to the Pokémon TCG. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "rond",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Rond's Pokémon Card Art",
    description:
      "Browse Rond's elegant Pokémon card artwork collection. Experience their unique style featuring soft lines, masterful use of color, and regal compositions that bring a fresh perspective to the Pokémon TCG. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/rond",
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
        q: 'artist:"Rond" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Rond Page:", error);
    return [];
  }
}

export default async function RondPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Rond"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
