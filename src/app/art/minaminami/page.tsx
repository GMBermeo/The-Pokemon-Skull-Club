"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "MINAMINAMI Take's Art",
  description:
    "Browse MINAMINAMI Take's charming Pokémon card artwork collection. Experience their unique impressionist-inspired style that captures heartwarming moments between Pokémon, as showcased in their debut promo card featuring Charmander watching a Pidgey. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "minaminami take",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "MINAMINAMI Take's Pokémon Card Art",
    description:
      "Browse MINAMINAMI Take's charming Pokémon card artwork collection. Experience their unique impressionist-inspired style that captures heartwarming moments between Pokémon, as showcased in their debut promo card featuring Charmander watching a Pidgey. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/minaminami",
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
        q: 'artist:"MINAMINAMI Take" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error(
      "Error fetching Pokemon cards at MINAMINAMI Take Page:",
      error
    );
    return [];
  }
}

export default async function MINAMINAMITakePage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"MINAMINAMI Take"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
