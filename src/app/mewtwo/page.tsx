"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Mewtwo",
  description:
    "'A Pokémon created by recombining Mew's genes. It's said to have the most savage heart among Pokémon.' 🧬 This tool was developed using the SSG with Next.js 15 in order to index all the Mewtwo cards from Pokémon TCG for a private collection. 🧬 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "mewtwo",
    "psychic",
    "legendary",
    "pokemon tcg",
    "genetic",
  ],
  openGraph: {
    title: "Mewtwo",
    description:
      "'A Pokémon created by recombining Mew's genes. It's said to have the most savage heart among Pokémon.' 🧬 This tool was developed using the SSG with Next.js 15 in order to index all the Mewtwo cards from Pokémon TCG for a private collection. 🧬 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/mewtwo",
    section: "Mewtwo",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/mewtwo.jpg",
        width: 1400,
        height: 700,
        alt: "Mewtwo",
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
        q: "nationalPokedexNumbers:150 -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Mewtwo Page:", error);
    return [];
  }
}

export default async function MewtwoPage() {
  const cards = await getData();

  return (
    <Body className="bg-purple-50 dark:bg-purple-950 text-purple-950">
      <Header
        title={"Mewtwo"}
        subtitle={"Genetic Pokémon"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
