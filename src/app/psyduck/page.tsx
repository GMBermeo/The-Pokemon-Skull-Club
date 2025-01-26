"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Psyducks",
  description:
    "'While lulling its enemies with its vacant look, this wily Pokémon will use psychokinetic powers.' 🦆 This tool was developed using the SSG with Next.js 15 in order to index all the Psyduck cards from Pokémon TCG for a private collection. 🦆 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "psyduck",
    "water",
    "psychic",
    "pokemon tcg",
    "headache",
  ],
  openGraph: {
    title: "Psyducks",
    description:
      "'While lulling its enemies with its vacant look, this wily Pokémon will use psychokinetic powers.' 🦆 This tool was developed using the SSG with Next.js 15 in order to index all the Psyduck cards from Pokémon TCG for a private collection. 🦆 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/psyduck",
    section: "Psyduck",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/psyduck.jpg",
        width: 1178,
        height: 679,
        alt: "Psyduck meme",
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
        q: "nationalPokedexNumbers:54 -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Psyduck Page:", error);
    return [];
  }
}

export default async function PsyduckPage() {
  const cards = await getData();

  return (
    <Body className="bg-blue-50 dark:bg-blue-950 text-blue-950">
      <Header
        title={"Psyduck"}
        subtitle={"Duck with a headache"}
        totalCards={cards.length}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
