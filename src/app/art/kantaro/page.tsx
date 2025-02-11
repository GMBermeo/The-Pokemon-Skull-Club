"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "kantaro's Art",
  description:
    "Browse kantaro's vibrant Pokémon card artwork collection. Experience their unique storytelling style that captures the evolving bonds between Trainers and Pokémon through everyday scenes, featuring bright colors and vivid settings. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "kantaro",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "kantaro's Pokémon Card Art",
    description:
      "Browse kantaro's vibrant Pokémon card artwork collection. Experience their unique storytelling style that captures the evolving bonds between Trainers and Pokémon through everyday scenes, featuring bright colors and vivid settings. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/kantaro",
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
        q: 'artist:"kantaro" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at kantaro Page:", error);
    return [];
  }
}

export default async function KantaroPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"kantaro"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
