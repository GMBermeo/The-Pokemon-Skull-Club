"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "EX Cards Collection",
  description:
    "Discover our extensive Pokémon-EX card collection guide. Browse through powerful EX variants, ultra-rare cards, and stunning full-art designs. Features comprehensive information about every EX card release, rarity details, and collection insights.",
  keywords: [
    "pokemon",
    "tcg",
    "ex",
    "pokemon ex",
    "pokemon tcg",
    "special cards",
    "rare cards",
  ],
  openGraph: {
    title: "EX Cards Collection",
    description:
      "Discover our extensive Pokémon-EX card collection guide. Browse through powerful EX variants, ultra-rare cards, and stunning full-art designs. Features comprehensive information about every EX card release, rarity details, and collection insights.",
    url: "https://pokemon.bermeo.dev/ex",
    section: "EX Cards",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/ex.jpg",
        width: 800,
        height: 450,
        type: "image/jpeg",
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData() {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "subtypes:EX -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    if (!response || !Array.isArray(response)) {
      console.error("Invalid response format from Pokemon TCG API");
      return [];
    }

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at EX Cards Page:", error);
    return [];
  }
}

export default async function EXCardsPage() {
  const cards = await getData();

  // Ensure cards is always an array
  const safeCards = Array.isArray(cards) ? cards : [];

  return (
    <Body className="bg-purple-50 dark:bg-purple-950 text-purple-950">
      <Header
        title={"EX Cards"}
        subtitle={"Special & Powerful"}
        totalCards={safeCards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={safeCards} />
    </Body>
  );
}
