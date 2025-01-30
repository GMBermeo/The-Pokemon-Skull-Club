"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "VMAX Cards Collection",
  description:
    "Explore an extensive Pokémon VMAX card collection guide. Browse through these gigantic and powerful Pokémon cards featuring stunning artwork and incredible abilities. Features comprehensive information about every VMAX card release, rarity details, and collection insights.",
  keywords: [
    "pokemon",
    "tcg",
    "vmax",
    "pokemon vmax",
    "pokemon tcg",
    "special cards",
    "rare cards",
    "dynamax cards",
    "gigantamax cards",
  ],
  openGraph: {
    title: "VMAX Cards Collection",
    description:
      "Explore an extensive Pokémon VMAX card collection guide. Browse through these gigantic and powerful Pokémon cards featuring stunning artwork and incredible abilities. Features comprehensive information about every VMAX card release, rarity details, and collection insights.",
    url: "https://pokemon.bermeo.dev/subtype/v-max",
    section: "VMAX Cards",
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
        q: `subtypes:VMAX -set.id:mcd* -subtypes:V-UNION`,
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at VMAX Cards Page:", error);
    return [];
  }
}

export default async function VmaxCardsPage() {
  const cards = await getData();

  return (
    <Body className="bg-red-50 dark:bg-red-950 text-red-950">
      <Header
        title={"VMAX Cards"}
        subtitle={"Gigantic Power"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
