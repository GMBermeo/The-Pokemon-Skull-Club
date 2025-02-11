"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Jerky's Art",
  description:
    "Browse Jerky's whimsical Pokémon card artwork collection. Experience their unique style that captures Pokémon in their everyday lives with a playful, papercraft-like aesthetic featuring soft colors and distinctive textures. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "jerky",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Jerky's Pokémon Card Art",
    description:
      "Browse Jerky's whimsical Pokémon card artwork collection. Experience their unique style that captures Pokémon in their everyday lives with a playful, papercraft-like aesthetic featuring soft colors and distinctive textures. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/jerky",
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
        q: 'artist:"Jerky" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Jerky Page:", error);
    return [];
  }
}

export default async function JerkyPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Jerky"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
