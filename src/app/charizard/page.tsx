"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Charizards",
  description:
    "Explore our comprehensive Charizard Pokémon card collection guide. From vintage Base Set to modern releases, discover rare variants, secret rares, and iconic artworks of this legendary Fire-type Pokémon. Complete with market insights and collection tips.",
  keywords: [
    "pokemon",
    "tcg",
    "charizard",
    "fire",
    "dragon",
    "pokemon tcg",
    "flame",
  ],
  openGraph: {
    title: "Charizards",
    description:
      "Explore our comprehensive Charizard Pokémon card collection guide. From vintage Base Set to modern releases, discover rare variants, secret rares, and iconic artworks of this legendary Fire-type Pokémon. Complete with market insights and collection tips.",
    url: "https://pokemon.bermeo.dev/charizard",
    section: "Charizard",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/charizard1.jpg",
        width: 800,
        height: 450,
        type: "image/jpeg",
      },
      {
        url: "https://pokemon.bermeo.dev/opengraph/charizard2.jpg",
        width: 1206,
        height: 679,
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
        q: "nationalPokedexNumbers:6 -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Charizard Page:", error);
    return [];
  }
}

export default async function CharizardPage() {
  const cards = await getData();

  return (
    <Body className="bg-red-50 dark:bg-red-950 text-red-950">
      <Header
        title={"Charizard"}
        subtitle={"Flame non-dragon"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
