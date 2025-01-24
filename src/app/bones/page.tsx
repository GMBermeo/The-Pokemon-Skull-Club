"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@/lib";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Bone Club - Cubones & Marowaks",
  description:
    "'It has been seen pounding boulders with the bone it carries in order to tap out messages to others.' 🦴 This tool was developed using the SSG with Next.js 15 in order to index all the cubone and marowak cards from Pokémon TCG for a private collection. 🦴 The source code can be found on github and easily changed to any other parameter.",
  keywords: [
    "pokemon",
    "tcg",
    "cubone",
    "marowak",
    "bones",
    "pokemon tcg",
    "boneclub",
  ],
  openGraph: {
    title: "Bone Club - Cubones & Marowaks",
    description:
      "'It has been seen pounding boulders with the bone it carries in order to tap out messages to others.' 🦴 This tool was developed using the SSG with Next.js 15 in order to index all the cubone and marowak cards from Pokémon TCG for a private collection. 🦴 The source code can be found on github and easily changed to any other parameter.",
    url: "https://pokemon.bermeo.dev/bones",
    section: "Bone Club",
    locale: "en_US",
    images: [
      {
        url: "https://pokemon.bermeo.dev/opengraph/ghost_marowak.jpg",
        width: 1280,
        height: 720,
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
        q: "nationalPokedexNumbers:[104 TO 105] -set.id:mcd* -subtypes:V-UNION",
        orderBy: "-set.releaseDate",
      })
    );

    return response;
  } catch (error) {
    console.error("Error fetching Pokemon cards at Bones Page:", error);
    return [];
  }
}

export default async function BoneClubPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Bone Club"}
        subtitle={"Cubones & Marowaks"}
        totalCards={cards.length}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
