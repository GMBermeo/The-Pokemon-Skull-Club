"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "TAG TEAM Cards Collection",
  description:
    "Explore an extensive Pokémon TAG TEAM card collection guide. Browse through these powerful team-up cards featuring stunning artwork and incredible abilities. Features comprehensive information about every TAG TEAM card release, rarity details, and collection insights.",
  keywords: [
    "pokemon",
    "tcg",
    "tag team",
    "pokemon tag team",
    "pokemon tcg",
    "special cards",
    "rare cards",
    "gx cards",
  ],
  openGraph: {
    title: "TAG TEAM Cards Collection",
    description:
      "Explore an extensive Pokémon TAG TEAM card collection guide. Browse through these powerful team-up cards featuring stunning artwork and incredible abilities. Features comprehensive information about every TAG TEAM card release, rarity details, and collection insights.",
    url: "https://pokemon.bermeo.dev/tag-team",
    section: "TAG TEAM Cards",
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
        q: `subtypes:"TAG TEAM" -set.id:mcd* -subtypes:V-UNION`,
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error(
      "Error fetching Pokemon cards at TAG TEAM Cards Page:",
      error
    );
    return [];
  }
}

export default async function TagTeamCardsPage() {
  const cards = await getData();

  return (
    <Body className="bg-blue-50 dark:bg-slate-900 text-slate-950">
      <Header
        title={"TAG TEAM Cards"}
        subtitle={"Two Pokémon, One Card"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
