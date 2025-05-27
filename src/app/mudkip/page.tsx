"use server";
import { JSX } from "react";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Mudkip",
  description:
    "'In water, Mudkip breathes using the gills on its cheeks. If it is faced with a tight situation in battle, this Pokémon will unleash its amazing power—it can crush rocks bigger than itself.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Mudkip cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "mudkip",
    "water",
    "starter",
    "pokemon tcg",
    "hoenn",
  ],
  openGraph: {
    title: "Mudkip",
    description:
      "'In water, Mudkip breathes using the gills on its cheeks. If it is faced with a tight situation in battle, this Pokémon will unleash its amazing power—it can crush rocks bigger than itself.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Mudkip cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/mudkip",
    section: "Mudkip",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/mudkip.jpg",
        width: 480,
        height: 360,
        type: "image/jpeg",
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

async function getData(): Promise<PokemonTCG.Card[]> {
  try {
    const response = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:258 -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Mudkip Page:", error);
    return [];
  }
}

export default async function MudkipPage(): Promise<JSX.Element> {
  const cards = await getData();

  return (
    <Body className="bg-blue-50 dark:bg-blue-950 text-blue-950">
      <Header
        title={"Mudkip"}
        subtitle={"The Mud Fish"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
