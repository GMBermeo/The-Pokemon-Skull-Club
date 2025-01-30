"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Bone Club - Cubones & Marowaks",
  description:
    "Discover our exclusive Cubone & Marowak Pokémon card collection guide. Explore rare variants, unique artworks, and special editions of these iconic Ground-type Pokémon. Features detailed card information and high-quality images of every Bone Club member.",
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
      "Discover our exclusive Cubone & Marowak Pokémon card collection guide. Explore rare variants, unique artworks, and special editions of these iconic Ground-type Pokémon. Features detailed card information and high-quality images of every Bone Club member.",
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

    return sortCardsByDateAndPokedex(response);
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
