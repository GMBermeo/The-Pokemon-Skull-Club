"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Pikachus",
  description:
    "'When several of these Pokémon gather, their electricity can build and cause lightning storms. It keeps its tail raised to monitor its surroundings.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Pikachu cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "pikachu",
    "electric",
    "mouse",
    "pokemon tcg",
    "thunderbolt",
  ],
  openGraph: {
    title: "Pikachus",
    description:
      "'When several of these Pokémon gather, their electricity can build and cause lightning storms. It keeps its tail raised to monitor its surroundings.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Pikachu cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/pikachu",
    section: "Pikachu",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/pikachu.jpg",
        width: 1210,
        height: 544,
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
        q: "nationalPokedexNumbers:25 -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Pikachu Page:", error);
    return [];
  }
}

export default async function PikachuPage() {
  const cards = await getData();

  return (
    <Body className="bg-yellow-50 dark:bg-yellow-950 text-yellow-950">
      <Header
        title={"Pikachu"}
        subtitle={"The face"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
