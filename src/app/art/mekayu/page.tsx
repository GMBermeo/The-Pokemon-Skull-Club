"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Mékayu's Art",
  description:
    "Browse Mékayu's enchanting Pokémon card artwork collection. Experience their unique storybook-inspired style that brings a fairytale aesthetic to the Pokémon world, creating magical scenes that capture the imagination. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "mekayu",
    "mékayu",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Mékayu's Pokémon Card Art",
    description:
      "Browse Mékayu's enchanting Pokémon card artwork collection. Experience their unique storybook-inspired style that brings a fairytale aesthetic to the Pokémon world, creating magical scenes that capture the imagination. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/mekayu",
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
        q: 'artist:"Mékayu" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Mékayu Page:", error);
    return [];
  }
}

export default async function MekayuPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Mékayu"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
