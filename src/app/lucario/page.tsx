"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Riolus & Lucarios",
  description:
    "'By catching the aura emanating from others, it can read their thoughts and movements.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Riolu and Lucario cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "riolu",
    "lucario",
    "aura",
    "pokemon tcg",
    "aurasphere",
  ],
  openGraph: {
    title: "Riolus & Lucarios",
    description:
      "'By catching the aura emanating from others, it can read their thoughts and movements.' ⚡ This tool was developed using the SSG with Next.js 15 in order to index all the Riolu and Lucario cards from Pokémon TCG for a private collection. ⚡ The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/lucario",
    section: "Lucario",
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
        q: "nationalPokedexNumbers:[447 TO 448] -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Lucario Page:", error);
    return [];
  }
}

export default async function AuraSpherePage() {
  const cards = await getData();

  return (
    <Body className="bg-cyan-50 dark:bg-cyan-900 text-cyan-950">
      <Header
        title={"Aura Sphere"}
        subtitle={"Riolus & Lucarios"}
        totalCards={cards.length}
        slotsPerPage={4}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
