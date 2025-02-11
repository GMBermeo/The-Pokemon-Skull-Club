"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "REND's Art",
  description:
    "Browse REND's charming Pokémon card artwork collection. Experience their award-winning style that captures the daily life of Pokémon with soft lighting and natural scenes, as showcased in their Illustration Contest winning Arcanine. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "rend",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
    "contest winner",
  ],
  openGraph: {
    title: "REND's Pokémon Card Art",
    description:
      "Browse REND's charming Pokémon card artwork collection. Experience their award-winning style that captures the daily life of Pokémon with soft lighting and natural scenes, as showcased in their Illustration Contest winning Arcanine. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/rend",
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
        q: 'artist:"REND" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at REND Page:", error);
    return [];
  }
}

export default async function RENDPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"REND"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
