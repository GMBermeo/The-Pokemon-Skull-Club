"use server";
import { Metadata } from "next";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { Body, CardGrid, Header } from "@components";
import { baseMetadata, retryWithBackoff } from "@lib";
import { sortCardsByDateAndPokedex } from "@utils";

const metadata: Metadata = {
  ...baseMetadata,
  title: "Uninori's Art",
  description:
    "Browse Uninori's dynamic Pokémon card artwork collection. Experience their unique manga and anime-inspired art style that brings a fresh perspective to the Pokémon TCG. Features their complete gallery of illustrations with detailed card information and high-quality images.",
  keywords: [
    "pokemon",
    "tcg",
    "uninori",
    "art",
    "illustration",
    "pokemon tcg",
    "artist",
    "illustrator",
  ],
  openGraph: {
    title: "Uninori's Pokémon Card Art",
    description:
      "Browse Uninori's dynamic Pokémon card artwork collection. Experience their unique manga and anime-inspired art style that brings a fresh perspective to the Pokémon TCG. Features their complete gallery of illustrations with detailed card information and high-quality images.",
    url: "https://pokemon.bermeo.dev/art/uninori",
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
        q: 'artist:"Uninori" -set.id:mcd* supertype:"Pokémon" -subtypes:V-UNION',
        orderBy: "-set.releaseDate",
      })
    );

    return sortCardsByDateAndPokedex(response);
  } catch (error) {
    console.error("Error fetching Pokemon cards at Uninori Page:", error);
    return [];
  }
}

export default async function UninoriPage() {
  const cards = await getData();

  return (
    <Body>
      <Header
        title={"Uninori"}
        subtitle={"Pokémon Card Artist"}
        totalCards={cards.length}
        slotsPerPage={9}
      />
      <CardGrid cardCollection={cards} />
    </Body>
  );
}
