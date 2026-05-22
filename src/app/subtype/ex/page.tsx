import { JSX } from "react";
import { Metadata } from "next";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  alternates: { canonical: "/subtype/ex" },
  title: "EX Cards Collection",
  description:
    "Explore a extensive Pokémon-EX card collection guide. Browse through powerful EX variants, ultra-rare cards, and stunning full-art designs. Features comprehensive information about every EX card release, rarity details, and collection insights.",
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
      "Explore a extensive Pokémon-EX card collection guide. Browse through powerful EX variants, ultra-rare cards, and stunning full-art designs. Features comprehensive information about every EX card release, rarity details, and collection insights.",
    url: "https://pokemon.bermeo.dev/ex",
    section: "EX Cards",
    locale: "en_US",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData(): Promise<PokemonTCG.ICard[]> {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: `subtypes:EX -set.id:mcd* -subtypes:V-UNION`,
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at EX Cards Page:", error);
    return [];
  }
}

export default async function EXCardsPage(): Promise<JSX.Element> {
  const cards = await getData();

  return (
    <Body className="bg-purple-50 dark:bg-purple-950 text-purple-950">
      <Header
        title={"EX Cards"}
        subtitle={"Special & Powerful"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
