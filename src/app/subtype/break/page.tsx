"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "BREAK Cards Collection",
  description:
    "Explore an extensive Pokémon BREAK card collection guide. Browse through these unique evolution cards that break through their previous limitations. Features comprehensive information about every BREAK card release, rarity details, and collection insights.",
  keywords: [
    "pokemon",
    "tcg",
    "break",
    "pokemon break",
    "pokemon tcg",
    "special cards",
    "rare cards",
    "evolution cards",
  ],
  openGraph: {
    title: "BREAK Cards Collection",
    description:
      "Explore an extensive Pokémon BREAK card collection guide. Browse through these unique evolution cards that break through their previous limitations. Features comprehensive information about every BREAK card release, rarity details, and collection insights.",
    url: "https://pokemon.bermeo.dev/break",
    section: "BREAK Cards",
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
        q: `subtypes:BREAK -set.id:mcd* -subtypes:V-UNION`,
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at BREAK Cards Page:", error);
    return [];
  }
}

export default async function EXCardsPage() {
  const cards = await getData();

  return (
    <Body className="bg-yellow-50 dark:bg-yellow-950 text-yellow-950">
      <Header
        title={"BREAK Cards"}
        subtitle={"Evolution Unleashed"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
