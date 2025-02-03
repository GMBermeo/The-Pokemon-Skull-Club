"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "mingo's Art",
  description:
    "Browse mingo's vibrant Pokémon card artwork collection. Experience their unique style featuring bright, groovy color gradients and creative backgrounds that enhance each Pokémon's personality. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "mingo",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "mingo's Pokémon Card Art",
    description:
      "Browse mingo's vibrant Pokémon card artwork collection. Experience their unique style featuring bright, groovy color gradients and creative backgrounds that enhance each Pokémon's personality. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/mingo",
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
        q: 'artist:"mingo" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at mingo Page:", error);
    return [];
  }
}

export default async function MingoPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"mingo"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
