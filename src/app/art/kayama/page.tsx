"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Tetsu Kayama's Art",
  description:
    "Browse Tetsu Kayama's distinctive Pokémon card artwork collection. Experience their unique pointillism-inspired style that provides rich textures and new perspectives on classic Pokémon, as showcased in their debut with Lunatone and Solrock. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "tetsu kayama",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Tetsu Kayama's Pokémon Card Art",
    description:
      "Browse Tetsu Kayama's distinctive Pokémon card artwork collection. Experience their unique pointillism-inspired style that provides rich textures and new perspectives on classic Pokémon, as showcased in their debut with Lunatone and Solrock. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/kayama",
    section: "Artist Gallery",
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
        q: 'artist:"Tetsu Kayama" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Tetsu Kayama Page:", error);
    return [];
  }
}

export default async function TetsuKayamaPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Tetsu Kayama"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
