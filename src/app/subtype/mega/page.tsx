"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Mega Evolution Cards Collection",
  description:
    "Explore an extensive Pokémon Mega Evolution card collection guide. Browse through these powerful evolved forms featuring stunning artwork and incredible abilities. Features comprehensive information about every Mega Evolution card release, rarity details, and collection insights.",
  keywords: [
    "pokemon",
    "tcg",
    "mega",
    "mega evolution",
    "pokemon mega",
    "pokemon tcg",
    "special cards",
    "rare cards",
    "evolution cards",
  ],
  openGraph: {
    title: "Mega Evolution Cards Collection",
    description:
      "Explore an extensive Pokémon Mega Evolution card collection guide. Browse through these powerful evolved forms featuring stunning artwork and incredible abilities. Features comprehensive information about every Mega Evolution card release, rarity details, and collection insights.",
    url: "https://pokemon.bermeo.dev/mega",
    section: "Mega Evolution Cards",
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
        q: `subtypes:MEGA -set.id:mcd* -subtypes:V-UNION`,
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error(
      "Error fetching Pokemon cards at Mega Evolution Cards Page:",
      error
    );
    return [];
  }
}

export default async function MegaCardsPage() {
  const cards = await getData();

  return (
    <Body className="bg-blue-50 dark:bg-blue-950 text-blue-950">
      <Header
        title={"Mega Evolution Cards"}
        subtitle={"Beyond Evolution"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
