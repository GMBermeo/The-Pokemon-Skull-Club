"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Saboteri's Art",
  description:
    "Browse Saboteri's enchanting Pokémon card artwork collection. Experience their unique style that brings Pokémon to life in atmospheric and beautifully detailed scenes, as showcased in their debut with Rellor and their stunning interpretations of Ghost-type Pokémon. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "saboteri",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Saboteri's Pokémon Card Art",
    description:
      "Browse Saboteri's enchanting Pokémon card artwork collection. Experience their unique style that brings Pokémon to life in atmospheric and beautifully detailed scenes, as showcased in their debut with Rellor and their stunning interpretations of Ghost-type Pokémon. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/saboteri",
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
        q: 'artist:"Saboteri" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Saboteri Page:", error);
    return [];
  }
}

export default async function SaboteriPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Saboteri"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
