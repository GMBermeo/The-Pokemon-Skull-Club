"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "osare's Art",
  description:
    "Browse osare's distinctive Pokémon card artwork collection. Experience their unique rounded, cartoonish style that brings personality to each Pokémon, as showcased in their debut with Tatsugiri and Durant ex. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "osare",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "osare's Pokémon Card Art",
    description:
      "Browse osare's distinctive Pokémon card artwork collection. Experience their unique rounded, cartoonish style that brings personality to each Pokémon, as showcased in their debut with Tatsugiri and Durant ex. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/osare",
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
        q: 'artist:"osare" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at osare Page:", error);
    return [];
  }
}

export default async function OsarePage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"osare"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
