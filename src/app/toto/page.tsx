"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Totodile Evolution Line",
  description:
    "'Despite its small body, Totodile's jaws are very powerful. While it may think it is just playfully nipping, its bite has enough strength to cause serious injury.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Totodile, Croconaw and Feraligatr cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "totodile",
    "croconaw",
    "feraligatr",
    "water",
    "pokemon tcg",
    "johto",
  ],
  openGraph: {
    title: "Totodile Evolution Line",
    description:
      "'Despite its small body, Totodile's jaws are very powerful. While it may think it is just playfully nipping, its bite has enough strength to cause serious injury.' 💧 This tool was developed using the SSG with Next.js 15 in order to index all the Totodile, Croconaw and Feraligatr cards from Pokémon TCG for a private collection. 💧 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/toto",
    section: "Totodile",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/totodile.jpg",
        width: 452,
        height: 339,
        alt: "Totodile biting",
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
        q: "nationalPokedexNumbers:[158 TO 160] -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Totodile Page:", error);
    return [];
  }
}

export default async function TotodilePage() {
  const cards = await getData();

  return (
    <Body className="bg-blue-50 dark:bg-blue-950 text-blue-950">
      <Header
        title={"Totó"}
        subtitle={"Totodile, Croconaw & Feraligatr"}
        totalCards={cards.length}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
