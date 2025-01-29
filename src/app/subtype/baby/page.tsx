"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Baby Pokémon Cards Collection",
  description:
    "Explore an extensive Baby Pokémon card collection guide. Browse through these adorable pre-evolved forms featuring charming artwork and unique abilities. Features comprehensive information about every Baby Pokémon card release, rarity details, and collection insights.",
  keywords: [
    "pokemon",
    "tcg",
    "baby pokemon",
    "pre-evolution",
    "pokemon baby",
    "pokemon tcg",
    "special cards",
    "rare cards",
    "basic pokemon",
  ],
  openGraph: {
    title: "Baby Pokémon Cards Collection",
    description:
      "Explore an extensive Baby Pokémon card collection guide. Browse through these adorable pre-evolved forms featuring charming artwork and unique abilities. Features comprehensive information about every Baby Pokémon card release, rarity details, and collection insights.",
    url: "https://pokemon.bermeo.dev/subtype/baby",
    section: "Baby Pokémon Cards",
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
        q: `subtypes:baby -set.id:mcd* -subtypes:V-UNION`,
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error(
      "Error fetching Pokemon cards at Baby Pokémon Cards Page:",
      error
    );
    return [];
  }
}

export default async function BabyCardsPage() {
  const cards = await getData();

  return (
    <Body className="bg-pink-50 dark:bg-pink-900 text-pink-950">
      <Header
        title={"Baby Pokémon Cards"}
        subtitle={"Small but Special"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
