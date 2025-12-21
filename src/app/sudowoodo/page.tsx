import {use, type JSX } from "react";
import type { Metadata } from "next";
import { PokemonTCG } from "@pokelib/pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Bonsly & Sudowoodo",
  description:
    "'Although it always pretends to be a tree, its body is actually more like rock than like plant material.' 🌳 This tool was developed using the SSG with Next.js 15 in order to index all the Sudowoodo and Bonsly cards from Pokémon TCG for a private collection. 🌳 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "sudowoodo",
    "bonsly",
    "rock",
    "tree",
    "pokemon tcg",
    "imitation",
  ],
  openGraph: {
    title: "Bonsly & Sudowoodo",
    description:
      "'Although it always pretends to be a tree, its body is actually more like rock than like plant material.' 🌳 This tool was developed using the SSG with Next.js 15 in order to index all the Sudowoodo and Bonsly cards from Pokémon TCG for a private collection. 🌳 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/sudowoodo",
    section: "Sudowoodo",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/sudowoodo.jpg",
        width: 800,
        height: 450,
        alt: "Sudowoodos",
        type: "image/jpeg",
      },
    ],
  },
};

export function generateMetadata(): Metadata {
  return metadata;
}

async function getData(): Promise<PokemonTCG.ICard[]> {
  try {
    const sudowoodoResponse: PokemonTCG.ICard[] = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:185 -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    const bonslyResponse: PokemonTCG.ICard[] = await retryWithBackoff(() =>
      PokemonTCG.findCardsByQueries({
        q: "nationalPokedexNumbers:438 -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex([...sudowoodoResponse, ...bonslyResponse]);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Sudowoodo Page:", error);
    return [];
  }
}

export default function SudowoodoPage(): JSX.Element {
  const cards = use(getData());

  return (
    <Body className="bg-amber-50 dark:bg-amber-950 text-amber-950">
      <Header
        title={"Os cara de pau"}
        subtitle={"Sudowoodo & Bonsly"}
        totalCards={cards.length}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
